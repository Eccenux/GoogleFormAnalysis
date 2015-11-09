/**
 * Helper subclass for headers (columns).
 *
 * @param {AnswerHeader} properties For now only index and title CAN and MUST be given.
 * @returns {AnswerHeader}
 */
function AnswerHeader(properties) {
	this.index = -1;
	this.title = '';
	this.subtitle = '';	// for grids
	this.question = new Question();
	
	this.index    = properties.index   ;
	this.title    = properties.title   ;
}

/**
 * Helper subclass for single answer.
 *
 * @param {AnswerHeader} header
 * @param {String} value
 * @returns {AnswerValue}
 */
function AnswerValue(header, value) {
	this.header = header;
	this.value = value;
	this.values = [];

	var question = header.question;
	switch (question.type) {
		case 'select-one':
		case 'text':
		case 'grid':
			this.values.push(value);
		break;
		case 'date':
			this.dateValue = new Date(value.replace(/EET\s*$/, 'GMT+0200'));
		break;
		case 'select-many':
			// fuu... WhyTheFuu you've changed separators you Google, you!
			/*
			if (value.indexOf(';')) {
				this.values = value.split(';');
			}
			*/
			var leftovers = value + ', ';
			for (var i = 0; i<question.options.length; i++) {
				var option = question.options[i];
				if (leftovers.indexOf(option + ', ') >= 0) {
					leftovers = leftovers.replace(option + ', ', '');
					this.values.push(option);	// append option
				}
			}
			if (leftovers.length) {
				this.values.push(leftovers.slice(0, -2));	// append leftovers
			}
		break;
	}
}

/**
 * Answers model/helper.
 * 
 * @param {Array} answersData Array of answer rows. Note first row (0-row) MUST contain titles of the questions.
 * @param {Questions} questions Questions model instance.
 * @returns {Answers}
 */
function Answers(answersData, questions) {
	var _self = this;
	var _headers = [];
	var _answers = [];

	var _LOG = new Logger("Answers");

	/**
	 * Constructor.
	 */
	function _constructor() {
		// check header row
		if (!_parseHeader()) {
			_LOG.error('Header fail. Will not check other data.');
			return;
		}
		// now let's parse answers
		_parseAnserwers(false);
	}
	_constructor();

	/**
	 * Parse (and check) header row.
	 * 
	 * @param {Boolean} stopOnFirstError Stop check upon first error (default = false).
	 * @returns {Boolean} true if it's OK.
	 */
	function _parseHeader (stopOnFirstError) {
		var reSubtitle = /(.+) \[(.+)\]/;
		var isOK = true;
		for (var i = 0; i < answersData[0].length; i++) {
			var header = new AnswerHeader({title:answersData[0][i], index : _headers.length});
			if (reSubtitle.test(header.title)) {
				var matches = reSubtitle.exec(header.title);
				header.title = matches[1];
				header.subtitle = matches[2];
			}
			header.question = questions.findQuestion(header.title);
			if (header.question == null) {
				isOK = false;
				_LOG.error('Unable to find: ', header);
				if (stopOnFirstError) {
					return isOK;
				}
			}
			_headers.push(header);
		}
		return isOK;
	}

	/**
	 * Parse (and check) answers data.
	 *
	 * @param {Boolean} stopOnFirstError Stop check upon first error (default = false).
	 */
	function _parseAnserwers (stopOnFirstError) {
		for (var rowIndex = 1; rowIndex < answersData.length; rowIndex++) {
			var row = answersData[rowIndex];
			if (row.length != _headers.length) {
				_LOG.error("row.length != headerRow.length; row:", row);
				if (stopOnFirstError) {
					return;
				}
				continue;
			}
			/*
			if (row.length != questions.length) {
				_LOG.error("row.length != questions.length; row:", row)
				if (stopOnFirstError) {
					return;
				}
				continue;
			}
			*/
			var answer = [];
			var merges = {};
			// search for answer titles in questions from model
			for (var columnIndex = 0; columnIndex < row.length; columnIndex++) {
				var rawValue = row[columnIndex].replace(/\s+$/, '');
				/** @type AnswerHeader */
				var header = _headers[columnIndex];
				// skip empty
				if (rawValue.length < 1) {
					continue;
				}
				// parse
				var answerValue = new AnswerValue(header, row[columnIndex]);
				// validate
				if (!questions.isValid(answerValue)) {
					if (stopOnFirstError) {
						_LOG.info("stopped on invalid answer");
						return;
					}
					_LOG.warn("skipped invalid answer");
					continue;
				}
				// skip if this answer is to be merged
				if ('titles' in header.question) {
					var questionTitle = header.question.title;
					if (!(questionTitle in merges)) {
						merges[questionTitle] = [];
					}
					merges[questionTitle].push(answerValue);
				}
				else {
					answer.push(answerValue);
				}
			}
			// now we can merge answers and push them
			for (var questionTitle in merges) {
				var answerValuesArray = merges[questionTitle];
				var answerValue = answerValuesArray[0];	// first as a base
				for (var i = 1; i < answerValuesArray.length; i++) {	// add the rest if available
					answerValue.value += ';\n ' + answerValuesArray[i].value;
				}
				answer.push(answerValue);
			}
			_answers.push(answer);
		}
	}

	/**
	 * Get all parsed answers.
	 */
	this.getAnswers = function () {
		return _answers;
	};

	/**
	 * Generate a summary of answers.
	 * 
	 * @param {FilterSet} options FilterSet instance.
	 * @return {Object} Associative array with keys made of question.title and values of type SummaryRow.
	 */
	this.summary = function (options) {
		var summary = {};
		options = options || {};

		for (var i = 0; i < _answers.length; i++) {
			var answer = _answers[i];
			if ('answerFilter' in options) {
				if (options.answerFilter(answer)) {
					continue;
				}
			}
			for (var j = 0; j < answer.length; j++) {
				/** @type AnswerValue */
				var answerValue = answer[j];
				var question = answerValue.header.question;
				// filtering by question
				if ('questionFilter' in options) {
					if (options.questionFilter(question)) {
						continue;
					}
				}
				// new summary row
				if (!(question.title in summary)) {
					summary[question.title] = new SummaryRow(question);
				}
				summary[question.title].addAnswer(answerValue);
			}
		}
		return summary;
	};
}