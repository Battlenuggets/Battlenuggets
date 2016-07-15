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
    },

    watch: {
      client: {
        files: [
          'src/client/**'
        ],
        tasks: [
          'copy:client'
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mocha-test');
};
