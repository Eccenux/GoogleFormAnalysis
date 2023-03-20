/**
 * Charts renderer - used for both original an exported data.
 *
 * @type ChartsRenderer
 * @param {Charts} charts General charts helper.
 */
window.chartsRenderer = (function(charts){
	function ChartsRenderer () {

		/**
		 * Add chart container to question container.
		 *
		 * @param {Node} container Question container.
		 * @param {String} chartContainerId ID for the chart container.
		 */
		function _addChartContainer(container, chartContainerId) {
			var chartContainer = document.createElement('div');
			chartContainer.id = chartContainerId;
			container.appendChild(chartContainer);
		}

		/**
		 * Render single chart.
		 *
		 * @param {SummaryRow} summaryRow Summary row.
		 * @param {Node} container Question container.
		 * @param {String} chartContainerId ID for the chart container.
		 * @param {Boolean} forceBinaryColorSet If true then binary color set is used.
		 *		This is usefull for pies with options like: [yes, no] or [yes, maybe, not really, no].
		 */
		function _renderChart(summaryRow, container, chartContainerId, forceBinaryColorSet) {
			if ('chartData' in summaryRow) {
				_addChartContainer(container, chartContainerId);
				switch (summaryRow.question.type) {
					case 'select-one':
						charts.pie(summaryRow.chartData, chartContainerId, forceBinaryColorSet);
					break;
					case 'select-many':
						charts.bar(summaryRow.chartData, chartContainerId);
					break;
					case 'date':
						charts.timeline(summaryRow.chartData, chartContainerId);
					break;
				}
			}
		}

		/**
		 * Render charts on a page.
		 *
		 * @note HTML of the summary MUST be inserted to the current document before using this function.
		 *
		 * @param {Object} summary Summary object. No functions of the summary Row are used (only properties).
		 */
		this.render = function (summary) {
			var questionContainers = document.querySelectorAll('[data-summary-title]');
			for (var i = 0; i < questionContainers.length; i++) {
				var container = questionContainers[i];
				var title = container.getAttribute('data-summary-title');
				var questionType = container.className.replace(/^question-/, '');
				var chartContainerId = 'chart-container-' + i.toString();

				if (!(title in summary)) {
					continue;
				}
				var summaryRow = summary[title];

				if (questionType != 'grid') {
					_renderChart(summaryRow, container, chartContainerId);
				}
				else {
					var subQuestionContainers = container.querySelectorAll('.sub-summary');
					var subQuestionTitles = container.querySelectorAll('.sub-summary > h2 > .title');
					for (var j = 0; j < subQuestionContainers.length; j++) {
						var subContainer = subQuestionContainers[j];
						var subTitle = subQuestionTitles[j].textContent;
						var subChartContainerId = chartContainerId + '-' + j.toString();
						if (subTitle in summaryRow.summary) {
							_renderChart(summaryRow.summary[subTitle], subContainer, subChartContainerId, true);
						}
					}
				}
			}
		};
	}

	return new ChartsRenderer();
})(window.charts);