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
        		src: ['js/src/mjj-quizzes-vanilla.js', 'js/src/components/*.jsx'],
        		dest: 'js/src/mjj-quizzes-components.js'
      		},
      		prod: {
      			src: 'js/src/components/*.jsx',
        		dest: 'js/src/mjj-quizzes-components.js',
        		options: {
        			transform: [envify({
                    	NODE_ENV: 'production'
                  	})]
        		}
      		}
    	},
    	concat: {
    		dist: {
      			src: ['js/src/mjj-quizzes-components.js'],
      			dest: 'js/mjj-quizzes.js',
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
				src: 'mjj-quizzes.js',
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
				files: ['js/src/components/*.jsx', 'js/src/mjj-quizzes-vanilla.js'],
				tasks: ['browserify:dev', 'concat'],
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
	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );

	grunt.registerTask( 'i18n', ['addtextdomain', 'makepot'] );
	grunt.registerTask( 'readme', ['wp_readme_to_markdown'] );

	grunt.registerTask( 'build', ['browserify:prod', 'concat', 'uglify', 'sass' ] );

	

	grunt.util.linefeed = '\n';

};
