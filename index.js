var fs = require('fs');
var ts = require('typescript');
var path = require("path");

var createTscPreprocessor = function(args, config, logger, helper) {
	config = config || {};
	var log = logger.create('preprocessor.tsc');

	// Get the root path for the project.
	var rootPath = fs.realpathSync(__dirname + "/../..");

	// Check to see if tsConfig is set and if so find the tsconfig.json
	if(typeof config.tsConfig !== 'undefined') {
		var redfile = fs.readFileSync(rootPath + "/" + config.tsConfig, 'utf8');
		config = JSON.parse(redfile);
	}

	config = ts.parseJsonConfigFileContent(config, { readDirectory: function() { return []; } }, rootPath);

	if(config.options.sourceMap) {
		config.options.sourceMap = false;
		config.options.inlineSourceMap = true;
		log.info("all TypeScript source maps will be placed inline");
	}
	if(config.options.out) {
		log.warn("can't use the 'out' field as files are compiled individually by karma.");
	}
	if(config.options.declaration) {
		log.warn("can't use the 'declaration' field sorry.");
		delete config.options.declaration;
	}
	if(typeof config.fileNames !== 'undefined') {
		log.warn("can't use the 'files' field as files are compiled individually by karma.");
		delete config.fileNames;
	}

	return function(content, file, done) {
		log.debug("transpiling: " + file.originalPath);
		
		var diag = [];
		
		var compiledFile = ts.transpile(content, config.options, file.originalPath, diag);

		for(var d = 0; d < diag.length; d++) {
			var lineMap = diag[d].file.lineMap;
			var line = diag[d].start + 2;
			console.log(line);
			var found;
			
			for(var i = 0; i < lineMap.length; i++) {
				if (lineMap[i] == line) {
					found = i;
					break;
				}
			}
			
			console.error("Line: " + found + ", Message: " + diag[d].messageText);
		}
		
		var filename =  file.originalPath.replace(/\.ts$/, '.js');

		var sourceRoot = config.options.sourceRoot;
		var outDir = config.options.outDir;
		if(sourceRoot && outDir) {
			var reg = new RegExp(sourceRoot);
			filename = filename.replace(reg, outDir);
		}

		file.path = filename;
		done(compiledFile);
	};
};


createTscPreprocessor.$inject = ['args', 'config.tscPreprocessor', 'logger', 'helper'];

// PUBLISH DI MODULE
module.exports = {
	'preprocessor:tsc': ['factory', createTscPreprocessor]
};


