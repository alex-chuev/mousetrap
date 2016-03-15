angular.module('app').factory('numberHelper', [function () {
	return {
		/**
		 * More faster implementation of the Math.abs method
		 *
		 * @param {number} value
		 * @returns {number}
		 */
		abs: function (value) {
			return (value ^ (value >> 31)) - (value >> 31);
		},

		/**
		 * Returns the average value of the color
		 *
		 * @param {number} red
		 * @param {number} green
		 * @param {number} blue
		 * @returns {number}
		 */
		average: function(red, green, blue) {
			return (red + green + blue) / 3;
		}
	};
}]);
