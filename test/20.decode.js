#!/usr/bin/env mocha -R spec

"use strict";

var assert = require("assert");
var TITLE = __filename.split("/").pop();

var tests = {
  // japanese
  "美しい日本語": "%94%FC%82%B5%82%A2%93%FA%96%7B%8C%EA",
  // latin-1
  "±×÷": "%81%7D%81%7E%81%80",
  // invalid
  "[〓〓]": "%5B%FF%FE%FF%FF%5D",
  // ascii
  "AB=01&yz=[]": "AB%3D01%26yz%3D%5B%5D",
  // control
  "\x00\x09\x0A\x0D\x7F": "%00%09%0A%0D%7F"
};

describe(TITLE, function() {
  var IconvCP932 = require("../index");

  Object.keys(tests).forEach(function(str) {
    it(JSON.stringify(tests[str]), function() {
      var decoded = IconvCP932.decodeURIComponent(tests[str]);
      assert.equal(decoded, str);
    });
  });
});
