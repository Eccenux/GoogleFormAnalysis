/**
 * Single summary "row".
 * 
 * Each summary row represents a single question.
 *
 * @param {Question} question Single question.
 * @returns {SummaryRow}
 */
function SummaryRow(question) {
	this.question = question;

	/**
	 * Total number of answers (including multiple options).
	 * @type Number
	 */
	this.totalAnswers = 0;

	/**
	 * Total number of people (answers not including multiple options).
	 * @type Number
	 */
	this.totalPeople = 0;

	/**
	 * Simple summary of textual answers.
	 */
	this.values = [];
	
	/**
	 * Summary for the question.
	 * 
	 * Note that inner type depends on the question type.
	 * @type Object
	 */
	this.summary = null;
	
	/**
	 * Summary for options not in standard options.
	 * 
	 * @type Number
	 */
	this.summaryOther = null;
	
	// init/constructor
	this.init();
}

/**
 * Init summary where needed.
 */
SummaryRow.prototype.init = function() {
	switch (this.question.type) {
		case 'date':
			this.summary = {};
		break;
		case 'select-one':
		case 'select-many':
			this.summary = {};
			for (var i = 0; i < this.question.options.length; i++) {
				var option = this.question.options[i];
				this.summary[option] = 0;
			}
			if (this.question.other) {
				this.summaryOther = 0;
			}
		break;
		case 'grid':
			this.summary = {};
			for (var i = 0; i < this.question.options.length; i++) {
				var option = this.question.options[i];
				var subQuestion = new Question({
					title: option
					, type: 'select-one'
					, other: false
					, options: this.question.scale
				});
				this.summary[option] = new SummaryRow(subQuestion);
			}
		break;
	}
};

/**
 * Add answer value to summary row.
 * 
 * @param {AnswerValue} answerValue
 */
SummaryRow.prototype.addAnswer = function(answerValue) {
	if (this.question.type == 'select-many') {
		this.totalPeople++;
	}
	
	switch (this.question.type) {
		default:
			this.totalAnswers++;
			this.values.push(answerValue.value);
		break;
		/**/
		case 'date':
			this.totalAnswers++;
			var v = answerValue.dateValue.dateFormat("Y-m-d");
			if (!(v in this.summary)) {
				this.summary[v] = 1;
			} else {
				this.summary[v]++;
			}
		break;
		/**/
		case 'select-one':
		case 'select-many':
			for (var i = 0; i < answerValue.values.length; i++) {
				this.totalAnswers++;
				var v = answerValue.values[i];
				if (!(v in this.summary)) {
					this.summaryOther++;
				} else {
					this.summary[v]++;
				}
			}
		break;
		case 'grid':
			this.totalAnswers++;
			var subRow = this.summary[answerValue.header.subtitle];
			var v = answerValue.value;
			subRow.summary[v]++;
			subRow.totalAnswers++;
		break;
	}
};

/**
 * Render question summary.
 * 
 * Chart data is returned separetly in .chartData property.
 * 
 * @return {String} HTML for the row.
 */
SummaryRow.prototype.render = function() {
	/** @type Question */
	var question = this.question;
	
	var html = '';
	var chartData = [];
	
	// header
	html += '<h2>'
			+'<span class="title">' + ('displayTitle' in question ?  question.displayTitle : question.title) + '</span>'
			+(this.totalPeople > 0 ? ' <span class="total-people">' + this.totalPeople : ' <span class="total-people total-answers">' + this.totalAnswers) + '</span>'
			+(this.totalPeople > 0 ? ' <span class="total-answers">' + this.totalAnswers + '</span>' : '')
		+'</h2>'
	;

	// options helper function
	var _self = this;
	function _renderOptionSummary(title, totalForOption, color) {
		return '<li class="option">'
				+(color ? ' <span class="color" style="background-color:' + color + '"> </span>' : '')
				+' <span class="title">' + title + '</span>'
				+' <span class="total-for-option">' + totalForOption + '</span>'
				+' <span class="total-percentage">' + Math.round(totalForOption / _self.totalAnswers * 100).toString() + '%</span>'
			+'</li>';
	}
	
	// chart helper function
	if ('options' in question) {
		var optionsCount = question.options.length;
		if (question.other) {
			optionsCount++;
		}
		var _renderChartOption = function (title, totalForOption, index) {
			return charts.renderOption(title, totalForOption, index, optionsCount);
		};
	}

	// text summary
	html += '<ul class="summary-'+question.type+'">';
	switch (question.type) {
		default:
			for (var i = 0; i < this.values.length; i++) {
				html += '<li>' + this.values[i] + '</li>';
			}
		break;
		case 'date':
			for (var v in this.summary) {
				html += _renderOptionSummary(v, this.summary[v]);
				chartData.push(charts.renderPoint(v, this.summary[v]));
			}
		break;
		case 'select-one':
		case 'select-many':
			var index = 0;
			for (var v in this.summary) {
				var chartOption = _renderChartOption(v, this.summary[v], index++);
				html += _renderOptionSummary(v, this.summary[v], chartOption.color);
				chartData.push(chartOption);
			}
			if (question.other) {
				var chartOption =_renderChartOption('Inne', this.summaryOther, index++);
				html += _renderOptionSummary('Inne', this.summaryOther, chartOption.color);
				chartData.push(chartOption);
			}
		break;
		case 'grid':
			for (var v in this.summary) {
				html += '<li><span class="title">' + v + '</span>\n\
							<div class="sub-summary">' + this.summary[v].render() + '</div></li>';
			}
		break;
	}
	html += '</ul>';

	switch (question.type) {
		case 'date':
		case 'select-one':
		case 'select-many':
			this.chartData = chartData;
		break;
	}
	return html;
};
