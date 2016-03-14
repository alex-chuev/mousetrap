angular.module('app').controller('ActivitiesController', ['$scope', 'Images', function ($scope, Images) {
	$scope.images = Images.query();
}]);
