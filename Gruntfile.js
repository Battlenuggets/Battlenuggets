module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      files: [
        'src/**/*.js'
      ],
      options: {
        force: 'true',
        jshintrc: '.jshintrc',
        ignores: [
          'src/client/lib/**/*.js'
        ]
      }
    },

    copy: {
      client: {
        files: [
          { expand: true, cwd: 'src/client/', src: ['**'], dest: 'public/' }
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mocha-test');
};
