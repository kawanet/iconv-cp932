/*! iconv-cp932.js */

var table = require("./mappings/cp932.json");
var GETA = "\u3013";

exports.UNKNOWN = table[GETA] || "";
exports.encodeURIComponent = encodeURIComponent;

function encodeURIComponent(str) {
  return str.split("").map(function (c) {
    return table[c] || exports.UNKNOWN;
  }).join("");
}
