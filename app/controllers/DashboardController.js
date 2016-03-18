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
		average = numberHelper.average,
		widthOfMinimalAnalyzeZone = 10,
		heightOfMinimalAnalyzeZone = 10,
		minimalAnalyzeZoneCanvas = document.createElement('canvas'),
		minimalAnalyzeZoneContext = minimalAnalyzeZoneCanvas.getContext('2d');

	$scope.stream = null;
	$scope.isMotionDetected = false;
	$scope.showMotionDetection = false;
	$scope.saveImage = false;
	$scope.onCanPlay = onCanPlay;
	$scope.videoWidth = 800;
	$scope.videoHeight = 600;

	var minimalAnalyzeZoneCanvasWidth = minimalAnalyzeZoneCanvas.width = $scope.videoWidth / widthOfMinimalAnalyzeZone;
	var minimalAnalyzeZoneCanvasHeight = minimalAnalyzeZoneCanvas.height = $scope.videoHeight / heightOfMinimalAnalyzeZone;

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
			coefficientOfDifferenceForCapture = 0.00003;

		canvas.width = $scope.videoWidth;
		canvas.height = $scope.videoHeight;

		var prevImage = getAnalyzeImageData();

		$interval(function() {
			var currentImage = getAnalyzeImageData();
			$scope.differentPixels = getDifferentPixels(prevImage.data, currentImage.data);

			if(($scope.isMotionDetected = motionHasBeen($scope.differentPixels.length)) && $scope.saveImage) {
				saveImage();
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

		function getAnalyzeImageData() {
			captureImage(videoDomNode);
			minimalAnalyzeZoneContext.drawImage(canvas, 0, 0, minimalAnalyzeZoneCanvasWidth, minimalAnalyzeZoneCanvasHeight);
			return minimalAnalyzeZoneContext.getImageData(0, 0, minimalAnalyzeZoneCanvasWidth, minimalAnalyzeZoneCanvasHeight);
		}

		function getDifferentPixels(prevImageData, currentImageData) {
			var threshold = 25,
				differentPixels = [];

			for(var i = 0, length = prevImageData.length; i < length; i += 4) {
				var r = abs(prevImageData[i] - currentImageData[i]),
					g = abs(prevImageData[i + 1] - currentImageData[i + 1]),
					b = abs(prevImageData[i + 2] - currentImageData[i + 2]);

				if(average(r, g, b) > threshold) {
					differentPixels.push(i / 4);
				}
			}

			return differentPixels;
		}
	}
}]);
