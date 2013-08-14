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
			if (value.indexOf(';')) {
				this.values = value.split(';');
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
				_LOG.error('Unable to find: ', row);
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
		for (var i = 1; i < answersData.length; i++) {
			var row = answersData[i];
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
			// search for answer titles in questions from model
			for (var j = 0; j < row.length; j++) {
				var rawValue = row[j];
				// skip empty
				if (rawValue.length < 1) {
					continue;
				}
				// parse
				var answerValue = new AnswerValue(_headers[j], row[j]);
				// validate
				if (!questions.isValid(answerValue)) {
					if (stopOnFirstError) {
						_LOG.info("stopped on invalid answer");
						return;
					}
					_LOG.warn("skipped invalid answer");
					continue;
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
	 * @todo filters
	 */
	this.summary = function () {
		var summary = {};
		for (var i = 0; i < _answers.length; i++) {
			var answer = _answers[i];
			for (var j = 0; j < answer.length; j++) {
				/** @type AnswerValue */
				var answerValue = answer[j];
				var question = answerValue.header.question;
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