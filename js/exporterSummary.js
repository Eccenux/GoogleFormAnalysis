/**
 * Re-Export summary data without having actual answers data.
 *
 * @param {Object} summary Summary object as returned by answers.summary.
 * @param {Questions} questions
 * @returns {ExporterSummary}
 */
function ExporterSummary(summary, questions) {
	var _LOG = new Logger("ExporterSummary");

	/**
	 * Render HTML and summary for given set.
	 *
	 * @returns {Object} HTML and summary for the set.
	 */
	var _render = function (){
		var filterSet = new FilterSet({});
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

		summaryData.singleSet = true;
		summaryData.data = _render();

		return summaryData;
	};
}