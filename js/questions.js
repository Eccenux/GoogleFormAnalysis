/**
 * Single question.
 *
 * Types:
 * <li> [select-one] (pl: jednokrotny wybór = wybierz z listy)
 * <li> [select-many] (pl: wielokrotny wybór)
 * <li> [text] (pl: tekst = tekst akapitu)
 * <li> [text-merged] two text types merged together (pl: dwa, połączone pola tekstowe)
 * <li> [date] (pl: data)
 * <li> [grid] (pl: siatka)
 *
 * @param {Question} properties Any public properties to be overriden. Type and title MUST be given for any type.
 * @returns {Question}
 */
function Question(properties) {
	this.title = "";
	this.type = "";

	this.other = false;
	this.ignoreOther = false;
	this.options = [];
	this.scale = [];

	// should not happen for real questions
	if (typeof(properties)!='object') {
		return;
	}

	// MUST be given
	this.title = properties.title;
	this.type = properties.type;

	/**
	 * Title to display.
	 * 
	 * @type String
	 */
	if ('displayTitle' in properties) {
		this.displayTitle = properties.displayTitle;
	}

	// depending on type
	switch (properties.type) {
		case 'text-merged':
			this.titles = properties.titles;
		break;
		case 'select-one':
		case 'select-many':
			this.options = properties.options;
			if ('other' in properties)
			{
				this.other = properties.other;
			}
			if ('ignoreOther' in properties)
			{
				this.ignoreOther = properties.ignoreOther;
			}
		break;
		case 'grid':
			this.options = properties.options;
			this.scale = properties.scale;
		break;
	}
}

/**
 * Questions model/helper.
 * 
 * @param {Array} questionsData Array of question objects.
 * @returns {QuestionsModel}
 */
function Questions(questionsData) {
	var _questionTitles = [];
	var _mergedTitles = {};	// assoc. array with title : actual index
	var _self = this;

	var _LOG = new Logger("questions");

	/** Length of questions. */
	this.length = 0;

	_constructor();
	function _constructor() {
		if (validate(questionsData)) {
			parse(questionsData);
		}
	}

	/** Pre-parse */
	function parse(questionsData) {
		for (var i = 0; i < questionsData.length; i++) {
			var question = new Question(questionsData[i]);
			_questionTitles.push(question.title);
			// merged question
			if ('titles' in question) {
				for (var j = 0; j < question.titles.length; j++) {
					_mergedTitles[question.titles[j]] = _questionTitles.length - 1;
				}
			}
		}
		_self.length = _questionTitles.length;
	}

	/** Empty or all invalid. */
	this.isEmpty = function () {
		return _self.length === 0;
	}

	/**
	 * Get titles of all questions.
	 * @returns {Array}
	 */
	this.getTitles = function() {
		return _questionTitles;
	}

	/**
	 * Returns the index of a question with the given title.
	 *
	 * @param {String} title Title of the question.
	 * @returns {Number} Index in questions array or -1 if the value is not found.
	 */
	this.indexOf = function (title) {
		var index = _questionTitles.indexOf(title);
		// check merged
		if (index < 0) {
			if (title in _mergedTitles) {
				index = _mergedTitles[title];
			}
		}
		return index;
	};

	/**
	 * Returns a question item.
	 *
	 * @param {Number} index Index of the question.
	 * @returns {Question} Question from the array.
	 */
	this.item = function (index) {
		return questionsData[index];
	};

	/**
	 * Returns the question with the given title or null if not found.
	 * 
	 * This basically is a shorthand for calling indexOf() and item().
	 *
	 * @param {String} title Title of the question.
	 * @returns {Question} Question from the array.
	 */
	this.findQuestion = function (title) {
		var index = this.indexOf(title);
		if (index < 0) {
			return null;
		}
		return questionsData[index];
	};

	/** Pre-validate data. */
	function validate(questionsData) {
		if (!Array.isArray(questionsData)) {
			_LOG.error('questionsData is not an array');
			return false;
		} else if (questionsData.length === 0) {
			_LOG.error('questionsData is empty');
			return false;
		}
		return true;
	}

	/**
	 * Check if the answer value is valid.
	 *
	 * @param {AnswerValue} answerValue Answer value (see answer.js).
	 */
	this.isValid = function (answerValue) {
		var question = answerValue.header.question;
		/*
		} catch(e) {
			_LOG.error("AnswerValue not found: ", answerValue);
			return false;
		}
		*/
		
		/*
		// single / multiple values
		switch (question.type) {
			case 'grid':
			case 'select-one':
				if (answerValue.values.length > 1) {
					_LOG.error('Multiple values for the question not allowed. Q:', question, "\nA:", answerValue);
					return false;
				}
			break;
		}
		*/
		
		// does the value exist
		switch (question.type) {
			case 'select-one':
			case 'select-many':
				// only check if there is no free speach option
				if (!question.other) {
					for (var i = 0; i < answerValue.values.length; i++) {
						var v = answerValue.values[i];
						if (question.options.indexOf(v) == -1) {
							if (!question.ignoreOther) {
								_LOG.error('One or more values is not valid within closed question Q:', question, "\nA:", answerValue);
							}
							return false;
						}
					}
				}
			break;
			case 'grid':
				if (question.scale.indexOf(answerValue.value) == -1) {
					_LOG.error('One or more values is not valid within closed question Q:', question, "\nA:", answerValue);
					return false;
				}
			break;
		}
		
		return true;
	};
}