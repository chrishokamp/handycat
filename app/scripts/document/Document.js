'use strict';

define(['controllers/controllers'], function(controllers) {

  controllers.controller('Doc', ['$scope', function($scope) {
    // Parse an xliff document
    // user selects the file, then it is parsed by DOMParser()
    // does angular have a DOMParser? -- Answer: yes, in $ngSanitize, but it's not intended for this purpose

    // We want a collection of segements
    // the document service only manages one document at a time (for now)
    //$scope.segments =

  }]);
});