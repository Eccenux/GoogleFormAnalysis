GoogleFormAnalysis
==================

GFA makes analyzing Google Forms easier by filtering and reformatting summary of results.

Steps to create your own
------------------------

To create a base for your own analysis you need to generate (partially automatically) data files
and you should customize an index file.

1.	Create `questionsData.js` based on e.g. a printout of your form (survey).
	It's basically an array of objects - one object per question.

	See example in `js\data\example\questionsData.js`

	Note that titles MUST be exactly the same as in your form (case sensitive). This also applies to the options.

1.	Create answersData.js based on CSV saved from your form. CSV export is available in Google Forms interface.

	See `js\data\example\answersData.js` for an example and steps of transforming your CSV to JavaScript.

1.	In `index.html` change the `<title>` tag and `<script>` tags so that they point to your data scripts.

That's basically it. Open `index.html` in your browser and check the JS console for any errors or warnings.
You may need to fix your `questionsData.js` for any typos in titles or options (for closed select-one/many questions).

**Note!** If your question titles are not unique, make them unique (e.g. add a number in title).
This must be done both in `questionsData.js` titles and `answersData.js` header row.

Filtering answers
-----------------

OK, but that was just for charts. Now the science (and fun) starts when you can filter your results.
This will allow you to get more interesting (and maybe controversial) information like -
are there any significant differences between women and men.

Simple filtering is simple ;-). Just add `filterSets` with skip or keep object:
```javascript
	var filterSets = {
		"all" : {
		},
		"only men" : {
			keep : {"Sex" : "men"}
		},
		"only specified" : {
			skip : {"Sex" : "refuse to answer"}
		},
	}
```

Note that `keep` and `skip` will only work as expected for this types:
* select-one
* select-many
* text

Grouping and filtering questions
--------------------------------

If you have many questions in your survey and want to focus only on some questions.

We go to the previous example and add grouping and ordering (`questionsGrouppedOrder`) for
all sets except the first one. This will also filter out any question not specified in your ordering.
```javascript
	var filterSets = {
		"all" : {
		},
		"only men" : {
			keep : {"Sex" : "men"}
			questionsGrouppedOrder: [
				[ "Sex", "Age" ]
				"Which type of question do you like and why?"
			]
		},
		"only specified" : {
			skip : {"Sex" : "refuse to answer"},
			questionsGrouppedOrder: [
				[ "Sex", "Age" ]
				"Which type of question do you like and why?"
			]
		},
	}
```

Advanced filtering
------------------
In filter sets you may go for more advanced filters by using `answerFilter` or `questionFilter` functions.

Here are basic examples which can be easily extend e.g. by using `RegExp` search on the values or titles.
```javascript
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
			if (answerValue.header.title == 'Sex') {
				if (answerValue.value == 'refuse to answer') {
					return true;	// skip
				}
				break;
			}
		}
		// keep
		return false;
	},
	/**
	 * Skip whole question (don't show it).
	 *
	 * @param {Question} question Question object to check.
	 * @returns {Boolean} true if the question should be skipped.
	 */
	questionFilter : function (question) {
		if (question.title == 'Age' || question.title == 'Sex') {
			return true;	// skip
		}
		// keep
		return false;
	}
```

Merging
-------

You can ask a separate question of "Which..." and then "Why...".
The problem is that analyzing them separately is not really useful.
You can merge those by changing your `questionsData` a bit.

If you have questions like:
```javascript
	// this would typically be a short text box (and could be required in an original form)
	{
		title:"Which type of question do you like?"
		, type: 'text'
	},
	// this would typically be a text paragraph (and could be optional)
	{
		title:"Why do you like that type?"
		, type: 'text'
	},
```

Then you merge it like so:
```javascript
	{
		title:"Which type of question do you like and why?"
		, type: 'text-merged'
		, titles:[
			"Which type of question do you like?",
			"Why do you like that type?"
		]
	},
```

Publishing your analysis
------------------------

Note! If you publish full scripts (with `answersData`), the
answers might reveal identity of people that filled out your survey. This would be bad!

To avoid this, you can copy the generated HTML - probably the easiest way to do this is:

1.	Open the developer tools (`CTRL + SHIFT + I` or `F12` - depending on your browser).
1.	Go to "Elements" (or "HTML") tab.
1.	Right click on `<html>` tag and choose "Copy as HTML" (or something like that).
1.	Paste and save to a new file.
1.	Remove all script tags.
