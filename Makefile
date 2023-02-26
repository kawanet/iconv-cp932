#!/usr/bin/env bash -c make

ALL=\
    index.mjs \
    public/iconv-cp932.min.js \
    build/test.js \

all: $(ALL)

test: all mocha

clean:
	/bin/rm -f $(ALL) build/*.js mappings/*.js src/*.js test/*.js mappings/cp932.json

index.mjs: build/esm/iconv-cp932.bundle.js
	cp $^ $@

public/iconv-cp932.min.js: build/es5/iconv-cp932.wrap.js
	@mkdir -p public/
	./node_modules/.bin/terser -c -m -o $@ -- $<
	ls -l $@

build/%.wrap.js: build/%.bundle.js
	echo 'var IconvCP932 = (function(exports) {' > $@
	egrep -v '^\s*("use strict"|Object.defineProperty.*"__esModule"|(exports.* =)+ void 0)' $< >> $@
	echo 'return exports; })("undefined" !== typeof exports ? exports : {})' >> $@

build/%.bundle.js: build/%.js mappings/cp932.json mappings/ibm.json
	node -e 'const {readFileSync} = require("fs"); process.stdout.write(readFileSync(process.argv[1], "utf-8").replace(/require\(".([^"]+)"\)/mg, (_, file) => readFileSync(file, "utf-8")));' $< > $@

mappings/CP932.TXT:
	grep -v "^#" mappings/README.md | grep http | xargs curl -o $@

mappings/cp932.json: mappings/CP932.TXT mappings/make-table.js
	node mappings/make-table.js $< $@

mocha: test/*.js
	./node_modules/.bin/mocha test

build/es5/%.js: src/%.ts
	./node_modules/.bin/tsc -p tsconfig-es5.json

build/esm/%.js: src/%.ts
	./node_modules/.bin/tsc -p tsconfig-esm.json

%.js: %.ts
	./node_modules/.bin/tsc -p tsconfig.json

build/test.js: test/*.js
	./node_modules/.bin/browserify --list ./test/[0-7]*.js \
		-t [ browserify-sed 's#require\("../(index)?"\)#require("../browser/import")#' ]
	./node_modules/.bin/browserify -o $@ ./test/[0-7]*.js \
		-t [ browserify-sed 's#require\("../(index)?"\)#require("../browser/import")#' ]

.PHONY: all clean test
