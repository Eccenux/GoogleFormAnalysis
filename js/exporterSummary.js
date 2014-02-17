/**
 * Re-Export summary data without having actual answers data.
 *
 * @param {Object} summary Summary object as returned by answers.summary.
 * @param {Questions} questions
 * @param {Object} filterSets
 * @returns {ExporterSummary}
 */
function ExporterSummary(summary, questions, filterSets) {
	var _LOG = new Logger("ExporterSummary");

	/**
	 * Render HTML and summary for given set.
	 *
	 * @param {type} setName Optional set name. If undefined HTML for full summary will be returned.
	 * @returns {Object} HTML and summary for the set.
	 */
	var _render = function (setName){
		var filterSetProperties = (setName && setName in filterSets) ? filterSets[setName] : {};
		var filterSet = new FilterSet(filterSetProperties);
		return {
			html : filterSet.render(summary, questions),
			summary : summary
		};
	};

	this.getSummaryData = function (){
		var summaryData = {
			singleSet : false,
			data : {}
		};

		if (filterSets) {
			for (var setName in filterSets) {
				summaryData.data[setName] = _render(setName);
			}
		}
		else {
			summaryData.singleSet = true;
			summaryData.data = _render();
		}

		return summaryData;
	};
}