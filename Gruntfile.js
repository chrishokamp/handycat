'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'
module.exports = function (grunt) {
    // load all grunt tasks
    grunt.loadNpmTasks('grunt-karma');

    // to automatically add templates to the $templateCache
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-autoprefixer');

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'dist'
    };

    try {
        yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
    } catch (e) {}

    grunt.initConfig({
        yeoman: yeomanConfig,
        watch: {
            coffee: {
                files: ['<%= yeoman.app %>/scripts/{,*/}*.coffee'],
                tasks: ['coffee:dist']
            },
            coffeeTest: {
                files: ['test/spec/{,*/}*.coffee'],
                tasks: ['coffee:test']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    '<%= yeoman.app %>/{,*/}*.html',
                    '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
                    '{.tmp,<%= yeoman.app %>}/scripts/**/*.js',
                    '{.tmp,<%= yeoman.app %>}/views/{,*/}*.html',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            },
            compass: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['compass:server', 'autoprefixer']
            },
            styles: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
                tasks: ['newer:copy:styles', 'autoprefixer']
            }
        },
        connect: {
          options: {
            port: 9000,
            // Change this to '0.0.0.0' to access the server from outside.
            //hostname: 'localhost'
            hostname: '0.0.0.0'
          },
//          testserver: {
//            options: {
//              port: 9999
//            }
//          },
          livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'test')
                        ];
                    },
                    port: 9999
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, yeomanConfig.dist)
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                url: 'http://localhost:<%= connect.options.port %>'
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/styles',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= yeoman.app %>/images',
        javascriptsDir: '<%= yeoman.app %>/scripts',
        fontsDir: '<%= yeoman.app %>/styles/fonts',
        importPath: '<%= yeoman.app %>/bower_components',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/styles/fonts',
        relativeAssets: false,
        assetCacheBuster: false
      },
      dist: {
        options: {
          generatedImagesDir: '<%= yeoman.dist %>/images/generated'
        }
      },
      server: {
        options: {
          debugInfo: true
        }
      }
    },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/{,*/}*.js'
            ]
        },
        coffee: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/scripts',
                    src: '{,*/}*.coffee',
                    dest: '.tmp/scripts',
                    ext: '.js'
                }]
            },
            test: {
                files: [{
                    expand: true,
                    cwd: 'test/spec',
                    src: '{,*/}*.coffee',
                    dest: '.tmp/spec',
                    ext: '.js'
                }]
            }
        },
        // not used since Uglify task does concat,
