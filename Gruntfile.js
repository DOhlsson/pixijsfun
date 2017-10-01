module.exports = function(grunt){
  grunt.initConfig({
    mocha_istanbul: {
      coverage: {
        src: 'test', // a folder works nicely
        options: {
          mask: '*.js'
        }
      }
    }
  });

  grunt.event.on('coverage', function(lcovFileContents, done){
    // Check below on the section "The coverage event"
    console.log(lcov);
    done();
  });

  grunt.loadNpmTasks('grunt-mocha-istanbul');

  grunt.registerTask('coverage', ['mocha_istanbul:coverage']);
};
