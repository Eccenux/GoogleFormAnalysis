/**
 * Export summary data.
 *
 * @param {Answers} answers
 * @param {Questions} questions
 * @param {Object} filterSets
 * @returns {Exporter}
 */
function Exporter(answers, questions, filterSets) {
	var _LOG = new Logger("Exporter");

	/**
	 * Render HTML and summary for given set.
	 *
	 * @param {type} setName Optional set name. If undefined HTML for full summary will be returned.
	 * @returns {Object} HTML and summary for the set.
	 */
	var _render = function (setName){
		var filterSetProperties = (setName in filterSets) ? filterSets[setName] : {};
		var filterSet = new FilterSet(filterSetProperties);
		var summary = answers.summary(filterSet);
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