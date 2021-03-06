module.exports = function() {
  return {
    frameworks: ['jasmine'],
    reporters: ['progress'],
//    browsers: ['PhantomJS'],
    browsers: ['Chrome'],
    autoWatch: true,
//    singleRun: false,
    colors: true,
    basePath: '../',

    // these are default values anyway
//    singleRun: false,
    colors: true,


    // generate js files from html templates
    preprocessors: {
      'app/scripts/**/*.html': 'ng-html2js'
    },
    ngHtml2JsPreprocessor: {
        // strip app from the file path
        stripPrefix: 'app/'
    },
    files : [
      // Vendor code
      // exactly the order from index.html

        'app/bower_components/jquery/dist/jquery.js',
        'app/bower_components/angular/angular.js',
        'app/bower_components/angular-aria/angular-aria.js',
        'app/bower_components/angular-ui-router/release/angular-ui-router.js',
        'app/bower_components/sass-bootstrap/dist/js/bootstrap.js',
        'app/bower_components/angular-resource/angular-resource.js',
        'app/bower_components/angular-cookies/angular-cookies.js',
        'app/bower_components/angular-sanitize/angular-sanitize.js',
        'app/bower_components/underscore/underscore.js',
        'app/bower_components/file-saver/FileSaver.js',
        'app/bower_components/jqueryui/ui/jquery-ui.js',
        'app/bower_components/ng-file-upload/angular-file-upload-shim.js',
        'app/bower_components/ng-file-upload/angular-file-upload.js',
        'app/bower_components/angular-animate/angular-animate.js',
        'app/bower_components/angular-http-auth/src/http-auth-interceptor.js',
        'app/bower_components/snapjs/snap.js',
        'app/bower_components/angular-snap/angular-snap.js',
        'app/bower_components/hammerjs/hammer.js',
        'app/bower_components/angular-material/angular-material.js',
         // for now, we have to include the material design css as well(?)
         // see: https://github.com/angular/material/issues/1026
        'app/bower_components/angular-material/angular-material.css',
        'app/bower_components/Caret.js/dist/jquery.caret.js',
        'app/bower_components/At.js/dist/js/jquery.atwho.js',

        'app/scripts/lib/angular-ui-ace/ui-ace.js',
        'app/scripts/lib/german_snowball_stemmer.js',
        'app/scripts/lib/ace-builds-master/src-noconflict/ace.js',
        'app/scripts/lib/ace-builds-master/src-noconflict/ext-language_tools.js',
        'app/scripts/lib/ui-bootstrap-tpls-0.12.0-SNAPSHOT.js',

        'app/scripts/services.js',
        'app/scripts/controllers.js',
        'app/scripts/services/glossary.js',
        'app/scripts/services/fileReader.js',
        'app/scripts/services/xliffParser.js',
        'app/scripts/services/xliffTwoParser.js',
        'app/scripts/services/tokenizer.js',
        'app/scripts/services/ruleMap.js',
        'app/scripts/services/copyPunctuation.js',
        'app/scripts/services/TranslationMemory.js',
        'app/scripts/services/wikipedia.js',
        'app/scripts/services/SegmentOrder.js',
        'app/scripts/services/editSession.js',
        'app/scripts/services/logger.js',

        'app/scripts/services/Auth.js',
        'app/scripts/services/Projects.js',
        'app/scripts/services/Session.js',
        'app/scripts/services/User.js',
        'app/scripts/services/Base64.js',
        'app/scripts/services/EditModeFactory.js',
        'app/scripts/directives.js',
        'app/scripts/navigation/catNav.js',
        'app/scripts/directives/index.js',
        'app/scripts/directives/logger.js',
        'app/scripts/directives/endRepeat.js',
        'app/scripts/editArea/segmentArea/targetArea/staticTarget.js',
        'app/scripts/toolbar/toolbar.js',
        'app/scripts/editArea/toolbar/hud-toolbar.js',
        'app/scripts/editArea/segmentArea/sourceArea/sourceArea.js',
        'app/scripts/editArea/segmentArea/targetArea/AceCtrl.js',
        'app/scripts/directives/specialChars.js',
        'app/scripts/projects/menuItem.js',

        'app/scripts/tokenRow/tokenRow.js',
        'app/scripts/tokenRow/draggable.js',
        'app/scripts/tokenRow/gap.js',
        'app/scripts/tokenRow/token.js',

        'app/scripts/projects/create/createProject.js',
        'app/scripts/login/Login.js',
        'app/scripts/signup/Signup.js',
        'app/scripts/projects/projects.js',
        'app/scripts/editArea/segmentArea/segmentArea.js',
        'app/scripts/editArea/editArea.js',
        'app/scripts/settings/UserSettings.js',
        'app/scripts/languagePair/langPair.js',

        // the typeahead component
        'app/scripts/typeahead/typeahead.js',

        // concordancer component
        'app/scripts/concordancer/concordancer.js',

        // configuration module (config for deployment context)
        'app/scripts/config/config.js',

      // application entry point (shouldn't be needed unless the test uses the application module)
        'app/scripts/app.js',

      // templates
      'app/scripts/toolbar/toolbar.html',
      'app/scripts/typeahead/typeahead.html',

      'app/scripts/cat.templates.js',

      // extra for testing
      'app/bower_components/angular-mocks/angular-mocks.js'



//      'node_modules/chai/chai.js',
//      'test/lib/chai-should.js',
//      'test/lib/chai-expect.js'
    ]
  }
};
