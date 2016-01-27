angular.module('starter.services', [])

// Calls the PHP files on the server
.factory('PHPget', function($http, $httpParamSerializerJQLike) {

	var prePath = 'http://vegardaaberge.no/Maintenance/';

	return {
		data: function(path, type) {
			var path = prePath + path; 
			
			return $http({
				url: path,
				method: 'POST',
				data: 'data='+ type,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
		},
		dataObject: function(path, data) {
			var path = prePath + path; 

			return $http({
				url: path,
				method: 'POST',
				data: $httpParamSerializerJQLike(data),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
		},
	}
})

.factory('azure', function($http, $httpParamSerializerJQLike) {
	var prePath = 'http://apartmentservice.azurewebsites.net/';

	return {
		dataGET: function(path) {
			var path = prePath + path; 
			
			return $http({
				url: path,
				method: 'GET'
			})
		},
		dataPOST: function(path, data) {
			var path = prePath + path; 
			
			return $http({
				url: path,
				method: 'POST',
				data: $httpParamSerializerJQLike(data),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
		},
		dataPUT: function(path, data) {
			var path = prePath + path; 
			
			return $http({
				url: path,
				method: 'PUT',
				data: $httpParamSerializerJQLike(data),
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
		}
	}
})

// Calls cordova functions
.service('cordova', function($cordovaCamera, $cordovaFileTransfer) {
	this.camera = function(){
		var options = {
		    quality: 90,
			destinationType: Camera.DestinationType.FILE_URI,
			sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
			targetWidth: 1500,
			targetHeight: 1500
		};

	    return $cordovaCamera.getPicture(options);
	}

	this.fileUpload = function(targetPath, filename, directory){
		var url = "http://vegardaaberge.no/Maintenance/upload.php";

		var options = {
			fileKey: "file",
			fileName: filename,
			chunkedMode: false,
			mimeType: "image/jpg",
			params : {'directory': directory, 'fileName':filename}
		};

	    return $cordovaFileTransfer.upload(url, targetPath, options);
	}
})

// Get the options for the subcategory
.service('category', function() {
	this.getData = function(Subcategory){
		if(Subcategory == 'Choice1'){
			var Options = ['choice 1','choice 2', 'choice 3'];
		}else if(Subcategory == 'Choice2'){
			var Options = ['choice 4','choice 5', 'choice 6', 'choice 7'];
		}else if(Subcategory == 'Choice3'){
			var Options = ['choice 8','choice 9'];
		}else if(Subcategory == 'Choice4'){
			var Options = ['choice 10','choice 11', 'choice 12', 'choice 13', 'choice 14'];
		}else{
			var Options = [];
		}
		return Options;
	}

	this.getText = function(Category){
		if(Category == ''){
			var optionText = '';
		}else{
			var optionText = '- Choose Subcategory -';
		}
		return optionText;
	}
})

// Get the settings when user changes view in tasks
.service('changeView', function() {
	this.setActive = function(path){
		if(path =='current'){
			active = {
				current: true,
				completed: false
			}				
		}else{
			active = {
				current: false,
				completed: true
			}
		}
		return active;
	}
})

// Helper services for create task
.service('submitData', function() {
	this.check = function(formData){
		if(formData){
			if(formData.ProjectName && formData.Category && formData.Subcategory && formData.Address && formData.PhoneNumber){
				if(!formData.Information){
					formData.Information = ' ';
				}
				return formData;
			}else{
				return 'You need to input project name, address, phone number, and choose options';
			}
		}else{
			return 'Please input the project information';
		}	
	}

	this.create = function(page, formData, bit, user, info){
		if(page == 'create'){
			var formData = formData;
		}else if(page == 'assigned'){
			if(!info){
				info = ' ';
			}
			var formData = {
				id: bit,
				info: info,
				user: user
			}
		}
		return formData;	
	}
})

// For info, converts numbers into text 
.service('convertStatus', function() {
	this.get = function(data){
		if(data.Status == 0){
			data.Status = 'Technican not assigned';
		}else if(data.Status == 1){
			data.Status = 'Currently assigned to ' + data.Responsible;
		}else if(data.Status == 2){
			data.Status = 'Completed';
		}else{
			data.Status = 'Unknown status';
		}
		return data.Status;
	}
});
