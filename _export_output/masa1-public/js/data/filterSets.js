var questionsGrouppedOrder_Public = [
	[ 'W ilu masach brałeś(-aś) udział?', 'Płeć', 'Gdzie mieszkasz' ],
	'Jeśli nie ma Cię na masie, to dlaczego?',
	['Jaki Twoim zdaniem jest (obecnie) główny cel lub cele Masy Krytycznej w Gdyni?',
	'Jakie Twoim zdaniem powinny być główne cele Masy Krytycznej?']
];

/**
 * Filter sets for the summary.
 */
var filterSets = {
	"ogólne" : {
		questionsGrouppedOrder : [
			[ 'W ilu masach brałeś(-aś) udział?', 'Płeć', 'Gdzie mieszkasz' ],
			[ 'Wiek' ],
		]
	},
	"liczba mas: żadna" : {
		keep : {"W ilu masach brałeś(-aś) udział?" : "żadnej"}
		,questionsGrouppedOrder : questionsGrouppedOrder_Public
	},
	"liczba mas: jedna" : {
		keep : {"W ilu masach brałeś(-aś) udział?" : "jednej"}
		,questionsGrouppedOrder : questionsGrouppedOrder_Public
	},
	"liczba mas: dwie i więcej" : {
		skip : {"W ilu masach brałeś(-aś) udział?" : ["żadnej", "jednej"]}
		,questionsGrouppedOrder : questionsGrouppedOrder_Public
	},
	"pytanie o formę masy: osoby nie zgadzające się formą" : {
		/**
		 * Skip row (answers of a single person).
		 *
		 * @param {Array} answersRow AnswerValue array to check.
		 * @returns {Boolean} true if the row should be skipped.
		 */
		answerFilter : function (answersRow) {
			for (var i = 0; i < answersRow.length; i++) {
				/** @type AnswerValue */
				var answerValue = answersRow[i];
				if (answerValue.header.subtitle == 'Nie zgadzam się z tą formą.') {
					if (answerValue.value == 'tak, to główny powód' || answerValue.value == 'raczej tak') {
						return false;	// keep
					}
					break;
				}
			}
			// skip
			return true;
		}
		,questionsGrouppedOrder : questionsGrouppedOrder_Public
	},
	"pytanie o formę masy: osoby zgadzające się z tą formą" : {
		/**
		 * Skip row (answers of a single person).
		 *
		 * @param {Array} answersRow AnswerValue array to check.
		 * @returns {Boolean} true if the row should be skipped.
		 */
		answerFilter : function (answersRow) {
			for (var i = 0; i < answersRow.length; i++) {
				/** @type AnswerValue */
				var answerValue = answersRow[i];
				if (answerValue.header.subtitle == 'Nie zgadzam się z tą formą.') {
					if (answerValue.value == 'tak, to główny powód' || answerValue.value == 'raczej tak') {
						return true;	// skip
					}
					break;
				}
			}
			// keep
			return false;
		}
		,questionsGrouppedOrder : questionsGrouppedOrder_Public
	},
};