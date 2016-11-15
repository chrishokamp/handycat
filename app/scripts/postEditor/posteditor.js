angular.module('handycat.posteditors', ['handycatConfig']);

angular.module('handycat.posteditors')
.directive('postEditor', ['$log', 'tokenizer', '$compile', function($log, tokenizer,$compile) {
    // take the text inside the element, tokenize it, and wrap in spans that we can interact with
    return {
      scope: {
        targetSegment: '=',
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

          // delete previous spans we created
          //$el.find('span').contents().unwrap();

          // WORKING: use the range API to replace and move text
          // WORKING: single tooltip directive, move that around as needed and fire events from it
          // WORKING: wrap selected text in span, place directive below that span
          var el = $el.find('.post-editor').first()[0];
          if (window.getSelection) {
            var sel = window.getSelection()
            if (sel.rangeCount) {
              // Get the selected range
              var range = sel.getRangeAt(0);

              // Check that the selection is wholly contained within the div text
              if (range.commonAncestorContainer == el.firstChild) {
                // Create a range that spans the content from the start of the div
                // to the start of the selection
                var precedingRange = document.createRange();
                precedingRange.setStartBefore(el.firstChild);
                precedingRange.setEnd(range.startContainer, range.startOffset);

                // Get the text preceding the selection and do a crude estimate
                // of the number of words by splitting on white space
                var textPrecedingSelection = precedingRange.toString();
                var wordIndex = textPrecedingSelection.split(/\s+/).length;
                //alert("Word index: " + wordIndex);
                console.log("Word index: " + wordIndex);
              }
            }
          }
          if (window.getSelection) {
            var sel = window.getSelection()
            var text = "";
            if (window.getSelection) {
              text = window.getSelection().toString();
            } else if (document.selection && document.selection.type != "Control") {
              text = document.selection.createRange().text;
            }

            if (text.length >= 1) {
              console.log('Selected text: ' + text);
              //var a = document.createElement("posteditor-tooltip");
              var a = document.createElement("span");

              a.setAttribute('class', 'tooltip-span');

              $compile(a)(scope);
              var range = sel.getRangeAt(0).cloneRange();
              sel.removeAllRanges();
              range.surroundContents(a);
              sel.addRange(range);

              // WORKING: we can also send the current range in the broadcast event
              // WORKING: so that the tooltip will know what to move or delete
              // WORKING: tooltip should directly modify the target segment
              // tell the tooltip to move
              scope.$broadcast('position-tooltip');

            }
          }
        }

        // don't allow other tooltips to fire when one is already focused
        $('.source-token').focus(function(e) {
          $(".source-token").not(this).css('pointer-events', "none")
        });
        $('.source-token').focusout(function(e) {
          $(".source-token").css('pointer-events', "auto")
        });

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


        // WORKING: implement insert
        scope.$on('replace-event', function(e) {
          console.log('HEARD REPLACE');
          // clear text and make contenteditable
          $el.find('.tooltip-span').attr('contentEditable',true).text(' ');
          $el.find('.tooltip-span').first().attr('contentEditable',true).focus();
          scope.showTooltip = false;
          // TODO: press escape to drop out of insert mode
          // TODO: set "inserting" state on scope
          scope.state.action = 'replacing';
        });

        var updateTargetSegment = function() {
          var newTargetSegment = $el.find('.post-editor').first().text();
          scope.targetSegment = newTargetSegment;
          $el.find('.post-editor').first().text(scope.targetSegment);
        }


        // keybindings
        //To unbind you can also use a namespace on the event,
         $(document).on('keyup.posteditor_escape', function(e) {
           if (e.which == 27) {
             console.log('ESCAPE WAS PRESSED')
             if (scope.state.action === 'replacing') {
               $el.find('.tooltip-span').contents().unwrap();
               scope.state.action === 'default';
               updateTargetSegment();
             }
           }

         });

        // TODO: unbind when component goes out of focus, rebind when it comes back in
           //...) and $(document).unbind('keyup.unique_name') – Lachlan McD. May 13 '13 at 3:32




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

