angular.module('starter.controllers', [])

// Controls the login Menu
.controller('loginController', 
	function($scope, $http, $location, $sessionStorage, $http, PHPget){	

	
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
			PHPget.dataObject('login.php', logindata).success(function(data){
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
	function($scope, $http, $location, $sessionStorage, PHPget, changeView, azure){

	// Goes to the correct info page
	$scope.changePage = function(page, id){
		$location.path("/" + page + "/info/" + id);
	}

	// Changes between current tasks and completed tasks
	// Deletes the previous task lists, get the PHP data, and changes the navbar/icons.
	$scope.changeView = function(statusType, status, userType){
		delete $scope.datalist;
		var path = 'current';
		if(status == 2 && statusType != 0){
			var path = 'completed';
		}
		$scope.active = changeView.setActive(path);

		var url = userType +'/'+ $sessionStorage.user +'/'+ statusType +'/' + status;

		azure.dataGET('api/assignments/'+ url).success(function(data){
			if(data.length){
				$scope.datalist = data;
			}
		}); 
	}
})

// Controls the info view
.controller('infoController', 
	function($scope, $http, $location, $sessionStorage, $stateParams, PHPget, convertStatus, azure){
	

	azure.dataGET('api/assignments/'+ $stateParams.bit).success(function(data){
		if(data.Status == 1){
			$scope.showSubmit = true;
		}
		data.Status = convertStatus.get(data);	
		
		$scope.data = data;
	});	

	PHPget.data('getImageNames.php', $stateParams.bit).success(function(data){
		if(data[1].length > 0){
			$scope.showCompleted = true;
		}
		$scope.images = data;
	});
	
	// For loop for images
	$scope.getNumber = function(num) {
		return new Array(num);   
	}

	// Go here if user click on complete task.
	$scope.completeTask = function(formData){
		$sessionStorage.formData = formData;
		$location.path("/assigned/image/" + formData.ID);
	}
	
})

// Controls the create forms menu
.controller('createController',  
	function($scope, $filter, $rootScope, $http, $location, $sessionStorage, category, submitData){

	// Get the data, if user has submitted, but not completed the task.
	if($sessionStorage.formData){
		var data = $sessionStorage.formData;
		$scope.optionText = category.getText(data.Category);
		$scope.optionArray = category.getData(data.Category);
		$scope.formData = data;
	}
	
	// Get the options for the subcategory
	$scope.optionChange = function(Category) {
		$scope.optionText = category.getText(Category);
		$scope.optionArray = category.getData(Category);
	}

	// Check if user has filled in the form and get the current user.
	// Save it to sessionstorage and go to image
	$scope.submitForm = function(formData){
		var data = submitData.check(formData);
		if(data.Information){
			data.CreatedBy = $sessionStorage.user;
			formData.Status = "0";
			formData.TimeCreated = $filter('date')(new Date(), "yyyy-MM-ddTHH:mm:ss");

			$sessionStorage.formData = data;
			$location.path("/create/image"); 
		}else{
			alert(data);
		}
	}
})

// Controls the two upload images pages
.controller('imageController', 
	function($scope, $rootScope, $location, $http, $sessionStorage, $httpParamSerializerJQLike, $stateParams, cordova, PHPget, azure) {

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
		var formData = $sessionStorage.formData;

		if(formData.Status == "0"){
			azure.dataPOST('api/assignments', formData).success(function(data){
				updateImages('0', data, 'Task has been created');
			});
		}else{
			formData.Status = '2';
			formData.TechnicalInfo = info;
			
			azure.dataPUT('api/assignments/' + formData.ID, formData).success(function(data){
				updateImages('1', formData, 'Task has been completed');
			});
		}
		
		function updateImages(Type, data, message){
			data.Type = Type;
			data.User = $sessionStorage.user;
			PHPget.dataObject('updateImages.php', data).success(function(data){
				alert(message);	
				$scope.images = [];
				$sessionStorage.images = $scope.images;
				$scope.count = 0;
				delete $sessionStorage.formData;
				$location.path('/home');
			});
		}
	}

	// Get the images from the phone
	$scope.selectImages = function() {
		console.log('test');
		cordova.camera().then(function(imageUri) {
	        $scope.show=true;
			$scope.images.push(imageUri);
			$sessionStorage.images = $scope.images;
			$scope.fileUpload($scope.count, imageUri);
			$scope.count++;
	    }, function(error){
	    	console.log(JSON.stringify(error));
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