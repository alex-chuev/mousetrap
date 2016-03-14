angular.module('app', ['ui.router', 'ui.bootstrap'])
	.config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {
		$urlRouterProvider
			.when('', '/dashboard')
			.when('/', '/dashboard')
		;

		$stateProvider
			.state('dashboard', {
				url: '/dashboard',
				templateUrl: 'templates/dashboard.html'
			})
			.state('activities', {
				url: '/activities',
				templateUrl: 'templates/activities.html'
			})
		;
	}]);
