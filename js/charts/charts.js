/**
 * Charts helper.
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
		stop : '#bcd'
	}

	/**
	 * Charts helper class.
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
		 * @returns {Object} Chart object. Generated color can be used in a custom legend.
		 */
		this.renderOption = function(title, totalForOption, index, optionsCount) {
			if (!(optionsCount in colorIndexes)) {
				colorIndexes[optionsCount] = colorGenerator.generate('#36c', '#bcd', optionsCount);
			}
			return {
				title : title + ' ' + totalForOption,
				value : totalForOption,
				color : colorIndexes[optionsCount][index]
			};
		};

		/**
		 * Pie chart.
		 *
		 * @param {Array} chartData [{title:"...", value:123}, ...]
		 * @param {String} containerId Container for the chart.
		 */
		this.pie = function(chartData, containerId) {
			if (!_checkContiner(containerId)) {
				return;
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
			chart = new AmCharts.AmSerialChart();
			chart.pathToImages = "js/charts/amcharts/images/";
			chart.dataProvider = chartData;
			chart.categoryField = "title";
			chart.colorField = "color";
			chart.startDuration = 1;
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

	}

	return new Charts();
})(AmCharts, window.colorGenerator);