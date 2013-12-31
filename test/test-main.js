// load all the tests that exist ( note that the test filename has to end in '-spec.js' )
var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/spec\.js$/.test(file)) {
      tests.push(file);
    }
  }
}

// Global debug
var DEBUG = true;
var d = function(){
  if (DEBUG && console) { console.log(arguments); }
};

requirejs.config({
    // Karma serves files from '/base'
    //baseUrl: '/base/app/angular',
    baseUrl: '/base/app/scripts',
    //The basePath is to identify the root of your project relative to the configuration file (karma.conf.js),
    //baseUrl: '/base/.tmp',

    paths: {
      // TODO: working - insert bower components' paths
      angular: 	'../bower_components/angular/angular',
      ngRoute: 	'../bower_components/angular-route/angular-route',
      ngResource: '../bower_components/angular-resource/angular-resource',
      jquery: 	'../bower_components/jquery/jquery.min',
      jqueryui: 	'../bower_components/jqueryui/ui/jquery-ui',
      jquerySimulate: '../bower_components/jquery-simulate/jquery.simulate.js',
      underscore: '../bower_components/underscore/underscore-min',
      //domReady: '../bower_components/domready/ready',
      ngCookies: '../bower_components/angular-cookies/angular-cookies',
      ngSanitize: '../bower_components/angular-sanitize/angular-sanitize',
      //angularMocks: '../bower_components/angular-mocks/angular-mocks'
    },
    shim: {
      angular: {
        deps: ['jquery', 'jqueryui'],
        exports: 'angular'
      },
      jqueryui: {
        deps: ['jquery'],
        exports: 'jqueryui'
      },
      jquerySimulate: {
        deps: ['jquery, jqueryui'],
        exports: 'jquerySimulate'
      },
      ngRoute: {
        deps: ['angular'],
        exports: 'ngRoute'
      },
      ngResource: {
        deps: ['angular'],
        exports: 'ngResource'
      },
      ngCookies: {
        deps: ['angular'],
        exports: 'ngCookies'
      },
      ngSanitize: {
        deps: ['angular'],
        exports: 'ngSanitize'
      },
      //angularMocks: {
      //  deps: ['ngResource'],
      //  exports: 'angularMocks'
      //}
    },

    // deps: ask Require.js to load these files (all our tests)
    deps: tests
    // start test run, once Require.js is done (see below)
});

require(
  [
    'angular',
    'app',
    //'domReady',
    'ngRoute',
    'ngResource',
    'ngCookies',
    'ngSanitize',
    'underscore',
    'controllers/controllers',
    'tokenRow/tokenRow',
    'tokenRow/draggable',
    'tokenRow/gap',
    'tokenRow/token',
    'controllers/main',
    'directives/directives'
   ],
   function() {
     console.log("Starting tests...");
     console.log(tests);
     window.__karma__.start();
   }
);
