window.answers = (function(){
	var questions = new Questions(questionsData);
	var answers = new Answers(answersData, questions);
	
	return answers;
})();

window.summary = (function(answers){
	var _LOG = new Logger("controller");

	var summary = answers.summary();

	var html = "";
	/** kolejność niby-losowa
	for (var i in summary) {
		/ ** @type SummaryRow * /
		var summaryRow = summary[i];
		html += summaryRow.render();
	}
	/**/
	for (var i = 0; i < questionsData.length; i++) {
		var title = questionsData[i].title;
		if (title in summary) {
			var summaryRow = summary[title];
			html += summaryRow.render();
		}
	}
	/**/
	document.getElementById('summary').innerHTML = html;

	return summary;
})(window.answers);

