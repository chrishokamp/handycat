angular.module('handycat.posteditors', ['handycatConfig']);

angular.module('handycat.posteditors')
.directive('postEditor', ['$log', 'tokenizer', '$compile', function($log, tokenizer,$compile) {
    // take the text inside the element, tokenize it, and wrap in spans that we can interact with
    return {
      scope: {
        targetSegment: '=',
        isActive: '='
      },
      templateUrl: 'scripts/postEditor/posteditor.html',
      restrict: 'E',
      link: function(scope, $el, attrs){

        scope.state = {
          'action': 'default',
          'undoStack': []
        }

        // tokenize the target text
        //var tokenStrings = tokenizer.tokenize(scope.targetSentence);

        // WORKING: implement postEditor component
        // on highlight, show tooltip
        // there are two token types, spaces and text
        // PROBLEM: in the current formulation tokenization is done with respect to character strings
        // IDEA: wrap only _spaces_ in <span></span>, create an on select event which shows menu below selected text

        // Delete: select token, click delete, it disappears
        // Replace: select token, delete it and move to insertion
        // Move: select token, enter "Move" context, click new location or exit "Move" context
        // Insert: user clicks space, cursor is inserted between two spaces, insert span w/ content editable

        // First: show context menu when user highlights something, or clicks on a space

        // note that any html tricks will need to be repeated every time

        var getSelectedText = function() {
          var text = "";
          if (window.getSelection) {
            text = window.getSelection().toString();
          } else if (document.selection && document.selection.type != "Control") {
            text = document.selection.createRange().text;
          }
          return text;
        }

        var addTooltipToSelected = function() {
          var sel, range, text;

          // use the range API to replace and move text
          // single tooltip directive, move that around as needed and fire events from it
          // wrap selected text in span, place directive below that span
          if (window.getSelection) {
            sel = window.getSelection()
            text = "";
            if (window.getSelection) {
              text = window.getSelection().toString();
            } else if (document.selection && document.selection.type != "Control") {
              text = document.selection.createRange().text;
            }
            if (text.length === 0) {
              scope.showTooltip = false;
              return;
            }

            if (text.length >= 1) {
              console.log('Selected text: ' + text);
              //if we're in move mode
              if (scope.state.action === 'moving') {
                var textInSpan = $el.find('.tooltip-span').text();

                range = sel.getRangeAt(0);
                range.deleteContents();
                range.insertNode(document.createTextNode(' ' + textInSpan+ ' '));
                // TODO: logic to insert left or right spaces (or just do this as postprocessing?)
                scope.state.action = 'default';
                updateTargetSegment();

              } else {
                var a = document.createElement("span");

                a.setAttribute('class', 'tooltip-span');

                $compile(a)(scope);
                range = sel.getRangeAt(0).cloneRange();
                sel.removeAllRanges();
                range.surroundContents(a);
                sel.addRange(range);

                // WORKING: we can also send the current range in the broadcast event
                // WORKING: so that the tooltip will know what to move or delete
                // WORKING: tooltip should directly modify the target segment
                // tell the tooltip to move
                scope.showTooltip = true;
                scope.$broadcast('position-tooltip');
              }

            }
          }
        }


        // TODO: this should really be a range
        scope.selectedText = '';
        $el.on('mouseup', function(e) {
          var selectedText = getSelectedText();
          if (selectedText !== scope.selectedText) {
            scope.selectedText = selectedText;
            $log.log('selected text');
            $log.log(selectedText);
            addTooltipToSelected();
          }
        });

        scope.$on('delete-event', function(e) {
          console.log('HEARD DELETE');
          // delete this span, update targetSegment model
          $el.find('.tooltip-span').remove();
          scope.showTooltip = false;
          updateTargetSegment();
        });

        // TODO: add overlay to indicate which mode the component is currently in
        scope.$on('replace-event', function(e) {
          console.log('HEARD REPLACE');
          // clear text and make contenteditable
          $el.find('.tooltip-span').attr('contentEditable',true).text(' ');
          $el.find('.tooltip-span').first().focus();
          scope.showTooltip = false;

          scope.state.action = 'replacing';
        });

        scope.$on('insert-event', function(e) {
          console.log('HEARD INSERT');
          var tooltipElement = $el.find('.tooltip-span').first().attr('contentEditable',true).text('  ').focus()[0];
          //var tooltipElement = $el.find('.tooltip-span').text('  ')[0];
          // now select the new text in the element
          var selection = window.getSelection();
          var range = document.createRange();
          range.selectNodeContents(tooltipElement);
          selection.removeAllRanges();
          selection.addRange(range);

          // create a range and put cursor at second index
          range = document.createRange();
          selection = window.getSelection();
          range.setStart(tooltipElement.childNodes[0], 1);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);

          scope.showTooltip = false;
          scope.state.action = 'inserting';
        });

        // WORKING: implement move
        //if we select while component is in move mode, replace selection with text from our span
        scope.$on('move-event', function(e) {
          console.log('HEARD MOVE');
          // just set move mode, we're waiting for user to select something else
          scope.showTooltip = false;
          scope.state.action = 'moving';
        });

        var updateTargetSegment = function() {
          // make sure the tooltip span is gone
          $el.find('.tooltip-span').remove();
          var newTargetSegment = $el.find('.post-editor').first().text();
          //remove any extra whitespace
          newTargetSegment = newTargetSegment.replace(/\s+/g,' ');
          // TODO postprocess new segments - remove exra spaces etc...
          scope.targetSegment = newTargetSegment;
          $el.find('.post-editor').first().text(scope.targetSegment);
          scope.state.action = 'default';
          scope.$digest();
        }


        // keybindings
         var handleEscape = function(e) {
           var currentState = scope.state.action;
           if (e.which == 27) {
             console.log('ESCAPE WAS PRESSED')
             $el.find('.tooltip-span').contents().unwrap();
             if (currentState === 'replacing' || currentState === 'inserting') {
               updateTargetSegment();
             }
             scope.showTooltip = false;
             scope.state.action === 'default';
             scope.$digest();
           }
         }

        // use a namespace on the event to bind the escape keypress to this element
        scope.$watch(function() {
          return scope.isActive;
        }, function(isActive) {
          if (isActive) {
            $(document).on('keyup.posteditor_escape', handleEscape)
          } else {
            $(document).unbind('keyup.posteditor_escape')
          }
        })


        // TODO: unbind when component goes out of focus, rebind when it comes back in

           //...) and  – Lachlan McD. May 13 '13 at 3:32




        // update source with new data
        // this is currently used for linking source named entities
        //scope.$on('update-source', function(e, data) {
        //  $log.log('update source fired');
        //  $log.log('event data');
        //  $log.log(data);

          // iterate over text and add markup to entity ranges, then $compile
          // WORKING -- try the angular-set-text directive
        //  var text = scope.targetSentence;
        //  var alreadyMarked = [];
        //  angular.forEach(data.entityData, function(resObj) {
        //    var surfaceForm = resObj['@surfaceForm'];
        //    // test
        //    if (!(_.contains(alreadyMarked, surfaceForm))) {
        //      var re = new RegExp('(' + surfaceForm + ')', "g");
        //      text = text.replace(re, '<span style="text-decoration: underline;" ng-click="setSurfaceForms($event);>$1</span>');
        //    }
        //    alreadyMarked.push(surfaceForm);
        //  });
        //  text = '<div>' + text + '</div>';
        //  var compiledHTML = $compile(text)(scope);
        //  $el.html(compiledHTML);
        //
        //})


        // don't allow other tooltips to fire when one is already focused
        //$('.source-token').focus(function(e) {
        //  $(".source-token").not(this).css('pointer-events', "none")
        //});
        //$('.source-token').focusout(function(e) {
        //  $(".source-token").css('pointer-events', "auto")
        //});
      },
      controller: function($scope) {
        //$scope.setSurfaceForms = function(e) {
        //  var surfaceForm = $(e.target).text();
        //  $scope.$emit('find-surface-forms', { 'sf': surfaceForm });
        //}


        // working -- call a function on the parent (the queryGlossary function passed into this component
        $scope.askGlossary = function(word) {
          $scope.queryGlossary(word);
        }

      }
    };
}]);

