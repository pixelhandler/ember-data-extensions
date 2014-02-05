module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    blanket_qunit: {
        all: {
          options: {
            urls: ['tests/runner.html?coverage=true&gruntReport'],
            threshold: 97
          }
        }
      }
  });

  grunt.loadNpmTasks('grunt-blanket-qunit');

  grunt.registerTask('default', ['blanket_qunit']);
};
