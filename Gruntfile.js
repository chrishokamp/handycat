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

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);  // load all grunt tasks
//  grunt.loadNpmTasks('grunt-karma');
//
//  // to automatically add templates to the $templateCache
  grunt.loadNpmTasks('grunt-angular-templates');
//  grunt.loadNpmTasks('grunt-autoprefixer');
//
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
    express: {
      options: {
        port: process.env.PORT || 9000,
        livereload: LIVERELOAD_PORT
      },
      dev: {
        options: {
//          script: 'server/web.js'
          script: 'web.js'
        }
      },
      prod: {
        options: {
          script: 'web.js',
          node_env: 'production'
        }
      }
    },
//    open: {
//      server: {
//        url: 'http://localhost:<%= express.options.port %>'
//      }
//    },
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
      express: {
        files: [
          '<%= yeoman.app %>/<%= yeoman.views %>/{,*//*}*.html',
          '{.tmp,<%= yeoman.app %>}/styles/{,*//*}*.css',
          '{.tmp,<%= yeoman.app %>}/scripts/{,*//*}*.js',
          '<%= yeoman.app %>/images/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}',
          'web.js',
          'server/{,*//*}*.{js,json}'
        ],
        tasks: ['express:dev'],
        options: {
//          livereload: LIVERELOAD_PORT,
//          nospawn: true //Without this option specified express won't be reloaded
          spawn: false
        }

      },
      styles: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      }
    },
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        //hostname: 'localhost'
        hostname: '0.0.0.0'
      },
      testserver: {
        options: {
          port: 9999
        }
      },
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
      heroku: {
        files: [{
          dot: true,
          src: [
            'heroku/*',
            '!heroku/.git*',
            '!heroku/Procfile'
          ]
        }]
      },
      handycat_builds: {
        files: [{
          dot: true,
          src: [
            'handycat_builds/*',
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
//        assetCacheBuster: false
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
            'styles/fonts/**/*',
            'styles/img/**/*',
            'views/**/*',
            'data/**/*',
            'bower_components/sass-bootstrap/fonts/**/*',
            'fonts/**/*',
            'images/{,*/}*.{gif,web,png}',
//                        '../server/db/*.js',
//                        '../server/*.js',
//                        '../server/package.json'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: [
            'generated/*'
          ]
        },
          {
            expand: true,
            cwd: '.tmp/concat/scripts',
            dest: '<%= yeoman.dist %>/scripts',
            src: [
              '*.js'
            ]
          }
        ],
      },
      heroku: {
        files: [{
          expand: true,
          dot: true,
          dest: 'heroku',
          src: [
            '<%= yeoman.dist %>/**',
//            '<%= yeoman.views %>/**'
          ]
        }, {
          expand: true,
          dest: 'heroku',
          src: [
            'package.json',
            'web.js',
            'server/**/*'
          ]
        }]
      },
      handycat_builds: {
        // the frontend application
        files: [{
          expand: true,
          dot: true,
          dest: 'handycat_builds',
          src: [
            '<%= yeoman.dist %>/**',
          ]
        },
        // the main express server
        // TODO: this is currently copying node_modules inside server/
        {
          expand: true,
          dest: 'handycat_builds',
          src: [
            'package.json',
            'web.js',
            'server/**/*'
          ]
        },
        // the microservices
        {
          expand: true,
          dest: 'handycat_builds',
          src: [
            // TODO: not .pyc
            // TODO: maintain file structure
            // TODO: each microservice should specify its deps in a requirements.txt
            'microservices/lm_autocomplete/**/*.py',
            // TODO: right now we copy the test_data just for convenience
            'microservices/lm_autocomplete/test_data/**/*.lm',
            'microservices/lm_autocomplete/test_data/**/*input-filtered',
            'microservices/xliff_creator/**/*',
            'microservices/vocabulary_server/**/*.{js,json}',
          ]
        },
      ]
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
        'coffee:dist',
        'compass:server',
        'copy:styles'
      ],
      test: [
        'coffee',
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
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>/scripts',
          src: '*.js',
          dest: '<%= yeoman.dist %>/scripts'
        }]
      }
    },
    uglify: {
      files: [{
        expand: true,
        cwd: '<%= yeoman.dist %>/scripts',
// TODO: add scripts.js here
        src: '*.js',
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


  grunt.registerTask('express-keepalive', 'Keep grunt running', function() {
    this.async();
  });

  grunt.registerTask('express-server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'express:prod', 'open', 'express-keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'autoprefixer',
      'express:dev',
      'open',
      'watch'
    ]);
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
    'copy:dist',
    'cdnify',
    'ngmin',
    'cssmin',
    // TODO: we need uglify to work
    //'uglify:dist',
    'rev',
    'usemin',
    'ngtemplates'
  ]);

  // Testing tasks


  // TODO: note the difference between connect:test and connect:testserver
  // this is the only one currently in use
//  grunt.registerTask('autotest', ['autotest:unit']);

//  grunt.registerTask('test', ['connect:testserver','karma:unit','karma:midway', 'karma:e2e']);
  grunt.registerTask('test:unit', ['connect:testserver', 'karma:unit']);
//  grunt.registerTask('test:midway', ['connect:test','karma:midway']);
//  Working - switch to protractor all the way
//  grunt.registerTask('test:e2e', ['connect:testserver', 'karma:e2e']);

  //keeping these around for legacy use
//  grunt.registerTask('autotest:unit', ['connect:testserver','karma:unit_auto']);
//  grunt.registerTask('autotest:midway', ['connect:testserver','karma:midway_auto']);
//  grunt.registerTask('autotest:e2e', ['connect:testserver','karma:e2e_auto']);

  grunt.registerTask('heroku', [
    'build',
    'clean:heroku',
    'copy:heroku'
  ]);

  grunt.registerTask('handycat_builds', [
    'build',
    'clean:handycat_builds',
    'copy:dist',
    'copy:handycat_builds'
  ]);

  //installation-related
// TODO: use this to build the dev environment with automatic installation
//  grunt.registerTask('install', ['shell:npm_install','shell:bower_install','shell:font_awesome_fonts']);

  grunt.registerTask('default', [
    'jshint',
    'test',
    'build'
  ]);


};
