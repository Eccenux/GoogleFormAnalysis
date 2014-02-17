//
// includes
//
var path = require('path');
var fs = require('fs');
var copy = require('./fs.copy.js');
fs.copy = copy;
fs.copySync = copy.sync;
var mkdirp = require('./mkdirp.js');
fs.mkdirRecursive = mkdirp;
fs.mkdirRecursiveSync = mkdirp.sync;

//
// export
//
module.exports = new Copier();

/**
 * File copier.
 * @returns {Copier}
 */
function Copier() {
	function Exception(message) {
		this.name = "CopierException";
		this.message = message;
	}

	/**
	 * Copy file to destination (creates destination directory if it doesn't exist).
	 *
	 * @param {String} sourcePath
	 * @param {String} destinationPath
	 * @param {Boolean} ignoreMissingSource if true then missing source will not throw
	 */
	this.copyFile = function (sourcePath, destinationPath, ignoreMissingSource) {
		//console.log("source: " + sourcePath);
		if (!fs.existsSync(sourcePath)) {
			if (ignoreMissingSource) {
				return;
			}
			throw (new Exception("Source path does not exist.\n" + sourcePath));
		}
		var destinationDir = path.dirname(destinationPath);
		if (!fs.existsSync(destinationDir)) {
			fs.mkdirRecursiveSync(destinationDir);
		}
		fs.copySync(sourcePath, destinationPath);
	};

	/**
	 * Copy file to destination (creates destination directory if it doesn't exist).
	 *
	 * @param {Array} sourcePaths
	 *		Array of source paths.
	 *		If destination name is to be then different use {source:'', destinationName:''}.
	 *		If destination realtive path is to be then different use {source:'', destination:''}.
	 *		If missing source should be just omiited use {source:'', ignoreMissingSource:true, ...}.
	 * @param {String} destinationDir Destiantion directory path.
	 * @param {String} sourceDir Source directory path (base) - if not given current dir will be used.
	 * @param {Function} parsingFunction Extra parsing of both paths (takes path, returns path).
	 */
	this.copyFileArray = function (sourcePaths, destinationDir, sourceDir, parsingFunction) {
		var destination, source;
		sourceDir = sourceDir || "./";
		parsingFunction = parsingFunction || false;
		//console.log (sourcePaths);
		for (var i = 0; i < sourcePaths.length; i++) {
			source = sourcePaths[i];
			if (!source) {
				continue;
			}
			var ignoreMissingSource = false;
			if (typeof(source) == 'object') {
				if ('destinationName' in source) {
					destination = path.join(path.dirname(source.source), source.destinationName);
				} else if ('destination' in source) {
					destination = source.destination;
				}
				if ('ignoreMissingSource' in source) {
					ignoreMissingSource = source.ignoreMissingSource;
				}
				source = source.source;
			} else {
				destination = source;
			}
			source = path.join(sourceDir, source);
			destination = path.join(destinationDir, destination);
			if (parsingFunction) {
				source = parsingFunction(source);
				destination = parsingFunction(destination);
			}

			//console.log(source + ", " + destination);
			this.copyFile(source, destination, ignoreMissingSource);
		}
	};
}