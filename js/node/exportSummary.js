/**
 * Export and save summary data.
 *
 * Will also copy files needed to publish results.
 */

//
// Options
//
var options = {
	dataDirName : ""
	,scriptsPath : "../"
	,outputPath : "../../_output/{dataDirName}/"
	,rootPath : "../../"
	,copySpecification : [null
		,"js/mustardTest.js"

		,"js/logger.js"
		,"js/questions.js"

		,"js/charts/amcharts/amcharts.js"
		,"js/charts/amcharts/images/dragIcon.gif"
		,"js/charts/amcharts/images/dragIconH.gif"
		,"js/charts/amcharts/images/lens.png"

		,"js/charts/color.js"
		,"js/charts/colorGenerator.js"
		,"js/charts/charts.js"

		,"js/chartsRenderer.js"

		//,"js/data/summaryData.js"
		,{source:"js/data/{dataDirName}/questionsData.js", destination:"js/data/questionsData.js"}
		,{source:"js/data/{dataDirName}/filterSets.js", destination:"js/data/filterSets.js"}
		
		// ignores
		,{ignoreMissingSource:true,
			source:"js/data/{dataDirName}/export-ignore/.gitignore", destination:"js/data/.gitignore"}

		,{source:"js/controller-export.js", destinationName:"controller.js"}
		,{source:"index-export.html", destinationName:"index.html"}
		,"index.css"
	]
};

//
// Arguments parsing
//
var arguments = process.argv.splice(2);
if (arguments.length == 0) {
	die("Usage: \n\
		node exportSummary.js \"name of you data folder\"\n\
	");
}
options.dataDirName = arguments[0];

//
// Node includes
//
var fs = require('fs');
var vm = require('vm');
/**
 * @type Copier
 */
var copier = require('./copier.js');

//
// Pre-transform
//
options.outputPath = options.outputPath.replace(/\{dataDirName\}/, options.dataDirName);

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
includeJS(options.scriptsPath + "exporterSummary.js");

// survey specific data
includeJS(options.scriptsPath + "data/" + options.dataDirName + "/summaryData.js");
includeJS(options.scriptsPath + "data/" + options.dataDirName + "/questionsData.js");
includeJS(options.scriptsPath + "data/" + options.dataDirName + "/filterSets.js");

//
// Init
//
var questions = new Questions(questionsData);

//
// Export
//
console.log(summaryDataInput);

var exporter = new ExporterSummary(summaryDataInput, questions);
var summaryData = JSON.stringify(exporter.getSummaryData(), null, "\t");	// nicer output

// copy files (and create dirs)
copier.copyFileArray(options.copySpecification, options.outputPath, options.rootPath,
	function(path){
		return path.replace('{dataDirName}', options.dataDirName);
	}
);

// save data
fs.writeFile(options.outputPath + "js/data/summaryData.js", "var summaryData = " + summaryData, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("summaryData was saved");
    }
});