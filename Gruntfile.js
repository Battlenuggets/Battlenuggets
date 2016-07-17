module.exports = function (grunt) {
  grunt.initConfig({
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
    },

    mochaTest: {
      options: {
        reporter: 'nyan'
      },
      server: {
        src: ['test/server/**/*.js']
      },
      client: {
        src: ['test/client/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'src/server/server.js',
        options: {
          watch: ['src/server']
        }
      }
    }
  });

  // watches both client and server for changes
  grunt.registerTask('dev', function () {
    var nodemon = grunt.util.spawn({
      cmd: 'grunt',
      grunt: true,
      args: 'nodemon'
    });

    // pipe nodemon output to our terminal
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run(['watch:client']);
  });

  grunt.registerTask('build', [
    'copy:client'
  ]);

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-nodemon');
};
