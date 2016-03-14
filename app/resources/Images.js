angular.module('app').factory('Images', ['$resource', function ($resource) {
	return $resource('images');
}]);
