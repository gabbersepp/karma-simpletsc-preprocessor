# karma-simpletsc-preprocessor

> A simple Karma Preprocessor that compiles your TypeScript files without creating output files.

[![NPM][npm]](https://nodei.co/npm/karma-simpletsc-preprocessor/)

## Installation

Add `karma-simpletsc-preprocessor` as a devDependency in your `package.json`.
```json
    {
      "devDependencies": {
        "karma-simpletsc-preprocessor": "0.0.1"
      }
    }
```

Or just issue the following command:
```bash
npm install karma-simpletsc-preprocessor --save-dev
```

## Configuration
Below is two examples of how to use the preprocessor

Using a `tsconfig.json` file:
```js
    module.exports = function(config) {
        config.set({
            preprocessors: {
                '**/*.ts': ['tsc']
            },
            simpletscPreprocessor: {
                tsConfig: 'tsconfig.json' // relative to __dirname path
            }
        });
    };
```


Using a compilerOptions object:
```js
    module.exports = function(config) {
    	config.set({
    		preprocessors: {
    			'**/*.ts': ['tsc']
    		},
    
    		simpletscPreprocessor: {
    			compilerOptions: {
    				module: "amd",
    				target: "ES5",
    				noImplicitAny: true,
    				removeComments: true,
    				inlineSourceMap: true,
    				preserveConstEnums: true,
    				sourceRoot: ''
    			}
    		}
    
    	});
    };
```

Notes:
- If you provide both `tsConfig` and `compilerOptions` then `tsConfig` will be chosen.
- Setting `sourceMap` to true currently emulates the `inlineSourceMap` behaviour.

Warning:
- The TypeScript git repo is a dependency for this preprocessor, this is so the complied TypeScript files can contain
  the latest features. The only downside to this is that downloading this preprocessor will take a long time because
  it has to download the whole TypeScript repo as well.

----

For more information on Karma see the [homepage].

[homepage]: http://karma-runner.github.com
[npm]: https://nodei.co/npm/karma-simpletsc-preprocessor.png
