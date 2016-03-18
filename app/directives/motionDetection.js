(function(global, ng) {
	function motionDetection() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var context = element[0].getContext('2d'),
					canvasWidth = attrs.width,
					canvasHeight = attrs.height,
					areaWidth = canvasWidth / 10,
					animationDuration = 300,
					layers = [];

				function draw() {
					requestAnimationFrame(draw);

					context.clearRect(0, 0, canvasWidth, canvasHeight);
					addLayer(scope.differentPixels);

					for(var i = layers.length - 1; i >= 0; --i) {
						var layer = layers[i],
							cancelAnimationCoefficient = getAnimationCompletionCoefficient(layer.time);

						if(cancelAnimationCoefficient === 1) {
							removeLayer(layer);
							continue;
						}

						context.fillStyle = getLayerColor(cancelAnimationCoefficient);
						drawLayer(layer);
					}
				}

				function drawLayer(layer) {
					for(var i = 0, length = layer.data.length; i < length; ++i) {
						var pixelId = layer.data[i],
							x = pixelId % areaWidth * 10,
							y = (pixelId / areaWidth ^ 0) * 10;

						context.fillRect(x, y, 10, 10);
					}
				}

				function getAnimationCompletionCoefficient(time) {
					var coefficient = (Date.now() - time) / animationDuration;
					return Math.min(1, coefficient);
				}

				function getLayerColor(coefficient) {
					var alpha = Math.round(Math.max(0.3 - 0.3 * coefficient, 0) * 100) / 100;
					return 'rgba(255, 0, 0,' + alpha + ')';
				}

				function addLayer(layer) {
					layers.push({
						data: layer,
						time: Date.now()
					});
				}

				function removeLayer(layer) {
					var index = layers.indexOf(layer);

					if(index !== -1) {
						layers.splice(index, 1);
					}
				}

				draw();
			}
		};
	}

	ng.module('app')
		.directive('motionDetection', [motionDetection]);
}(this, angular));
