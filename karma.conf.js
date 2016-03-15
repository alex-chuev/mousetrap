module.exports = function (config) {
	config.set({
		basePath: '',
		frameworks: ['jasmine'],
		files: [
			'node_modules/angular/angular.js',
			'node_modules/angular-ui-router/release/angular-ui-router.js',
			'node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
			'node_modules/angular-resource/angular-resource.js',
			'node_modules/angular-mocks/angular-mocks.js',
			'app/**/*.js',
			'app/**/__tests__/*.js'
		],
		exclude: [],
		preprocessors: {},
		reporters: ['progress'],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: ['Chrome'],
		singleRun: false
	})
};
