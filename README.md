GoogleFormAnalysis
==================

GFA makes analyzing Google Forms easier by filtering and reformatting summary of results.
You can also use any other forms as long as you are able to download CSV or JSON with results (answers).

**Quick steps**:
1. Create `answersData.js` (with your results).
1. Create `questionsData.js` (specify question types / config).
1. Edit `index.html` (specify links to your `answersData.js`).
1. Open index.html in your browser.

That's basically it. There are options to refine views (with filters) and to export data (with Node.js). Details below.

Example analysis
---------------------------------

Example result below (one of filter sets). In Polish but you get the idea. The red-green charts are binary questions (yes/no with flavors i.e. yes/maybe/not really/no). It's much easier to analyze grids this way.  

![example charts (pl)](https://raw.github.com/Eccenux/GoogleFormAnalysis/master/_extra/screenshot-medium.jpg)

Steps to create your own analysis
---------------------------------

To create a base for your own analysis you need to generate (partially automatically) data files
and you should customize an index file.

1.	**Create `answersData.js`** (based on CSV/JSON/TSV with your results)

	See `js\data\example\answersData.js` for an example and steps of transforming your CSV to JavaScript.
	
	The first line is with titles (column names) and the others are with actual anserwers.
	
	Note that CSV export is available in Google Forms interface.

1.	**Create `questionsData.js`** (manually or based on e.g. a printout of your form (survey)).

	See example in `js\data\example\questionsData.js`
	
	It's basically an array of objects - one object per question.

	Note that titles MUST be exactly the same as in the 1st line of `answersData.js` (case sensitive). You can use `displayTitle` to provided a different title in final report.
	
	Options are also case sensitive.

1.	**In `index.html`** change the `<title>` tag and `<script>` tags so that they point to your data scripts.

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

This is useful if you have many questions in your survey and want to focus only on some questions.

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
You may want to use more advanced filters in your filter sets for more interesting results. You can do this by using `answerFilter` or `questionFilter` functions.

Here is a basic example of both functions which should be easy to modify to your needs. You could for example use `RegExp` to search values for interesting phrases.
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

**Note!** If you publish full scripts (with `answersData`), the answers might reveal identity of people that filled out your survey. This would be bad!

To avoid this, you could make screenshots, but there is also an export script for Node.js.

1.	Install [Node.js](http://nodejs.org/) (you can use default options).
2.	Open command line and go to `js\node` directory.
3.	Run `node export.js "your data directory name"`.

That's it. All files needed to publish the analysis will be in a directory called "_public".

Browser support
---------------

Well amCharts (which I used) have quite wide browser support, but... I just didn't want to use jQuery this time for the rest of the scripts. If your browser is not up for the task (or as British say: doesn't [cut the mustard](http://responsivenews.co.uk/post/18948466399/cutting-the-mustard)) you are out of luck.

This means IE9+, which covers vast majority of users out there anyway (including mobile). It would be a one hour task to rewrite JavaScript, but I've also used IE8+ stuff in CSS. You'd be surprised how clean your code could be if IE8 and below would move out of the way.

So I say - let's make fun stuff for new browsers. Not because we can't do it otherwise, but because it's such a relief to be creative in a friendly environment.