// TODO: do we need this?
        // but still available if needed
        //concat: {
        //    dist: {
        //     files: {
        //         '<%= yeoman.dist %>/scripts/scripts.js': [
        //             '<%= yeoman.dist %>/scripts/scripts.js'
        //         ]
        //     }
        //    }
        //},
        rev: {
            dist: {
                files: {
                    src: [
                        //'<%= yeoman.dist %>/scripts/{,*/}*.js',
                        //'<%= yeoman.dist %>/styles/{,*/}*.css',
                        //'<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                        //'<%= yeoman.dist %>/styles/fonts/*'
                    ]
                }
            }
        },
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },
        usemin: {
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            options: {
                dirs: ['<%= yeoman.dist %>']
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        //cssmin: {
        //    // By default, your `index.html` <!-- Usemin Block --> will take care of
        //    // minification. This option is pre-configured if you do not wish to use
        //    // Usemin blocks.
        //    // chris - minify and concat everything onto main.css
        //     dist: {
        //         files: {
        //             '<%= yeoman.dist %>/styles/main.css': [
        //                 '.tmp/styles/{,*/}*.css',
        //                 '<%= yeoman.app %>/styles/{,*/}*.css'
        //             ]
        //         }
        //     }
        //},
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    //collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: ['*.html', 'views/*.html'],
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
//                        'angular/**/*.html',
                        //'styles/**/*',
                        'views/**/*',
                        'data/**/*',
                        'bower_components/sass-bootstrap/fonts/**/*',
                        'fonts/**/*',
                        'images/{,*/}*.{gif,web,png}',
                    ]
                }, {
                    expand: true,
                    cwd: '.tmp/images',
                    dest: '<%= yeoman.dist %>/images',
                    src: [
                        'generated/*'
                    ]
                }]
            },
          styles: {
            expand: true,
            cwd: '<%= yeoman.app %>/styles',
            dest: '.tmp/styles/',
            src: '{,*/}*.css'
          }
        },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'compass:server',
        'copy:styles'
      ],
      test: [
        'compass',
        'copy:styles'
      ],
      dist: [
        'compass:dist',
        'compass',
        'copy:styles',
        'imagemin',
        'svgmin',
        'htmlmin'
      ]
    },
        karma: {
          unit: {
            configFile: './test/karma-unit.conf.js',
            autoWatch: false,
            singleRun: true
          },
          unit_auto: {
            configFile: './test/karma-unit.conf.js'
          },
          midway: {
            configFile: './test/karma-midway.conf.js',
            autoWatch: false,
            singleRun: true
          },
          midway_auto: {
            configFile: './test/karma-midway.conf.js'
          },
          e2e: {
            configFile: './test/karma-e2e.conf.js',
            autoWatch: false,
            singleRun: true
          },
          e2e_auto: {
            configFile: './test/karma-e2e.conf.js'
          }
        },
        cdnify: {
            dist: {
                html: ['<%= yeoman.dist %>/*.html']
            }
        },
        // ngmin: {
        //     dist: {
        //         files: [{
        //             expand: true,
        //             cwd: '<%= yeoman.dist %>/scripts',
        //             src: '*.js',
        //             dest: '<%= yeoman.dist %>/scripts'
        //         }]
        //     }
        // },
        uglify: {
            files: [{
                expand: true,
                cwd: '<%= yeoman.dist %>/scripts',
// TODO: add scripts.js here
                src: 'vendor.js',
                dest: '<%= yeoman.dist %>/scripts'
//                    '<%= yeoman.dist %>/scripts/scripts.js': [
//                        '<%= yeoman.dist %>/scripts/scripts.js'
//                    ]
            }],
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>/scripts',
                    src: '*.js',
                    dest: '<%= yeoman.dist %>/scripts'
                    //'<%= yeoman.dist %>/scripts/scripts.js': [
                    //    '<%= yeoman.dist %>/scripts/scripts.js'
                    //],
                    //'<%= yeoman.dist %>/scripts/vendor.js': [
                    //    '<%= yeoman.dist %>/scripts/vendor.js'
                    //]
                }]
            }
        },
        ngtemplates: {
          editorComponentsApp: {
            options: {

            },
            cwd: '<%= yeoman.app %>',
            src: 'scripts/**/*.html',
            dest: '<%= yeoman.dist %>/scripts/cat.templates.js'
          }

        }
    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'concurrent:server',
            'connect:livereload',
            'open',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'concurrent:test',
        'connect:test',
        'karma'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'useminPrepare',
        'concurrent:dist',
        'concat',
        'copy',
        'cdnify',
        //'ngmin',
        'cssmin',
        //'uglify:dist',
        'rev',
        'usemin',
        // testing - TODO - add templates path to index.html
        'ngtemplates'
    ]);

    // Testing tasks


  // TODO: note the difference between connect:test and connect:testserver

  grunt.registerTask('test', ['connect:testserver','karma:unit','karma:midway', 'karma:e2e']);
  grunt.registerTask('test:unit', ['karma:unit']);
  grunt.registerTask('test:midway', ['connect:test','karma:midway']);
  grunt.registerTask('test:e2e', ['connect:testserver', 'karma:e2e']);

  //keeping these around for legacy use
  grunt.registerTask('autotest', ['autotest:unit']);
  grunt.registerTask('autotest:unit', ['connect:testserver','karma:unit_auto']);
  grunt.registerTask('autotest:midway', ['connect:testserver','karma:midway_auto']);
  grunt.registerTask('autotest:e2e', ['connect:testserver','karma:e2e_auto']);

  //installation-related
// TODO: use this to build the dev environment with automatic installation
//  grunt.registerTask('install', ['shell:npm_install','shell:bower_install','shell:font_awesome_fonts']);

  grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);


};
