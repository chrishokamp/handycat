module.exports = function(config) {
  config.set({
    files : [
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

      'app/bower_components/angular-mocks/angular-mocks.js',

      'app/scripts/vendor/ui-bootstrap-tpls-0.10.0.js',
      'app/scripts/lib/xliff_data_selector.js',
      'app/scripts/lib/german_snowball_stemmer.js',

      'app/scripts/services.js',
      'app/scripts/services/glossary.js',
      'app/scripts/services/fileReader.js',
      'app/scripts/services/xliffParser.js',
      'app/scripts/services/document.js',
      'app/scripts/services/tokenizer.js',
      'app/scripts/services/germanStemmer.js',
      'app/scripts/services/translationMemory.js',
      'app/scripts/services/project.js',

      'app/scripts/directives.js',
      'app/scripts/directives/index.js',
      'app/scripts/directives/specialChars.js',

      'app/scripts/controllers.js',
      'app/scripts/tokenRow/tokenRow.js',
      'app/scripts/tokenRow/draggable.js',
      'app/scripts/tokenRow/gap.js',
      'app/scripts/tokenRow/token.js',
      'app/scripts/targetArea/AceCtrl.js',
      'app/scripts/tabs/tabs.js',
      'app/scripts/glossary/Glossary.js',
      'app/scripts/glossary/xliffFileUpload.js',
      'app/scripts/contentArea/contentArea.js',
      'app/scripts/typeahead/typeahead.js',
      'app/scripts/app.js',

      'test/unit/**/*.js'
    ],
    basePath: '../',
    frameworks: ['jasmine'],
    reporters: ['progress'],
    browsers: ['Chrome'],
    autoWatch: false,
    singleRun: true,
    colors: true
  });
};
