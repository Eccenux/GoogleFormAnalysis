/**
 * Parsing data to answers.
 */
window.questions = new Questions(questionsData);

/**
 * Creating summary (visual and object with SummaryRows in an assoc. array).
 *
 * When filtering sets are enabled it will return summary from the first set.
 *
 * @param {Object} summaryData Pre-parsed data of summaries for each set.
 * @param {Questions} questions Parsed questions.
 * @param {Object} filterSets Filter sets properties.
 * @type Object
 */
(function(summaryData, questions, filterSets){
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
	 * @return {Object} summary object.
	 */
	function _showSet (setName) {
		var set = setName ? summaryData.data[setName] : summaryData.data;
		document.getElementById('summary').innerHTML = set.html;
		_renderCharts(set.summary);
	}

	// with filter sets
	if (filterSets && !summaryData.singleSet) {
		// prepare filter sets GUI
		document.getElementById('filter-sets').style.display = 'block';
		var filterSetSelector = document.getElementById('filter-set');
		var firstSetName = null;
		var setsCount = 0;
		for (var setName in filterSets) {
			if (firstSetName == null) {
				firstSetName = setName;
			}
			var option = document.createElement('option');
			option.appendChild(document.createTextNode(setName));
			filterSetSelector.appendChild(option);
			setsCount++;
		}

		// nothing to see here...
		if (setsCount <= 1) {
			document.getElementById('filter-sets').style.display = 'none';
		}
		// more then one...
		else {
			// on change
			filterSetSelector.addEventListener('change', function () {
				_showSet(this.value);
			});
		}

		// first one
		_showSet(firstSetName);
	}
	else {
		_showSet();
	}

})(window.summaryData, window.questions, window.filterSets);

