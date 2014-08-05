module.exports = function() {
  return {
    frameworks: ['jasmine'],
    reporters: ['progress'],
    browsers: ['PhantomJS'],
    autoWatch: true,
//    singleRun: false,
    colors: true,
    basePath: '../',

    // these are default values anyway
//    singleRun: false,
    colors: true,

    files : [
      // Vendor code
      // exactly the order from index.html
      'app/scripts/lib/ace-builds-master/src-noconflict/ace.js',
      'app/scripts/lib/ace-builds-master/src-noconflict/ext-language_tools.js',

      'app/bower_components/jquery/jquery.js',
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-route/angular-route.js',

      'app/bower_components/angular-ui-router/release/angular-ui-router.js',
      'app/bower_components/jqueryui/ui/jquery-ui.js',
      'app/bower_components/angular-ui-ace/ui-ace.js',
      'app/bower_components/angular-resource/angular-resource.js',
      'app/bower_components/angular-cookies/angular-cookies.js',
      'app/bower_components/angular-sanitize/angular-sanitize.js',
      'app/bower_components/angular-animate/angular-animate.js',
      'app/bower_components/underscore/underscore.js',
      'app/bower_components/ng-file-upload/angular-file-upload.js',

      'app/scripts/vendor/ui-bootstrap-tpls-0.10.0.js',
      'app/scripts/lib/german_snowball_stemmer.js',

      // Editor scripts
      // SERVICES
      'app/scripts/services.js',
      'app/scripts/services/glossary.js',
      'app/scripts/services/fileReader.js',
      'app/scripts/services/xliffParser.js',
      'app/scripts/services/document.js',
      'app/scripts/services/tokenizer.js',
      'app/scripts/services/germanStemmer.js',
      'app/scripts/services/translationMemory.js',
      'app/scripts/services/project.js',
      'app/scripts/services/wikipedia.js',
      'app/scripts/services/morphology.js',
      'app/scripts/services/entityLinker.js',
      'app/scripts/services/segmentOrder.js',

      // DIRECTIVES
      'app/scripts/directives.js',
      'app/scripts/directives/index.js',
      'app/scripts/directives/specialChars.js',
      'app/scripts/directives/logger.js',

      // CONTROLLERS
      'app/scripts/controllers.js',
      'app/scripts/tokenRow/tokenRow.js',
      'app/scripts/tokenRow/draggable.js',
      'app/scripts/tokenRow/gap.js',
      'app/scripts/tokenRow/token.js',
      'app/scripts/targetArea/AceCtrl.js',
      'app/scripts/tabs/tabs.js',
      'app/scripts/glossary/Glossary.js',
      'app/scripts/xliffFileUpload/xliffFileUpload.js',
      'app/scripts/contentArea/contentArea.js',
      'app/scripts/segmentArea/segmentArea.js',
      'app/scripts/typeahead/typeahead.js',

      // FILTERS

      // application entry point
      'app/scripts/app.js',

      // extra for testing
      'app/bower_components/angular-mocks/angular-mocks.js'

//      'node_modules/chai/chai.js',
//      'test/lib/chai-should.js',
//      'test/lib/chai-expect.js'
    ]
  }
};
