describe('numberHelper', function () {
	beforeEach(module('app'));

	describe('abs method', function () {
		it('works correctly', inject(function (numberHelper) {
			expect(numberHelper.abs(-2)).toEqual(2);
			expect(numberHelper.abs(0)).toEqual(0);
			expect(numberHelper.abs(2)).toEqual(2);
		}));
	});
});
