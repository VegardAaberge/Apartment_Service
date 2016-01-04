angular.module('starter.controllers', [])

// Controls the login Menu
.controller('loginController', 
	function($scope, $http, $location, $sessionStorage, PHPget){	

	// Gives login information for easier login,
	// Only exist in the English Demo version.
	$scope.logindata = {
		username: 'ola',
		password: 'abc'
	}

	// Checks login information with the server. 
	// If correct, saves the username for later use.
	$scope.login = function(logindata){
		if(logindata){
			var data = PHPget.dataObject('login.php', logindata).success(function(data){
				if(data == 1){
					$sessionStorage.user = (logindata.username).toLowerCase();
					$location.path("/home");
				}else{
					alert('Wrong username or password');
				}
			});
		}else{
			alert('Please fill in your username and password');
		}
	}

})

// Controls the Main Menu
.controller('HomeController', 
	function($scope, $http, $location, $sessionStorage){

	$scope.create = function(){
		$location.path("/create/create");
	}
	$scope.mytasks = function(){
		$location.path("/mytasks/tasks");
	}
	$scope.assigned = function(){
		$location.path("/assigned/current");
	}
	$scope.logout = function(){
		delete $sessionStorage.user;
		delete $sessionStorage.formData;
		delete $sessionStorage.imagePage;
		delete $sessionStorage.images;
		delete $sessionStorage.img;
		$location.path("/");
	}
})

// Controls all of the task pages
.controller('listController', 
	function($scope, $http, $location, $sessionStorage, PHPget, changeView){

	// Goes to the correct info page
	$scope.changePage = function(page, id){
		$location.path("/" + page + "/info/" + id);
	}

	// Changes between current tasks and completed tasks
	// Deletes the previous task lists, get the PHP data, and changes the navbar/icons.
	$scope.changeView = function(path, userType){
		delete $scope.datalist;
		var dataPost = changeView.getData(path, userType, $sessionStorage.user);
		$scope.active = changeView.setActive(path);

		// Call service to get the tasks depending on what the user has requested. 
		PHPget.dataObject('getData.php', dataPost).success(function(data){
			if(data != 'null'){
				$scope.datalist = data;
			}
		});	
	}
})

// Controls the info view
.controller('infoController', 
	function($scope, $http, $location, $sessionStorage, $stateParams, PHPget, convertStatus){
	
	//Get the info data from the server for the ID chosen
	PHPget.data('getInfo.php', $stateParams.bit).success(function(data){
		//Show the images, and complete button, if the conditions is right
		if(data.imageCount1 > 0){
			$scope.showCompleted = true;
		}
		if(data.status == 1){
			$scope.showSubmit = true;
		}

		// Convert the status to a text format. 
		data.status = convertStatus.get(data);
		$scope.data = data;
	});
	
	// For loop for images
	$scope.getNumber = function(num) {
		return new Array(num);   
	}

	// Go here if user click on complete task.
	$scope.completeTask = function(id){
		$location.path("/assigned/image/" + id);
	}
	
})

// Controls the create forms menu
.controller('createController',  
	function($scope, $rootScope, $http, $location, $sessionStorage, optionB, submitData){

	// Get the data, if user has submitted, but not completed the task.
	if($sessionStorage.formData){
		var data = $sessionStorage.formData;
		$scope.optionText = optionB.getText(data.optionA);
		$scope.optionArray = optionB.getData(data.optionA);
		$scope.formData = data;
	}
	
	// Get the options for the subcategory
	$scope.optionChange = function(optionA) {
		$scope.optionText = optionB.getText(optionA);
		$scope.optionArray = optionB.getData(optionA);
	}

	// Check if user has filled in the form and get the current user.
	// Save it to sessionstorage and go to image
	$scope.submitForm = function(formData){
		var data = submitData.check(formData);
		if(data.info){
			data.created_by = $sessionStorage.user;
			$sessionStorage.formData = data;
			$location.path("/create/image"); 
		}else{
			alert(data);
		}
	}
})

// Controls the two upload images pages
.controller('imageController', 
	function($scope, $rootScope, $location, $http, $sessionStorage, $stateParams, cordova, PHPget, submitData) {

	// Initialize the scope variables. 
	// Doesn't cache, hence run every time, because it is important that scope is synchronized with the server cache
	$scope.init = function(page){
		$scope.ready = false;
		$scope.images = [];

		// Check if user visit another image page. 
		if($sessionStorage.imagePage != page){
			$sessionStorage.images = $scope.images;
			$scope.count = 0;
			PHPget.data('deleteCache.php', $sessionStorage.user);
			$sessionStorage.imagePage = page;
		}else{
			$scope.images = $sessionStorage.images;
			$scope.count = $scope.images.length;
			$scope.show=true;
		}
	}

	// Check if application is ready 
	$rootScope.$watch('appReady.status', function() {
		if($rootScope.appReady.status){
			$scope.ready = true;
		} 
	});
	

	// Get the properties, and save the data to server
	$scope.submit = function(info){
		var formData = submitData.create($sessionStorage.imagePage, $sessionStorage.formData, $stateParams.bit, $sessionStorage.user, info);	
		
		PHPget.dataObject('createTask.php', formData).success(function(data){
			alert(data);
			$scope.images = [];
			$sessionStorage.images = $scope.images;
			$scope.count = 0;
			delete $sessionStorage.formData;
			$location.path('/home');
		});
	}

	// Get the images from the phone
	$scope.selectImages = function() {
		cordova.camera().then(function(imageUri) {
	        $scope.show=true;
			$scope.images.push(imageUri);
			$sessionStorage.images = $scope.images;
			$scope.fileUpload($scope.count, imageUri);
			$scope.count++;
	    });
	};
  
  	// Upload the image to the server
	$scope.fileUpload = function (i, targetPath) {
		var filename = 'image' + i + '.jpg';
		var directory = 'cache/' + $sessionStorage.user;

		cordova.fileUpload(targetPath, filename, directory).then(function(imageUri) {
			console.log('uploaded image');
		});
	}

	// Go to fullscreen if the user clicked on an image
	$scope.fullscreen = function(img){
		$sessionStorage.img = img;
		$location.path("/fullscreen");
	}
})

// Controls the full screen mode for upload image menu
.controller('fullscreenController', 
	function($scope, $location, $sessionStorage) {
		$scope.img = $sessionStorage.img;
});