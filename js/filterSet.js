/**
 * Helper class for filter sets.
 *
 * @param {FilterSet} properties Properties object that may include any of the following:
 *		<li>skip - assoc. array {title : "value"} or {title : ["value1", "value2"]} specifing rows that should be skipped.
 *		<li>keep - assoc. array {title : "value"} or {title : ["value1", "value2"]} specifing rows that should be kept (any others will be skipped).
 *			If provided it will override skip filtering.
 *		<li>answerFilter - a function that receives array of AnswerValue objects
 *			and returns true if the row should be skipped (not used in the summary).
 *			If provided it will override keep and skip filtering.
 *		<li>questionsOrder - array that will allow ordering and simple filtering of questions
 *		<li>questionsGrouppedOrder - array that contains groupped titles.
 *			If provided it will override questionsOrder.
 *		<li>questionFilter - a function that receives a Question object
 *			and returns true if the question should be skipped (not shown in the summary).
 *			If provided it will override questionsOrder (and questionsGrouppedOrder), but only in terms of filtering.
 * @returns {FilterSet}
 */
function FilterSet(properties) {
	properties = properties || {};
	
	// simple answer filters
	if ('keep' in properties) {
		this.answerFilter = this.simpleFilterFactory(properties.keep, true);
	}
	else if ('skip' in properties) {
		this.answerFilter = this.simpleFilterFactory(properties.skip, false);
	}
	
	// custom answer filter
	if ('answerFilter' in properties) {
		this.answerFilter = properties.answerFilter;
	}

	// custom order
	if ('questionsOrder' in properties) {
		this.questionsOrder = properties.questionsOrder;
	}

	// flatten groups for ordering
	if ('questionsGrouppedOrder' in properties) {
		this.questionsOrder = this._flattenArray(properties.questionsGrouppedOrder);
		this.questionsGrouppedOrder = properties.questionsGrouppedOrder;
	}

	// filter based on question order (if no filter for questions is given)
	if (!('questionFilter' in properties) && ('questionsOrder' in properties)) {
		/**
		 * Skip whole question (don't show it).
		 *
		 * @param {Question} question Question object to check.
		 * @returns {Boolean} true if the question should be skipped.
		 */
		this.questionFilter = function (question) {
			if (properties.questionsOrder.indexOf(question.title) >= 0) {
				return false;	// keep
			}
			// skip
			return true;
		};
	}
	// custom question filter
	else if ('questionFilter' in properties) {
		this.questionFilter = properties.questionFilter;
	}
}

/**
 * Flatten array.
 *
 * @note Assuming only objects in the array are array objects.
 *
 * @param {Array} array
 * @returns {Array}
 */
FilterSet.prototype._flattenArray = function (array) {
	var resultingArray = [];
	for (var i = 0; i < array.length; i++) {
		// array (or so we hope)
		if (typeof(array[i]) == 'object') {
			var temp = this._flattenArray(array[i]);
			for (var j = 0; j < temp.length; j++) {
				resultingArray.push(temp[j]);
			}
		}
		// simple type
		else {
			resultingArray.push(array[i]);
		}
	}
	return resultingArray;
};

/**
 *
 * @param {Object} valuesByTitle Assoc. array {title : "value"} or {title : ["value1", "value2"]}
 * @param {Boolean} toKeep True if above is meant to specify rows that are to be kept.
 * @returns {FilterSet.prototype.simpleFilterFactory.answerFilter}
 */
FilterSet.prototype.simpleFilterFactory = function(valuesByTitle, toKeep) {
	// parse for quicker execution later
	var specification = {
		titles : [],
		values : {}
	};
	for (var title in valuesByTitle) {
		specification.titles.push(title);
		if (typeof(valuesByTitle[title]) == 'object') {
			specification.values[title] = valuesByTitle[title];
		}
		else {
			specification.values[title] = [valuesByTitle[title]];
		}
	}

	/**
	 * Skip row (answers of a single person).
	 *
	 * @param {Array} answersRow AnswerValue array to check.
	 * @returns {Boolean} true if the row should be skipped.
	 */
	var answerFilter = function (answersRow) {
		for (var i = 0; i < answersRow.length; i++) {
			/** @type AnswerValue */
			var answerValue = answersRow[i];
			if (specification.titles.indexOf(answerValue.header.title) >= 0) {
				for (var v = 0; v < answerValue.values.length; v++) {
					var value = answerValue.values[v];
					if (specification.values[answerValue.header.title].indexOf(value) >= 0) {
						return (!toKeep);	// specification is toKeep => keep
					}
				}
				if (specification.titles.length < 2) {
					break;
				}
			}
		}
		// specification is toKeep => skip
		return toKeep;
	};

	return answerFilter;
};

/**
 * Render filter set with given anserwers and questions.
 *
 * @param {Object} summary Summary object.
 * @param {Questions} questions Parsed questions.
 * @return {String} HTML for the set.
 */
FilterSet.prototype.render = function(summary, questions) {
	var filterSet = this;

	var questionsOrder = ('questionsOrder' in filterSet) ? filterSet.questionsOrder : questions.getTitles();
	if ('questionsGrouppedOrder' in filterSet) {
		questionsOrder = filterSet.questionsGrouppedOrder;
	}

	function _renderRow(title) {
		if (title in summary) {
			/** @type SummaryRow */
			var summaryRow = summary[title];
			html += "<div class='question-" + summaryRow.question.type + "' data-summary-title='" + title + "'>";
			html += summaryRow.render();
			html += "</div>";
		}
	}

	var html = "";
	for (var i = 0; i < questionsOrder.length; i++) {
		if (typeof(questionsOrder[i]) != 'object') {
			_renderRow(questionsOrder[i]);
		}
		else {
			html += "<div class='questions-group'>";
			for (var j = 0; j < questionsOrder[i].length; j++) {
				_renderRow(questionsOrder[i][j]);
			}
			html += "</div>";
		}
	}
	return html;
}