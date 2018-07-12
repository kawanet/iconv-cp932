/*! iconv-cp932.js */

var mapping = require("./mappings/cp932.json");
var encodeTable;
var decodeTable;

/**
 * GETA MARK
 */

exports.UNKNOWN = "%81%AC";

/**
 * @param str {string}
 * @return {string}
 */

exports.encodeURIComponent = function(str) {
  if (!encodeTable) encodeTable = getEncodeTable();

  return str.split("").map(function(c) {
    return encodeTable[c] || exports.UNKNOWN;
  }).join("");
};

/**
 * @param str {string}
 * @return {string}
 */

exports.decodeURIComponent = function(str) {
  if (!decodeTable) decodeTable = getDecodeTable();
  var unknown;

  return unescape(str).replace(/[\x80-\x9F\xE0-\xFF]?[\x00-\xFF]/g, function(s) {
    return decodeTable[s] || unknown || (unknown = decodeTable[unescape(exports.UNKNOWN)]);
  });
};

/**
 * @private
 */

function getEncodeTable() {
  var table = {};

  Object.keys(mapping).forEach(function(start) {
    var jcode = parseInt(start, 16);
    mapping[start].split("").forEach(function(ustr) {
      var jstr;
      if (jcode > 255) {
        jstr = "%" + hex(jcode >> 8) + "%" + hex(jcode & 255);
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
    return (code < 16 ? "0" : "") + (code).toString(16).toUpperCase();
  }
}

function getDecodeTable() {
  var table = {};

  Object.keys(mapping).forEach(function(start) {
    var jcode = parseInt(start, 16);
    mapping[start].split("").forEach(function(ustr) {
      var jstr = String.fromCharCode(jcode & 255);
      if (jcode > 255) {
        jstr = String.fromCharCode(jcode >> 8) + jstr;
      }
      table[jstr] = ustr;
      jcode++;
    });
  });

  return table;
}
