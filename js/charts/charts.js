//
// AmChart language
//
var userLanguage = window.navigator.userLanguage || window.navigator.language;
switch (userLanguage) {
	case 'pl':
		//AmCharts.dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		//AmCharts.shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		//AmCharts.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		AmCharts.shortMonthNames = ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'];
	break;
}

/**
 * General charts helper singleton.
 *
 * You can rewrite this class to use your favorite chart library.
 *
 * @note Be sure container for a chart is ready before you call any of the chart functions.
 *
 * AmChart help:
 * <li>Main class: http://docs.amcharts.com/javascriptcharts/AmChart
 * <li>Base class for graphs: http://docs.amcharts.com/javascriptcharts/AmGraph
 *
 * @type Charts
 */
window.charts = (function(AmCharts, colorGenerator){
	var _LOG = new Logger("charts");

	var colorIndexes = {};

	var colorScheme = {
		start : '#36c',
		stop : '#bcd',
		yes : {
			start : '#393',
			stop : '#9c9'
		},
		no : {
			start : '#933',
			stop : '#c99'
		},
	}

	/**
	 * General charts helper class.
	 * 
	 * @returns {Charts}
	 */
	function Charts () {

		/**
		 * Check if the container is ready.
		 *
		 * @param {String} containerId
		 * @returns {Boolean}
		 */
		function _checkContiner(containerId) {
			if (!(document.getElementById(containerId))) {
				_LOG.error("Chart container not ready. id:", containerId);
				return false;
			}
			return true;
		}

		/**
		 * Render an option.
		 *
		 * @param {String} title Title of the option.
		 * @param {Number} totalForOption Total votes for the option.
		 * @param {Number} index Option index (used for generting color).
		 * @param {Number} optionsCount Number of options.
		 * @returns {Object} Single chart data object. Generated color can be used in a custom legend.
		 */
		this.renderOption = function(title, totalForOption, index, optionsCount) {
			if (!(optionsCount in colorIndexes)) {
				colorIndexes[optionsCount] = colorGenerator.generate(colorScheme.start, colorScheme.stop, optionsCount);
			}
			return {
				title : title, //+ ' ' + totalForOption,
				value : totalForOption,
				color : colorIndexes[optionsCount][index]
			};
		};

		/**
		 * Render a point.
		 *
		 * @param {String} title Title of the option.
		 * @param {Number} totalForOption Total votes for the option.
		 * @returns {Object} Single chart data object.
		 */
		this.renderPoint = function(title, totalForOption) {
			return {
				title : title, //+ ' ' + totalForOption,
				value : totalForOption
			};
		};

		/**
		 * Pie chart.
		 *
		 * @param {Array} chartData [{title:"...", value:123}, ...]
		 * @param {String} containerId Container for the chart.
		 * @param {Boolean} forceBinaryColorSet If true then binary color set is used.
		 *		This is usefull for pies with options like: [yes, no] or [yes, maybe, not really, no].
		 */
		this.pie = function(chartData, containerId, forceBinaryColorSet) {
			if (!_checkContiner(containerId)) {
				return;
			}

			// binary color scheme
			if (forceBinaryColorSet) {
				var halfLength = Math.ceil(chartData.length / 2);
				var yesColors = colorGenerator.generate(colorScheme.yes.start, colorScheme.yes.stop, halfLength);
				var noColors = colorGenerator.generate(colorScheme.no.stop, colorScheme.no.start, halfLength);
				for (var i = 0; i < halfLength; i++) {
					chartData[i].color = yesColors[i];
				}
				for (var i = halfLength; i < chartData.length; i++) {
					chartData[i].color = noColors[i - halfLength];
				}
			}

			// PIE CHART
			var chart;
			chart = new AmCharts.AmPieChart();
			chart.dataProvider = chartData;
			chart.titleField = "title";
			chart.valueField = "value";
			chart.colorField = "color";
			chart.outlineColor = "#FFFFFF";
			chart.outlineAlpha = 0.8;
			chart.outlineThickness = 2;
			// animation
			chart.startDuration = 0;	// time
			//chart.startEffect = "<";	// style

			// hide labels
			chart.labelsEnabled = false;

			// WRITE
			chart.write(containerId);
		};

		/**
		 * Bar chart.
		 *
		 * @param {Array} chartData [{title:"...", value:123}, ...]
		 * @param {String} containerId Container for the chart.
		 */
		this.bar = function(chartData, containerId) {
			// SERIAL CHART
			var chart = new AmCharts.AmSerialChart();
			chart.pathToImages = "js/charts/amcharts/images/";
			chart.dataProvider = chartData;
			chart.categoryField = "title";
			chart.colorField = "color";
			chart.startDuration = 0;
			chart.rotate = true;

			// column graph
			var graph = new AmCharts.AmGraph();
			graph.type = "column";
			graph.title = "";
			graph.valueField = "value";
			graph.lineColor = colorScheme.start;
			graph.lineAlpha = 0;
			graph.fillAlphas = 0.85;
			chart.addGraph(graph);

			// WRITE
			chart.write(containerId);
		};

		/**
		 * Timeline chart.
		 *
		 * @param {Array} chartData [{title:"...", value:123}, ...]
		 * @param {String} containerId Container for the chart.
		 */
		this.timeline = function(chartData, containerId) {
			// SERIAL CHART
			var chart = new AmCharts.AmSerialChart();
			chart.pathToImages = "js/charts/amcharts/images/";
			chart.dataProvider = chartData;
			chart.categoryField = "title";
			chart.startDuration = 0;

			// time-axis
			var categoryAxis = chart.categoryAxis;
			categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
			categoryAxis.minPeriod = "DD"; // our data is yearly, so we set minPeriod to YYYY
			categoryAxis.gridAlpha = 0;

			// value-axis
			var valueAxis = new AmCharts.ValueAxis();
			valueAxis.axisAlpha = 0;
			valueAxis.inside = true;
			chart.addValueAxis(valueAxis);

			// moving-label
			var chartCursor = new AmCharts.ChartCursor();
			chartCursor.cursorAlpha = 0;
			chartCursor.cursorPosition = "mouse";
			chartCursor.categoryBalloonDateFormat = "MMM DD";
			chart.addChartCursor(chartCursor);

			// column graph
			var graph = new AmCharts.AmGraph();
			graph.type = "line";
			graph.valueField = "value";
			graph.lineColor = colorScheme.start;
			graph.bullet = "round";
			graph.bulletSize = 7;
			graph.lineThickness = 2;
			chart.addGraph(graph);

			// WRITE
			chart.write(containerId);
		};

	}

	return new Charts();
})(AmCharts, window.colorGenerator);