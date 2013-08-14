/**
 * Single question.
 *
 * Types:
 * <li> [select-one] pl: jednokrotny wybór = wybierz z listy
 * <li> [select-many] pl: wielokrotny wybór
 * <li> [text] pl: tekst = tekst akapitu
 * <li> [date] pl: data
 * <li> [grid] pl: siatka -> [select-one]
 *
 * @param {Question} properties Any public properties to be overriden. Type and title MUST be given for any type.
 * @returns {Question}
 */
function Question(properties) {
	this.title = "";
	this.type = "";

	this.other = false;
	this.options = [];
	this.scale = [];

	// should not happen for real questions
	if (typeof(properties)!='object') {
		return;
	}

	// MUST be given
	this.title = properties.title;
	this.type = properties.type;

	// depending on type
	switch (properties.type) {
		case 'select-one':
		case 'select-many':
			this.options = properties.options;
			if ('other' in properties)
			{
				this.other = properties.other;
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
	var _self = this;

	var _LOG = new Logger("questions");

	this.length = 0;

	_constructor();
	function _constructor() {
		for (var i = 0; i < questionsData.length; i++) {
			var question = new Question(questionsData[i]);
			_questionTitles.push(question.title);
		}
		_self.length = _questionTitles.length;
	}

	/**
	 * Returns the index of a question with the given title.
	 *
	 * @param {String} title Title of the question.
	 * @returns {Number} Index in questions array or -1 if the value is not found.
	 */
	this.indexOf = function (title) {
		return _questionTitles.indexOf(title);
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
		var index = _questionTitles.indexOf(title);
		if (index < 0) {
			return null;
		}
		return questionsData[index];
	};

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
							_LOG.error('One or more values is not valid within closed question Q:', question, "\nA:", answerValue);
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