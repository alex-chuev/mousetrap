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
		}
	};
}]);
