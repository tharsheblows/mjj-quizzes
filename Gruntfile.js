var envify = require('envify/custom');

module.exports = function( grunt ) {

	'use strict';
	var banner = '/**\n * <%= pkg.homepage %>\n * Copyright (c) <%= grunt.template.today("yyyy") %>\n * This file is generated automatically. Do not edit.\n */\n';
	// Project configuration
	grunt.initConfig( {

		pkg: grunt.file.readJSON( 'package.json' ),

		addtextdomain: {
			options: {
				textdomain: 'mjj-quizzes',
			},
			target: {
				files: {
					src: [ '*.php', '**/*.php', '!node_modules/**', '!php-tests/**', '!bin/**' ]
				}
			}
		},

		wp_readme_to_markdown: {
			your_target: {
				files: {
					'README.md': 'readme.txt'
				}
			},
		},

		makepot: {
			target: {
				options: {
					domainPath: '/languages',
					mainFile: 'mjj-quizzes.php',
					potFilename: 'mjj-quizzes.pot',
					potHeaders: {
						poedit: true,
						'x-poedit-keywordslist': true
					},
					type: 'wp-plugin',
					updateTimestamp: true
				}
			}
		},
		browserify: {
      		dev: {
        		src: 'js/src/components/*.jsx',
        		dest: 'js/mjj-quizzes.js'
      		},
      		prod: {
      			src: 'js/src/components/*.jsx',
        		dest: 'js/mjj-quizzes.js',
        		options: {
        			transform: [envify({
                    	NODE_ENV: 'production'
                  	})]
        		}
      		}
    	},
    	uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				expand: true,
				ext: '.min.js',
          		cwd: 'js',
				src: '*.js',
				dest: 'js'
			}
		},
    	sass: {
			build: {
    			files: {
    			  	'css/mjj-quizzes.css': 'css/scss/mjj-quizzes.scss'
    			}
			}
		},
		watch: {
			sass: {
				files: ['css/scss/*.scss'],
				tasks: ['sass'],
				options: {
					debounceDelay: 500
				}
			},

			scripts: {
				files: ['js/src/components/*.jsx'],
				tasks: ['browserify:dev'],
				options: {
					debounceDelay: 500
				}
			}
		}
	} );

	grunt.loadNpmTasks( 'grunt-wp-i18n' );
	grunt.loadNpmTasks( 'grunt-wp-readme-to-markdown' );
	grunt.loadNpmTasks( 'grunt-browserify' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-contrib-sass' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );

	grunt.registerTask( 'i18n', ['addtextdomain', 'makepot'] );
	grunt.registerTask( 'readme', ['wp_readme_to_markdown'] );

	grunt.registerTask( 'build', ['browserify:prod', 'uglify', 'sass' ] );

	

	grunt.util.linefeed = '\n';

};
