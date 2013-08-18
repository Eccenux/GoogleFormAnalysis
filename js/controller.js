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
 * @param {Object} filterSets Filter sets properties.
 * @type Object
 */
window.summary = (function(answers, questions, filterSets){
	var _LOG = new Logger("controller");

	/**
	 * Render charts on a page.
	 *
	 * @param {Object} summary Summary object.
	 */
	function _renderCharts(summary) {
		chartsRenderer.render(summary);
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

