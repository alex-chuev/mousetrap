angular.module('app').controller('DashboardController', ['$scope', '$sce', '$interval', 'Images', 'numberHelper', function($scope, $sce, $interval, Images, numberHelper) {
	var canvas = document.createElement('canvas'),
		context = canvas.getContext('2d'),
		getUserMedia = (
			navigator.getUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia ||
			navigator.msGetUserMedia
		).bind(window.navigator),
		abs = numberHelper.abs,
		average = numberHelper.average;

	$scope.stream = null;
	$scope.isMotionDetected = false;
	$scope.showMotionDetection = false;
	$scope.saveImage = false;
	$scope.onCanPlay = onCanPlay;
	$scope.videoWidth = 800;
	$scope.videoHeight = 600;

	getUserMedia({
		audio: false,
		video: {
			mandatory: {
				minWidth: $scope.videoWidth,
				minHeight: $scope.videoHeight
			}
		}
	}, onSuccess, onError);

	function onSuccess(stream) {
		var url = window.URL.createObjectURL(stream);

		$scope.stream = $sce.trustAsResourceUrl(url);
		$scope.$apply();
	}

	function onError(error) {}

	function onCanPlay(event) {
		var videoDomNode = event.target,
			coefficientOfDifferenceForCapture = 0.02;

		canvas.width = $scope.videoWidth;
		canvas.height = $scope.videoHeight;

		var prevImage = captureImage(videoDomNode);

		$interval(function() {
			var currentImage = captureImage(videoDomNode),
				differentPixels = getDifferentPixels(prevImage.data, currentImage.data);

			if(($scope.isMotionDetected = motionHasBeen(differentPixels.length)) && $scope.saveImage) {
				saveImage();
			}

			if($scope.showMotionDetection) {

			}

			prevImage = currentImage;
		}, 50);

		function motionHasBeen(differentPixelsCount) {
			return differentPixelsCount > $scope.videoWidth * $scope.videoHeight * coefficientOfDifferenceForCapture;
		}

		function saveImage() {
			var image = new Images({
				data: canvas.toDataURL('image/jpeg')
			});
			image.$save();
		}

		function captureImage(video) {
			context.drawImage(video, 0, 0, $scope.videoWidth, $scope.videoHeight);
			return context.getImageData(0, 0, $scope.videoWidth, $scope.videoHeight);
		}

		function getDifferentPixels(prevImageData, currentImageData) {
			var threshold = 20,
				differentPixels = [];

			for(var i = 0, length = prevImageData.length; i < length; i += 4) {
				var r = abs(prevImageData[i] - currentImageData[i]),
					g = abs(prevImageData[i + 1] - currentImageData[i + 1]),
					b = abs(prevImageData[i + 2] - currentImageData[i + 2]);

				if(average(r, g, b) > threshold) {
					differentPixels.push(i)
				}
			}

			return differentPixels;
		}
	}
}]);
