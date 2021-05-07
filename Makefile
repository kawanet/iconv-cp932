#!/usr/bin/env bash -c make

MIN_JS=public/iconv-cp932.min.js
TMP_JS=tmp/iconv-cp932.browserify.js
SRC_JS=index.js
MAPPING_TXT=mappings/CP932.TXT
MAPPING_JSON=mappings/cp932.json

CLASS=IconvCP932

ALL=$(MIN_JS) $(TMP_JS)

all: $(MIN_JS)

test: all jshint mocha

clean:
	/bin/rm -f $(ALL)

$(MIN_JS): $(TMP_JS)
	./node_modules/.bin/terser -c -m -o $@ $<

$(TMP_JS): $(SRC_JS) $(MAPPING_JSON)
	./node_modules/.bin/browserify $(SRC_JS) -s $(CLASS) -o $@ --debug

$(MAPPING_TXT):
	grep -v "^#" mappings/README.md | xargs curl -o $@

$(MAPPING_JSON): $(MAPPING_TXT)
	./script/make-table.js

mocha:
	./node_modules/.bin/mocha test

jshint:
	./node_modules/.bin/jshint .

.PHONY: all clean test
