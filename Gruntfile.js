module.exports = function(grunt) {
	'use strict';

	//load all grunt tasks
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	// grunt.loadNpmTasks('connect-livereload');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	// grunt.loadNpmTasks('grunt-closure-compiler');
	grunt.loadNpmTasks('grunt-wrap');
	// grunt.loadNpmTasks('grunt-peon-gui');
	grunt.loadNpmTasks('grunt-notify');
	//define tasks
	grunt.registerTask('server', ['connect:server', 'watch']);

	var baseFile = [],
		debugFile = baseFile.slice();
	//grunt config
	grunt.initConfig({
		//======== 配置相关 ========
		pkg: grunt.file.readJSON('package.json'),
		src: '',
		uglify: {
			options: {
				beautify: false
			},
			my_target: {
				files: {
					'js/messenger.min.js': ['src/messenger.js']
				}
			}
		},
		//======== 开发相关 ========
		//开启服务
		connect: {
			options: {
				port: 9900,
				// Change this to '0.0.0.0' to access the server from outside.
				// hostname: 'localhost',
				hostname: '0.0.0.0',
				middleware: function(connect, options) {
					return [
						require('connect-livereload')({
							port: Number('<%= watch.options.livereload %>')
						}),
						connect.static(options.base),
					];
				}
			},
			server: {
				options: {
					// keepalive: true,
					base: '<%= src %>',
				}
			}
		},

		watch: {
			options: {
				livereload: 36629
			},
			demo: {
				files: ['**']
			},
			js: {
				files: ['src/*.js', 'src/**/*.js'],
				tasks: ['uglify']
			}
		}


	});
};