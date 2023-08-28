module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		browserify: {
			'public/bundle.js': 'public/search.js',
		},
		watch: {
			files: ['public/search.js', 'public/data/*'],
			tasks: ['browserify'],
		},
	});

	grunt.registerTask('default', ['watch']);
};
