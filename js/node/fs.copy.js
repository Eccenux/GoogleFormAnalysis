/**
 * @see https://raw.github.com/coolaj86/utile-fs/master/fs.extra/
 */
(function() {
	"use strict";

	var fs = require('fs')
			;

	function noop() {
	}

	function copy(src, dst, cb) {
		function copyHelper(err) {
			var is
					, os
					;

			if (!err) {
				return cb(new Error("File " + dst + " exists."));
			}

			fs.stat(src, function(err, stat) {
				if (err) {
					return cb(err);
				}

				is = fs.createReadStream(src);
				os = fs.createWriteStream(dst);

				is.pipe(os);
				os.on('close', function(err) {
					if (err) {
						return cb(err);
					}

					fs.utimes(dst, stat.atime, stat.mtime, cb);
				});
			});
		}

		cb = cb || noop;
		fs.stat(dst, copyHelper);
	}

	/**
	 * http://procbits.com/2011/11/15/synchronous-file-copy-in-node-js
	 *
	 * @param {String} srcFile
	 * @param {String} destFile
	 * @returns {@exp;fs@call;closeSync}
	 */
	copy.sync = function(srcFile, destFile) {
		var BUF_LENGTH, buff, bytesRead, fdr, fdw, pos;
		BUF_LENGTH = 64 * 1024;
		buff = new Buffer(BUF_LENGTH);
		fdr = fs.openSync(srcFile, "r");
		fdw = fs.openSync(destFile, "w");
		bytesRead = 1;
		pos = 0;
		while (bytesRead > 0) {
			bytesRead = fs.readSync(fdr, buff, 0, BUF_LENGTH, pos);
			fs.writeSync(fdw, buff, 0, bytesRead);
			pos += bytesRead;
		}
		fs.closeSync(fdr);
		return fs.closeSync(fdw);
	};

	module.exports = copy;
}());
