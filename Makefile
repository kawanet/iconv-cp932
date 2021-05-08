#!/usr/bin/env bash -c make

MIN_JS=public/iconv-cp932.min.js
ALL=$(MIN_JS)

all: $(ALL) build/test.js

test: all mocha

clean:
	/bin/rm -f $(ALL) build/*.js src/*.js test/*.js mappings/*.json

$(MIN_JS): build/bundle.js
	./node_modules/.bin/terser -c -m -o $@ $<

build/bundle.js: src/iconv-cp932.js mappings/cp932.json
	mkdir -p build
	echo 'var IconvCP932 = (function(component, mapping, exports) {' > $@
	cat src/iconv-cp932.js >> $@
	echo 'return exports;' >> $@
	echo '})({encode: encodeURIComponent},' >> $@
	cat mappings/cp932.json >> $@
	echo ', ("undefined" !== typeof exports ? exports : {}))' >> $@
	perl -i -pe 's#^ *("use strict"|Object.defineProperty.*"__esModule"|(exports.* =)+ void 0)#// $$&#mg' $@
	perl -i -pe 's#^ *(var .* = require\()#// $$&#mg' $@

mappings/CP932.TXT:
	grep -v "^#" mappings/README.md | grep http | xargs curl -o $@

mappings/cp932.json: mappings/CP932.TXT src/make-table.js
	node src/make-table.js $< $@

mocha: test/*.js
	./node_modules/.bin/mocha test

src/%.js: src/%.ts
	./node_modules/.bin/tsc -p .

test/%.js: test/%.ts
	./node_modules/.bin/tsc -p .

build/test.js: test/*.js
	./node_modules/.bin/browserify --list ./test/[0-7]*.js \
		-t [ browserify-sed 's#require\("../(index)?"\)#require("../browser/import")#' ]
	./node_modules/.bin/browserify -o $@ ./test/[0-7]*.js \
		-t [ browserify-sed 's#require\("../(index)?"\)#require("../browser/import")#' ]

.PHONY: all clean test
