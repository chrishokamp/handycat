'use strict';

// Global debug
var DEBUG = true;
var d = function(){
	if (DEBUG && console) { console.log(arguments); }
};

require.config({
	paths: {
    //ace: 'lib'
		angular: 	'../bower_components/angular/angular',
		ngRoute: 	'../bower_components/angular-route/angular-route',
		ngResource: '../bower_components/angular-resource/angular-resource',
		jquery: 	'../bower_components/jquery/jquery.min',
    jqueryui: 	'../bower_components/jqueryui/ui/jquery-ui',
    underscore: '../bower_components/underscore/underscore-min',
    domReady: '../bower_components/domready/ready',
    ngCookies: '../bower_components/angular-cookies/angular-cookies',
    ngSanitize: '../bower_components/angular-sanitize/angular-sanitize',
    ngAnimate: 	'../bower_components/angular-animate/angular-animate',
    uiAce: '../bower_components/angular-ui-ace/ui-ace',
    //'ace': '/scripts/lib/ace/lib/ace/ace',
    //ace: 'scripts/lib/ace/lib/ace',
    //ace: '../bower_components/ace/build/src/ace',
    // added for language_tools
    //language_tools: 'lib/ace/lib/ace/ext/language_tools',
    //uiBootstrap: '../bower_components/angular-ui-bootstrap/dist/ui-bootstrap-tpls-0.10.0'
    // TODO: added to get access to the new popover template directive - found on github (somebody's modified uiBootstrap)
    uiBootstrap: 'vendor/ui-bootstrap-tpls-0.10.0',
    ngFileUpload: '../bower_components/ng-file-upload/angular-file-upload',
    // TODO: create a proper xliff parsing component
    xliffParser: 'lib/xliff_data_selector',
    uiRouter: 	'../bower_components/angular-ui-router/release/angular-ui-router'
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
    uiBootstrap: {
      deps: ['angular'],
      exports: 'uiBootstrap'
    },
		ngRoute: {
			deps: ['angular'],
			exports: 'ngRoute'
    },
    uiRouter: {
      deps: ['angular', 'ngResource'],
      exports: 'uiRouter'
    },
		ngResource: {
			deps: ['angular'],
			exports: 'ngResource'
		},
    ngAnimate: {
      deps: ['angular'],
      exports: 'ngAnimate'
    },
    ngCookies: {
      deps: ['angular'],
      exports: 'ngCookies'
    },
    ngSanitize: {
      deps: ['angular'],
      exports: 'ngSanitize'
    },
    uiAce: {
      deps: ['angular'],
      exports: 'uiAce'
    },
    ngFileUpload: {
      deps: ['angular'],
      exports: 'ngFileUpload'
    }
	}
});

require(
	[
		'angular',
		'app',
    'domReady',
		//'ngRoute',
    //'lib/ace/build/src/ext-language_tools',
    'uiRouter',
		'ngResource',
    'ngAnimate',
    'ngCookies',
    'ngSanitize',
    'underscore',
    'xliffParser',
    'controllers/controllers',

    'services/services',
    'services/glossary',
    'services/fileReader',
    'services/xliffParser',
    'services/document',
    'services/tokenizer',

    'directives/directives',
    'directives/index',
    'directives/specialChars',

    'tokenRow/tokenRow',
    'tokenRow/draggable',
    'tokenRow/gap',
    'tokenRow/token',
    'aceEditor/AceCtrl',
    'ace_utils/wordHighlighter',

    'tabs/tabs',

    'glossary/Glossary',
    'glossary/xliffFileUpload',
    'contentArea/contentArea',
    'services/translationMemory',
    'menu/Menu',
    'typeahead/typeahead',
    'services/project'

    // TODO: ngFileSelect (local directive) has the same name as the library ngFileSelect
    //'directives/ngFileSelect',
	],
	function(angular, app, domReady,uiRouter, ngResource){
    // WORKING: set up ui router

    app.config(['$stateProvider', '$urlRouterProvider',
      function($stateProvider, $urlRouterProvider){

        $stateProvider
          .state('home', {
            url: '/home',
            templateUrl: 'views/main.html',
            controller: ''
          })
          .state('ace', {
            url: '/ace',
            templateUrl: 'scripts/aceEditor/ace-drag-test.html'
          })
          .state('edit', {
            url: '/edit',
            templateUrl: 'views/edit.html'
          });

        $urlRouterProvider
          .otherwise('/home');
      }
    ]);
		//app.config(['$routeProvider',
		//	function($routeProvider){
		//		$routeProvider
    //      .when('/', {
    //        templateUrl: 'views/main.html'
    //        //controller: 'MainCtrl'
    //       })
		//			.otherwise({
		//				redirectTo: '/'
		//			});
		//	}
		//]);
		domReady(function(){
			angular.bootstrap(document, ['editorComponentsApp']);
		});
	}
);