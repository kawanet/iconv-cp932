/*! iconv-cp932.js */

var cached;

/**
 * GETA MARK
 */

exports.UNKNOWN = "%81%AC";

/**
 * @param str {string}
 * @return {string}
 */

exports.encodeURIComponent = function(str) {
  var table = cached || (cached = getTable());
  return str.split("").map(function(c) {
    return table[c] || exports.UNKNOWN;
  }).join("");
};

/**
 * @private
 */

function getTable() {
  var mapping = require("./mappings/cp932.json");
  var table = {};

  Object.keys(mapping).forEach(function(start) {
    var jcode = parseInt(start, 16);
    mapping[start].split("").forEach(function(ustr) {
      var jstr;
      if (jcode > 255) {
        jstr = "%" + hex(jcode >> 8) + "%" + hex(jcode);
      } else if (ustr === encodeURIComponent(ustr)) {
        jstr = ustr;
      } else {
        jstr = "%" + hex(jcode);
      }
      table[ustr] = jstr;
      jcode++;
    });
  });

  return table;

  function hex(code) {
    return (code < 16 ? "0" : "") + (code & 255).toString(16).toUpperCase();
  }
}
