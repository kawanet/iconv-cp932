#!/usr/bin/env mocha -R spec

"use strict";

/* jshint unused:false */

var assert = require("assert");
var TITLE = __filename.split("/").pop();

var tests = {
  // japanese
  "美しい日本語": "%94%FC%82%B5%82%A2%93%FA%96%7B%8C%EA",
  // ascii
  "AB=01&yz=[]": "AB%3D01%26yz%3D%5B%5D",
  // control
  "\x00\x09\x0A\x0D\x7F": "%00%09%0A%0D%7F"
};

describe(TITLE, function() {
  var IconvCP932 = require("../index");

  Object.keys(tests).forEach(function(str) {
    it(JSON.stringify(str), function() {
      var encoded = IconvCP932.encodeURIComponent(str);
      var expected = tests[str];
      assert.equal(encoded, expected);
    });
  });
});
