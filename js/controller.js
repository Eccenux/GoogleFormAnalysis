/**
 * Parsing data to answers.
 */
var questions = new Questions(questionsData);
var answers = new Answers(answersData, questions);

/**
 * Creating summary (visual and object with SummaryRows in an assoc. array).
 * @type Object
 */
window.summary = (function(answers, questions){
	var _LOG = new Logger("controller");

	var filterSet = new FilterSet(filterSets['liczba mas: żadna']);

	var summary = answers.summary(filterSet);

	var questionsOrder = ('questionsOrder' in filterSet) ? filterSet.questionsOrder : questions.getTitles();
	if ('questionsGrouppedOrder' in filterSet) {
		questionsOrder = filterSet.questionsGrouppedOrder;
	}

	function _renderRow(title) {
		html += "<div class='question'>"
		if (title in summary) {
			var summaryRow = summary[title];
			html += summaryRow.render();
		}
		html += "</div>"
	}

	var html = "";
	for (var i = 0; i < questionsOrder.length; i++) {
		if (typeof(questionsOrder[i]) != 'object') {
			_renderRow(questionsOrder[i]);
		}
		else {
			html += "<div class='questions-group'>"
			for (var j = 0; j < questionsOrder[i].length; j++) {
				_renderRow(questionsOrder[i][j]);
			}
			html += "</div>"
		}
	}
	document.getElementById('summary').innerHTML = html;

	return summary;
})(answers, questions);

