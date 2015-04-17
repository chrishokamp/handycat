angular.module('directives')
.directive('sourceArea', ['$log', 'tokenizer', '$compile', function($log, tokenizer,$compile) {
    // take the text inside the element, tokenize it, and wrap in spans that we can interact with
    return {
      scope: {
        sourceSentence: '=',
        queryGlossary: '='
      },
      restrict: 'E',
      link: function(scope,el,attrs){
        // tokenize the source text
        var tokenStrings = tokenizer.tokenize(scope.sourceSentence);

        // give each token an id, and also move to dot notation
        // watch out for the crazy regex in the next line! - used to escape single quotes
        var tokenSpans =  _.map(tokenStrings, function(tok, index) {
          var tokNorm = tok.replace(/'/g, "\\'").replace('"', '');
          return '<span class="source-token"' +
                      'ng-click="askGlossary(\''+ tokNorm + '\')">'
                      + tok +
                 '</span>';
        });
        var annotatedSentence = '<div class="annotated-source">' + tokenSpans.join('') + '</div>';

        var compiledHTML = $compile(annotatedSentence)(scope);
        el.append(compiledHTML);

        // update source with new data
        scope.$on('update-source', function(e, data) {
          $log.log('update source fired');
          $log.log('event data');
          $log.log(data);

          // iterate over text and add markup to entity ranges, then $compile
          var text = scope.sourceSentence;
          var alreadyMarked = [];
          angular.forEach(data.entityData, function(resObj) {
            var surfaceForm = resObj['@surfaceForm'];
            // test
            if (!(_.contains(alreadyMarked, surfaceForm))) {
              var re = new RegExp('(' + surfaceForm + ')', "g");
              text = text.replace(re, '<span style="text-decoration: underline;" ng-click="setSurfaceForms($event);>$1</span>');
            }
            alreadyMarked.push(surfaceForm);
          });
          text = '<div>' + text + '</div>';
          var compiledHTML = $compile(text)(scope);
          el.html(compiledHTML);

        })


      },
      controller: function($scope) {
        $scope.setSurfaceForms = function(e) {
          var surfaceForm = $(e.target).text();
          $log.log('target text is: ' + surfaceForm);
          $scope.$emit('find-surface-forms', { 'sf': surfaceForm });
        }

        // working -- call a function on the parent (the queryGlossary function passed into this component
        $scope.askGlossary = function(word) {
          $log.log('ask glossary fired');
          $scope.queryGlossary(word);
        }

      }
    };
}]);

