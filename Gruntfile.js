/*! Gruntfile.js */

module.exports = function(grunt) {

  var pkg = require('./package.json');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-quote-json');
  grunt.loadTasks('./tasks');

  var jshint_src = [
    './*.js',
    './src/*.js',
    './tasks/*.js'
  ];

  var jshint_json = [
    './mappings/*.json'
  ];

  // Project configuration.
  grunt.initConfig({

    // https://github.com/gruntjs/grunt-contrib-jshint
    jshint: {
      js: {
        src: jshint_src
      },
      json: {
        src: jshint_json
      },
      options: {
//        'proto': true, // W103: The '__proto__' property is deprecated.,
    //    'undef': true, // W117: 'xxx' is not defined.
        'node': true,
        'globals': {
  //        describe: true, // mocha
//          it: true
        }
      }
    },

    // https://github.com/jmreidy/grunt-browserify
    browserify: {
      all: {
        files: {
          './public/iconv-cp932.js': [pkg.main]
        },
        options: {
          standalone: 'IconvCP932'
        }
      }
    },

    // https://github.com/gruntjs/grunt-contrib-uglify
    uglify: {
      all: {
        files: {
          './public/iconv-cp932.min.js': ['./public/iconv-cp932.js']
        },
        options: {
          banner: '/*! ' + pkg.name + ' ' + pkg.version + ' */\n'
        }
      }
    },

    // tasks/quote-json.js
    quoteJson: {
      bower: {
        src: 'package.json',
        dest: 'bower.json',
        options: {
          fields: {
            name: 1,
            version: 1,
            homepage: 1,
            description: 1,
            repository: 1
          }
        }
      }
    },

    // tasks/make-table.js
    makeTable: {
      cp932: {
        src: 'mappings/CP932.TXT',
        dest: 'mappings/cp932.json'
      }
    },

    miniTests: {
      all: {}
    }
  });

  grunt.registerTask('default', ['jshint:js', 'makeTable:cp932', 'jshint:json', 'miniTests', 'browserify', 'uglify', 'quoteJson']);
};
