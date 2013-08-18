/**
 * Export and save summary data.
 *
 * Will also copy files needed to publish results.
 */
var options = {
	dataDirName : ""
	,scriptsPath : "../"
	,outputPath : "../_public/"
};

var arguments = process.argv.splice(2);
if (arguments.length == 0) {
	die("Usage: \n\
		node export.js \"name of you data folder\"\n\
	");
}
options.dataDirName = arguments[0];

//
// Node includes
//
var fs = require('fs');
var vm = require('vm');
fs.copy = require('./fs.copy.js');
fs.mkdirp = require('./mkdirp.js');
fs.mkdirpSync = fs.mkdirp.sync;
// Alias
fs.mkdirRecursive = fs.mkdirp;
fs.mkdirRecursiveSync = fs.mkdirp.sync;

//
// Pre-checks
//
if (fs.existsSync(options.outputPath)) {
	die ("The output path must not exist! \n\
Please (re)move it before you restart.\n\
The output path is: " + options.outputPath);
}

/**
 * End execution with message.
 *
 * @param {String} message
 */
function die(message) {
	console.log(message);
	process.exit();
}

/**
 * Synchornous include of non-node JS file.
 *
 * @param {String} path JavaScript file path.
 */
function includeJS(path) {
	var error = false;
	try {
		var code = fs.readFileSync(path, 'utf-8');
		if (code.length <= 0) {
			error = true;
		}
	} catch (e) {
		error = true;
	}
	if (error) {
		die('File not found or empty: ' + path);
	}
	vm.runInThisContext(code, path);
}

// just a little trick...
window = global;

//
// Includes
//
// base libraries
includeJS(options.scriptsPath + "logger.js");
includeJS(options.scriptsPath + "questions.js");
includeJS(options.scriptsPath + "answers.js");
includeJS(options.scriptsPath + "summaryRow.js");
includeJS(options.scriptsPath + "date-functions.js");
includeJS(options.scriptsPath + "filterSet.js");

// chart libraries
//includeJS(options.scriptsPath + "charts/amcharts/amcharts.js");
AmCharts = {};
includeJS(options.scriptsPath + "charts/color.js");
includeJS(options.scriptsPath + "charts/colorGenerator.js");
includeJS(options.scriptsPath + "charts/charts.js");

// exporter
includeJS(options.scriptsPath + "exporter.js");

// survey specific data
includeJS(options.scriptsPath + "data/" + options.dataDirName + "/answersData.js");
includeJS(options.scriptsPath + "data/" + options.dataDirName + "/questionsData.js");
includeJS(options.scriptsPath + "data/" + options.dataDirName + "/filterSets.js");

//
// Init
//
var questions = new Questions(questionsData);
var answers = new Answers(answersData, questions);

//
// Export
//
var exporter = new Exporter(answers, questions, filterSets);
var summaryData = JSON.stringify(exporter.getSummaryData(), null, "\t");	// nicer output

// prepare dir
fs.mkdirRecursiveSync(options.outputPath + "js/data/");

// save data
fs.writeFile(options.outputPath + "js/data/summaryData.js", "var summaryData = " + summaryData, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("summaryData was saved");
    }
});