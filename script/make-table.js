#!/usr/bin/env node

"use strict";

var fs = require("fs");

function main() {
  var src = __dirname.replace(/[^/]*\/?$/, "mappings/CP932.TXT");
  var dst = __dirname.replace(/[^/]*\/?$/, "mappings/cp932.json");
  var map = {};
  var prev;
  var cur;
  var check = {};

  console.warn("reading: " + src);
  var table = fs.readFileSync(src, "utf-8");

  table.split(/[\r\n]+/).forEach(function(line) {
    line = line.replace(/\s*#.*$/, "");
    if (!line.length) return;
    var cols = line.split(/\t/);
    if (cols.length < 2) return;
    var jcode = parseInt(cols[0], 16);
    var ucode = parseInt(cols[1], 16);
    if (check[ucode]) return; // duplicated
    check[ucode] = true;
    var ustr = String.fromCharCode(ucode);

    if (prev + 1 === jcode) {
      map[cur] += ustr;
    } else {
      cur = jcode.toString(16).toUpperCase();
      map[cur] = ustr;
    }
    prev = jcode;
  });

  var json = JSON.stringify(map, null, 1);

  console.warn("writing: " + dst);
  fs.writeFileSync(dst, json);
}

main();
