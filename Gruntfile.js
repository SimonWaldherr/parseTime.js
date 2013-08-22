module.exports = function(grunt) {
  gzip = require("gzip-js");
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    compare_size: {
      files: [ "dist/parseTime.js", "dist/parseTime.min.js" ],
      options: {
        compress: {
          gz: function( contents ) {
            return gzip.zip( contents, {} ).length;
          }
        },
        cache: "dist/.sizecache.json"
      }
    },
    concat: {
      options: {
        separator: '\n\n'
      },
      dist: {
        src: ['./parseTime.js', 'lang/parseTime.de.js', 'lang/parseTime.fr.js', 'lang/parseTime.pt.js'],
        dest: './dist/parseTime.js'
      }
    },
    uglify: {
      options: {
        banner: '/* * * * * * * * * *\n' +
                ' *  parseTime .js  *\n' +
                ' *  Version 0.2.5  *\n' +
                ' *  License:  MIT  *\n' +
                ' * Simon  Waldherr *\n' +
                ' * * * * * * * * * */\n\n',
        footer: '\n\n\n\n /* foo */'
      },
      dist: {
        files: {
          './dist/parseTime.min.js': ['./dist/parseTime.js']
        }
      }
    },
    compress: {
      main: {
        options: {
          mode: 'gzip'
        },
        files: [
          {expand: true, src: 'dist/parseTime.min.js', dest: 'dist/', ext: '.gz.js'}
        ]
      }
    }
  });
  grunt.loadNpmTasks("grunt-compare-size");
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.registerTask('default', ['concat', 'uglify', 'compare_size']);
};
