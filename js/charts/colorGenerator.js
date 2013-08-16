/**
 * Color generator.
 *
 * @author bebraw <http://stackoverflow.com/users/228885/bebraw>
 *
 * @type ColorGenerator
 * @param {Color} Color Helper class for colors.
 */
window.colorGenerator = (function(Color){
	function ColorGenerator () {

		function _interpolation(a, b, factor) {
			var ret = [];

			for(var i = 0; i < Math.min(a.length, b.length); i++) {
				ret[i] = a[i] * (1 - factor) + b[i] * factor;
			}

			return ret;
		}

		this.generate = function (start, end, n) {
			var ret = [];

			var a = new Color(start);
			var b = new Color(end);

			for(var i = 0; i < n; i++) {
				var color = new Color();
				var rgb = _interpolation(a.toRGBArray(), b.toRGBArray(), i / (n - 1));
				color.setRGB(rgb[0], rgb[1], rgb[2]);
				ret.push('#'+color.toString());
			}

			return ret;
		};

	}

	return new ColorGenerator();
})(Color);