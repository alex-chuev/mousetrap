(function(global, ng) {
	'use strict';

	function onCanPlay() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				element.bind("canplay", function(event) {
					scope.$apply(function() {
						scope.$eval(attrs.onCanPlay, {$event: event});
					});

					event.preventDefault();
				});
			}
		};
	}

	ng.module('app')
		.directive('onCanPlay', [onCanPlay]);
}(this, angular));
