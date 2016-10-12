angular.module('handycat.posteditors', ['handycatConfig']);

angular.module('handycat.posteditors')
.directive('postEditor', ['$log', 'tokenizer', '$compile', function($log, tokenizer,$compile) {
    // take the text inside the element, tokenize it, and wrap in spans that we can interact with
    return {
      scope: {
        targetSentence: '=',
      },
      restrict: 'E',
      link: function(scope,$el,attrs){
        // tokenize the source text
        var tokenStrings = tokenizer.tokenize(scope.targetSentence);

        // wrap known spans with the post-editor directive
        // uses the angular-select-text directive
        var tokenSpans =  _.map(tokenStrings, function(tok, index) {
          // watch out for the crazy regex in the next line! - used to escape single quotes
          var tokNorm = tok.replace(/'/g, "\\'").replace('"', '');
          return '<span class="source-token" select-text ' +
                      'ng-click="askGlossary(\''+ tokNorm + '\')">'
                      + tok +
                 '<md-tooltip class="post-editor-menu">' +
                   '<md-list>' +
                     '<md-list-item><i class="ion-ios7-close-outline"></i> Delete</md-list-item>' +
                     '<md-divider></md-divider>' +
                     '<md-list-item><i class="ion-plus-round"></i> Insert</md-list-item>' +
                     '<md-divider></md-divider>' +
                     '<md-list-item><i class="ion-arrow-move"></i> Move</md-list-item>' +
                     '<md-divider></md-divider>' +
                     '<md-list-item><i class="ion-loop"></i> Replace</md-list-item>' +
                     '<md-divider></md-divider>' +
                   '</md-list>' +
                 '<md-tooltip>' +
                 '</span>';
        });

        var annotatedSentence = '<div class="annotated-source">' + tokenSpans.join('') + '</div>';

        var compiledHTML = $compile(annotatedSentence)(scope);
        $el.append(compiledHTML);

        var getSelectedText = function() {
          var text = "";
          if (window.getSelection) {
            text = window.getSelection().toString();
          } else if (document.selection && document.selection.type != "Control") {
            text = document.selection.createRange().text;
          }
          return text;
        }

        // don't allow other tooltips to fire when one is already focused
        $('.source-token').focus(function(e) {
          $(".source-token").not(this).css('pointer-events', "none")
        });
        $('.source-token').focusout(function(e) {
          $(".source-token").css('pointer-events', "auto")
        });

        $el.on('mouseup', function(e) {
          var selectedText = getSelectedText();
          $log.log('selected text');
          $log.log(selectedText);
          // Working -- how to check if this is a word or phrase (not just part of one)
        });

        // update source with new data
        // this is currently used for linking source named entities
        scope.$on('update-source', function(e, data) {
          $log.log('update source fired');
          $log.log('event data');
          $log.log(data);

          // iterate over text and add markup to entity ranges, then $compile
          // WORKING -- try the angular-set-text directive
          var text = scope.targetSentence;
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
          $el.html(compiledHTML);

        })


      },
      controller: function($scope) {
        $scope.setSurfaceForms = function(e) {
          var surfaceForm = $(e.target).text();
          $scope.$emit('find-surface-forms', { 'sf': surfaceForm });
        }

        // working -- call a function on the parent (the queryGlossary function passed into this component
        //$scope.askGlossary = function(word) {
        //  $scope.queryGlossary(word);
        //}

      }
    };
}]);

