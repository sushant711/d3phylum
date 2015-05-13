module.exports = function(grunt) {
    // Configuration goes here
    grunt.initConfig({
        dirs: {
            dev: "src",
            prod: "build"
        },
        uglify: {
            my_target: {
                files: {
                    '<%= dirs.prod %>/d3phylum.min.js': [
                        '<%= dirs.dev %>/init.js',
                        '<%= dirs.dev %>/utils.js',
                        '<%= dirs.dev %>/baseChart.js',
                        '<%= dirs.dev %>/components.js',
                        '<%= dirs.dev %>/scatterBubblePlot.js'
                    ]
                }
            }
        }
    });

    // Load plugins here
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Define your tasks here
    grunt.registerTask('default', ['uglify']);
    grunt.registerTask('deploy', ['uglify']);
};