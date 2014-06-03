angular.module('directives')
.directive('sourceArea', ['$log', 'tokenizer', '$compile', function($log, tokenizer,$compile) {
    // take the text inside the element, tokenize it, and wrap in spans that we can interact with
    return {
      scope: {
        // this comes from the Document service via segment via contentArea
        sourceSentence: '=',
        annotatedSentence: '=',
        findSurfaceForms: '&'
      },
      restrict: 'E',
      //templateUrl: 'scripts/sourceArea/sourceArea.html',
      link: function(scope,el,attrs){
        // tokens should be undefined here
//        $log.log('sourceArea directive - tokens: ' + scope.tokens);
        var tokenStrings = tokenizer.tokenize(scope.sourceSentence);

        // give each token an id, and also move to dot notation
//        var tokens =  _.map(tokenStrings, function(tok, index) { return { index: index, token: tok} });
        var tokenSpans =  _.map(tokenStrings, function(tok, index) { return '<span class="source-token">' + tok + '</span>'});
//        var tokenSpans =  _.map(tokenStrings, function(tok, index) { return '<span popover tooltip="fun fun" class="source-token">' + tok + '</span>'});
//        var tokenSpans =  _.map(tokenStrings, function(tok, index) { return '<span tooltip-html-unsafe="{{getLinkedData()}}" class="source-token">' + tok + '</span>'});
        var annotatedSentence = '<div class="annotated-source">' + tokenSpans.join(' ') + '</div>';
//        $log.log('annotatedSentence is: ' + annotatedSentence);

        var compiledHTML = $compile(annotatedSentence)(scope);
//        scope.annotatedSentence = annotatedSentence;
//        $log.log('compiledHTML is:' + compiledHTML);
        el.append(compiledHTML);

        // update source with new data
        scope.$on('update-source', function(e, data) {
          $log.log('update source fired');
          $log.log('event data');
          $log.log(data);

          // iterate over text and add markup to entity ranges, then $compile
          var text = scope.sourceSentence;
          angular.forEach(data.entityData, function(resObj) {
            var surfaceForm = resObj['@surfaceForm'];
            // test
            scope.$emit('find-surface-forms', { 'sf': surfaceForm });
            var re = new RegExp('(' + surfaceForm + ')', "g");
            text = text.replace(re, '<span style="background-color: blue" ng-click="">$1</span>');
          });
          $log.log('replaced text: ' + text);
          var compiledHTML = $compile(text)(scope);
          $log.log('compiledHTML is:' + compiledHTML);
          el.html(compiledHTML);

        })


      },
      controller: function($scope) {
        $scope.getLinkedData = function() {
          return '<ul><li>test</li><li>test</li><li>test</li></ul>';
        }

      }
    };
}]);

