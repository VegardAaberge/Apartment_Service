angular.module('Maintenance', ['ionic', 'starter.controllers','starter.services', 'ngCordova', 'ngStorage'])

// Start Ionic 
// Check that application is ready for phone service
.run(function($rootScope, $ionicPlatform) {
	$rootScope.appReady = {status:false};

	$ionicPlatform.ready(function() {

		$rootScope.appReady.status = true;
		$rootScope.$apply();

		if(window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if(window.StatusBar) {
			StatusBar.styleDefault();
		}
	});
})

// Routing
.config(function($stateProvider, $urlRouterProvider, $compileProvider) {
	$stateProvider
		.state('login', {
			url: '/',
			templateUrl: 'templates/login.html',
			controller: 'loginController'
		})
		.state('home', {
			url: '/home',
			templateUrl: 'templates/home.html',
			controller: 'HomeController'
		})
		.state('fullscreen', {
			url: '/fullscreen',
			templateUrl: 'templates/fullscreen.html',
			controller: 'fullscreenController'
		})

		/* Create */
		.state('create', {
			url: '/create/create',
			templateUrl: 'templates/create/create.html',
			controller: 'createController'
		})
		.state('image', {
			cache: false,
			url: '/create/image',
			templateUrl: 'templates/create/image.html',
			controller: 'imageController'
		})

		/* Mytasks */
		.state('tasksMytasks', {
			url: '/mytasks/tasks',
			templateUrl: 'templates/mytasks/tasks.html',
			controller: 'listController'
		})
		.state('infoMytasks', {
			url: '/mytasks/info/:bit',
			templateUrl: 'templates/mytasks/info.html',
			controller: 'infoController'
		})


		/* Assigned */
		.state('tasksAssigned', {
			url: '/assigned/current',
			templateUrl: 'templates/assigned/tasks.html',
			controller: 'listController' 
		})
		.state('infoAssigned', {
			url: '/assigned/info/:bit',
			templateUrl: 'templates/assigned/info.html',
			controller: 'infoController'
		})
		.state('imageAssigned', {
			cache: false,
			url: '/assigned/image/:bit',
			templateUrl: 'templates/assigned/image.html',
			controller: 'imageController'
		})
		
	$urlRouterProvider.otherwise('/')

	$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|content|file|assets-library):/);
})

// Done when user click on home. Go to the home page. 
.directive('homeButton', function($location){
    return {
      restrict: 'A',

      link: function(scope, element, attrs) {
        element.bind('click', home);

        function home() {
        	$location.path("/home");
        	scope.$apply();
        }
      }
    }
})

// Done when user click on back. Goes back to previous page. 
.directive('backButton', function($ionicHistory){
    return {
      restrict: 'A',

      link: function(scope, element, attrs) {
        element.bind('click', home);

        function home() {
        	$ionicHistory.goBack();
        	scope.$apply();
        }
      }
    }
});