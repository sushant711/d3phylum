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
        },
        cssmin: {
            minify: {
                expand: true,
                cwd: '<%= dirs.dev %>',
                src: ['d3phylum.css'],
                dest: '<%= dirs.prod %>',
                ext: '.min.css'
            }
        },
    });

    // Load plugins here
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // Define your tasks here
    grunt.registerTask('default', ['uglify', 'cssmin']);
    grunt.registerTask('deploy', ['uglify', 'cssmin']);
};