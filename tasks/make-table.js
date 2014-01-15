/*! make-table.js */

module.exports = function(grunt) {
  grunt.registerMultiTask('makeTable', 'updating mapping table', function() {
    var options = this.options();
    this.files.forEach(function(file) {
      makeTable(grunt, file.src, file.dest, options);
    });
  });
};

function makeTable(grunt, src, dest, options) {
  grunt.log.writeln(src + ' -> ' + dest);
  var table = grunt.file.read(src);
  var buf = [];
  var check = {};
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
    var uenc = encodeURIComponent(ustr);
    var jstr;
    if (ustr == uenc) {
      jstr = ustr;
    } else if (jcode < 256) {
      jstr = "%" + hex(jcode).toUpperCase();
      if (ucode < 256) ustr = "\\u00" + hex(ucode);
    } else {
      jstr = ("%" + hex(jcode >> 8) + "%" + hex(jcode)).toUpperCase();
    }
    buf.push(' "' + ustr + '": "'+ jstr + '"');
  });
  var json = "{\n" + buf.join(",\n") + "\n}\n";
  grunt.file.write(dest, json);
}

function hex(code) {
  var str = (code & 255).toString(16);
  return (code < 16) ? "0" + str : str;
}
