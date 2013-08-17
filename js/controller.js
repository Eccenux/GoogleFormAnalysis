/**
 * Parsing data to answers.
 */
window.questions = new Questions(questionsData);
window.answers = new Answers(answersData, questions);

/**
 * Creating summary (visual and object with SummaryRows in an assoc. array).
 *
 * When filtering sets are enabled it will return summary from the first set.
 *
 * @param {Answers} answers Parsed answers.
 * @param {Questions} questions Parsed questions.
 * @type Object
 */
window.summary = (function(answers, questions, filterSets){
	var _LOG = new Logger("controller");

	/**
	 * Render charts.
	 */
	function _renderCharts(summary) {
		var questionContainers = document.querySelectorAll('[data-summary-title]');
		for (var i = 0; i < questionContainers.length; i++) {
			var container = questionContainers[i];
			var title = container.getAttribute('data-summary-title');
			var type = container.className.replace(/^question-/, '');
			var chartContainerId = 'chart-container-' + i.toString();
			if (title in summary) {
				/** @type SummaryRow */
				var summaryRow = summary[title];
				if ('chartData' in summaryRow) {
					var chartContainer = document.createElement('div');
					chartContainer.id = chartContainerId;
					container.appendChild(chartContainer);
					switch (type) {
						case 'select-one':
							charts.pie(summaryRow.chartData, chartContainerId);
						break;
						case 'select-many':
							charts.bar(summaryRow.chartData, chartContainerId);
						break;
						case 'date':
							charts.timeline(summaryRow.chartData, chartContainerId);
						break;
					}
				}
				else if (type == 'grid') {
					var subQuestionContainers = container.querySelectorAll('.sub-summary');
					var subQuestionTitles = container.querySelectorAll('.sub-summary > h2 > .title');
					for (var j = 0; j < subQuestionContainers.length; j++) {
						var subContainer = subQuestionContainers[j];
						var subTitle = subQuestionTitles[j].textContent;
						var subChartContainerId = chartContainerId + '-' + j.toString()
						if (subTitle in summaryRow.summary) {
							/** @type SummaryRow */
							var subSummaryRow = summaryRow.summary[subTitle];
							var subChartContainer = document.createElement('div');
							subChartContainer.id = subChartContainerId;
							subContainer.appendChild(subChartContainer);
							charts.pie(subSummaryRow.chartData, subChartContainerId, true);
						}
					}
				}
			}
		}
	}

	/**
	 * Show given set.
	 *
	 * @param {String} setName
	 * @param {Object} filterSets
	 * @return {Object} summary object.
	 */
	function _showSet (setName, filterSets) {
		var filterSetProperties = (setName in filterSets) ? filterSets[setName] : {};
		var filterSet = new FilterSet(filterSetProperties);
		var summary = answers.summary(filterSet);
		document.getElementById('summary').innerHTML = filterSet.render(summary, questions);
		_renderCharts(summary);
		return summary;
	}

	// with filter sets
	if (filterSets) {
		// prepare filter sets GUI
		document.getElementById('filter-sets').style.display = 'block';
		var filterSetSelector = document.getElementById('filter-set');
		var firstSetName = null;
		for (var setName in filterSets) {
			if (firstSetName == null) {
				firstSetName = setName;
			}
			var option = document.createElement('option');
			option.appendChild(document.createTextNode(setName));
			filterSetSelector.appendChild(option);
		}
		
		// on change
		filterSetSelector.addEventListener('change', function () {
			_showSet(this.value, filterSets);
		});

		// first one
		var summary = _showSet(firstSetName, filterSets);
	}
	else {
		// render set
		var filterSet = new FilterSet();
		var summary = answers.summary(filterSet);
		document.getElementById('summary').innerHTML = filterSet.render(summary, questions);
		_renderCharts(summary);
	}

	return summary;
})(window.answers, window.questions, window.filterSets);

