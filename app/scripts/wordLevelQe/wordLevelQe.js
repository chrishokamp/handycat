angular.module('handycat.wordLevelQe', ['handycatConfig']);

// WORKING: inject widgetConfiguration service
angular.module('handycat.wordLevelQe')
.directive('wordLevelQeEditor', ['widgetConfiguration', 'constrainedDecodingUrl', '$log',
                                 'tokenizer', '$compile', '$timeout', '$http',
  function(widgetConfiguration, constrainedDecodingUrl, $log, tokenizer, $compile, $timeout, $http) {
    // take the text inside the element, tokenize it, and wrap in spans that we can interact with
    return {
      scope: {
        sourceSegment: '=',
        targetSegment: '=',
        targetLang: '@',
        sourceLang: '@',
        isActive: '=',
        // logAction: '&'
      },
      templateUrl: 'scripts/wordLevelQe/wordLevelQe.html',
      restrict: 'E',
      link: function(scope, $el, attrs) {

        scope.state = {
          'action'   : 'default',
          'undoStack': []
        }
        // the syntax below makes sure we always make a deep copy
        scope.localTargetSegment = (' ' + scope.targetSegment).slice(1);

        var getSelectedText = function () {
          var text = "";
          if (window.getSelection) {
            text = window.getSelection().toString();
          } else if (document.selection && document.selection.type != "Control") {
            text = document.selection.createRange().text;
          }
          return text;
        }

        var addTooltipToSelected = function () {
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
                range.insertNode(document.createTextNode(' ' + textInSpan + ' '));
                scope.state.action = 'default';

                var oldNewTarget = updateTargetSegment();
                var origTarget = oldNewTarget[0];
                var newTarget = oldNewTarget[1];
                // log this action
                // scope.logAction(
                //   {
                //     action: 'postEditor.move',
                //     data  : {
                //       'originalTarget': origTarget,
                //       'newTarget'     : newTarget
                //     }
                //   }
                // );

              } else {
                range = sel.getRangeAt(0).cloneRange();
                sel.removeAllRanges();

                var a = document.createElement("div");
                a.setAttribute('class', 'tooltip-span');
                a.appendChild(range.extractContents())
                $compile(a)(scope);

                // var $newEl = $('.tooltip-span');
                // $newEl.html(range.extractContents());
                // range.surroundContents(a);

                range.insertNode(a);
                sel.addRange(range);

                // Note: we could also send the current range in the broadcast event
                // tell the tooltip to move
                scope.showTooltip = true;
                scope.$broadcast('position-tooltip');
              }

            }
          }
        };

        scope.selectedText = '';
        $el.on('mouseup', function (e) {
          console.log('mouseup');
          $timeout(function() {
          var selectedText = getSelectedText();
          // if (selectedText !== scope.selectedText) {
            scope.selectedText = selectedText;
            $log.log('selected text');
            $log.log(selectedText);
            addTooltipToSelected();
          },0);
          // }
        });

        scope.$on('delete-event', function (e) {
          // delete this span, update targetSegment model
          $el.find('.tooltip-span').remove();
          scope.showTooltip = false;
          var oldNewTarget = updateTargetSegment();
          var origTarget = oldNewTarget[0];
          var newTarget = oldNewTarget[1];
          // log this action
          // scope.logAction(
          //   {
          //     action: 'postEditor.delete',
          //     data  : {
          //       'originalTarget': origTarget,
          //       'newTarget'     : newTarget
          //     }
          //   }
          // );
        });

        scope.$on('replace-event', function (e) {
          console.log('HEARD REPLACE');
          // clear text and make contenteditable
          $el.find('.tooltip-span').attr('contentEditable', true);
          $el.find('.tooltip-span').first().focus();
          scope.showTooltip = false;

          scope.state.action = 'replacing';
        });

        scope.$on('insert-event', function (e) {
          console.log('HEARD INSERT');
          var tooltipElement = $el.find('.tooltip-span').first().attr('contentEditable', true).text('  ').focus()[0];
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

        //if we select while component is in move mode, replace selection with text from our span
        scope.$on('move-event', function (e) {
          console.log('HEARD MOVE');
          // just set move mode, we're waiting for user to select something else
          scope.showTooltip = false;
          scope.state.action = 'moving';
        });

        scope.$on('undo-change', function() {
          console.log('Heard UNDO');
          resetTargetSegment();
        });

        scope.$on('clear-editor', function() {
          updateTargetSegment('Modify this text to translate...');
        });

        // called when user clicks undo
        var resetTargetSegment = function() {
          var previousSegment;
          if (scope.state.undoStack.length > 0) {
            // console.log('Undo stack: ' + scope.state.undoStack);
            previousSegment = scope.state.undoStack.pop();
            // console.log('previous segment: ' + previousSegment);
            updateTargetSegment(false, previousSegment);
          }
        };

        // WORKING: we want to map the original segment through QE each time, then at each editing step update annotations as needed
        var updateTargetSegment = function(qeAnnotate, newValue) {

          // handling the undo stack
          var origTargetSegment, newTargetSegment;
          origTargetSegment = scope.localTargetSegment;

          if (scope.state.undoStack.length > 0 && !newValue) {
              // push the old value to the undo stack if the user is not undoing something
              scope.state.undoStack.push(origTargetSegment);
          } else {
            // if the undoStack is empty, add the first annotated representation, if it exists
            if (scope.state.undoStack.length === 0 && scope.hasOwnProperty('firstTargetSegment')) {
              console.log('Pushing: ' + scope.firstTargetSegment);
              scope.state.undoStack.push(scope.firstTargetSegment);
            }
          }

          // handling new content inserted by user
          var userAddedText = $el.find('.tooltip-span').text();

          // reannotate the userAddedText with special user spans, all other spans retain their original annotations
          var newUserTokens = userAddedText.split('');
          var newUserHtml = newUserTokens.map(function (m) {
              if (/^\s+$/.test(m)) {
                  return '<div class="post-editor-whitespace word-level-qe-token" data-qelabel="user">' + m + '</div>';
              } else {
                  return '<div class="post-editor-whitespace word-level-qe-token" data-qelabel="user">' + m + '<div class="qe-bar-user"></div></div>';
              }
          }).join('');
          // add the new annotated user data into the current tooltip span
          $el.find('.tooltip-span').html(newUserHtml);

          // now remove the tooltip span, leaving the contents
          $el.find('.tooltip-span').contents().unwrap();
          $el.find('.tooltip-span').remove();

          if (newValue) {
            // Note: here we need to differentiate the user-provided text constraints from the qe-annotated segments
            // IDEA: instead of getting only the text, get each of the _elements_ -- qe tags should be attributes
            // IDEA: on the elements -- simplest way is jquery with data-* attributes
            newTargetSegment = newValue;
            scope.localTargetSegment = newTargetSegment;
            $el.find('.post-editor').first().html(newTargetSegment);
          } else {
            newTargetSegment = $el.find('.post-editor').first().html();
          }

          if (qeAnnotate === true) {
            // The "reannotation" should only happen on the first call
            newTargetSegment = scope.localTargetSegment;
            var posteditorText = '    ' + scope.localTargetSegment + '    ';
            // var re = /\s+|[^\s!@#$%^&*(),.;:'"/?\\]+|[!@#$%^&*(),.;:'"/?\\]/g;

            // IDEA: split on characters
            // var re = /\s+|[^\s!@#$%^&*(),.;:'"/?\\]+|[!@#$%^&*(),.;:'"/?\\]/g;

            // WORKING: we need a data model that can add, remove, and update span annotations
            // WORKING: IDEA: annotations are stored in the DOM via data-* attributes, mapped to each token
            // var allTokens = posteditorText.match(re);

            // IDEA: split on characters
            var allTokens = posteditorText.split('');

            var prevClass = undefined;
            var qeClasses = ["qe-bar-good", "qe-bar-good", "qe-bar-good", "qe-bar-good", "qe-bar-bad"];
            var posteditorHtml = allTokens.map(function (m, idx, arr) {

                if (/^\s+$/.test(m)) {
                    return '<div class="post-editor-whitespace word-level-qe-token">' + m + '</div>';
                } else {
                    // check if we're continuing a word
                    if (idx === 0 || /^\s+$/.test(arr[idx-1])) {
                        // we're starting a new class, select a new random label
                        prevClass = qeClasses[Math.floor(Math.random() * qeClasses.length)];
                    }
                    return '<div class="post-editor-whitespace word-level-qe-token">' + m + '<div class="' + prevClass + '"></div></div>';
                }
            }).join('');

            $el.find('.post-editor').first().html(posteditorHtml);

            scope.localTargetSegment = posteditorHtml;

            // the annotation is expected to occur only once -- the first time this function is called
            // thus we always push to the undo stack when annotate happens
            if (scope.state.undoStack.length === 0) {
              scope.firstTargetSegment = posteditorHtml;
              // console.log('pushing: ' + scope.firstTargetSegment);
              scope.state.undoStack.push(scope.firstTargetSegment);
            }
          } else {
            scope.localTargetSegment = newTargetSegment;
          }

          // Note: this method requires us to call color annotation every time, otherwise colors will disappear when we replace element HTML
          // placeholder for calling the annotation function, which returns span annotations of the input text
          // random color
          // WORKING: change getRandomColor to a function which calls configurable QE backend microservice
          // WORKING: the QE can actually be hard-coded, we don't need dynamic access because user edits are automatically "OK"

          // $el.find('div.qe-bar').css('background-color',
          //     function() { return getRandomColor(); }
          // );
          // random opacity -- Note these classes are at the character level, so we need a smarter solution
          // $el.find('div.qe-bar-good').css('opacity',
          //     function() { return Math.random(); }
          // );
          // $el.find('div.qe-bar-bad').css('opacity',
          //     function() { return Math.random(); }
          // );

          // randomly assign color in scale to qe-bars
          function getRandomColor() {
            var colors = ['red', 'green', 'green', 'green', 'green'];
            var randomColor = colors[Math.floor(Math.random() * 5)];
            return randomColor;
          }

          // automatically select text in .post-editor-whitespace spans on click
          // $el.find('div.post-editor-whitespace').hover(
          //   function() {
          //     var origWidth = $(this).width();
          //     this['origWidth'] = origWidth;
          //     $(this).css('background-color','#87cefa')
          //       // .animate({'width': '+=10'}, 200)
          //   },
          //   function() {
          //     $(this).css('background-color', 'transparent')
          //       // .animate({'width': this['origWidth']}, 200)
          //   }
          // ).click(function (){
          //   // remove this span
          //   var range, selection;
          //
          //   // the if/else here are for different browsers
          //   // WORKING: support CTRL+click to expand selection, and ESC to remove it
          //   // WORKING: for now, user needs to drag to select a span, disable auto-selection
          //   if (window.getSelection && document.createRange) {
          //     selection = window.getSelection();
          //     range = document.createRange();
          //     range.selectNodeContents(this);
          //     selection.removeAllRanges();
          //     selection.addRange(range);
          //   } else if (document.selection && document.body.createTextRange) {
          //     range = document.body.createTextRange();
          //     range.moveToElementText(this);
          //     range.select();
          //   }
          // });

          $timeout(
            function() {
              scope.state.action = 'default';
            },0)

          // Updating the target segment data model for the actual document model (i.e. removing the markup associated with this component)
          // remove any extra whitespace
          var currentText = $el.find('.post-editor').first().text();
          currentText = currentText.replace(/\s+/g,' ');

          // remove whitespace at beginning and end
          currentText = currentText.replace(/^\s+/,'');
          currentText = currentText.replace(/\s+$/,'');

          // finally set the targetSegment to just the current string representation of the component
          scope.targetSegment = currentText;

          return [origTargetSegment, newTargetSegment]
        };

        // keybindings
         var handleEscape = function(e) {
           var currentState = scope.state.action;
           if (e.which == 27) {
             console.log('ESCAPE WAS PRESSED')
             if (currentState === 'replacing' || currentState === 'inserting') {
               // this is the call which updates the new UI state
               var oldNewTarget = updateTargetSegment();
               var origTarget = oldNewTarget[0];
               var newTarget = oldNewTarget[1];
               // log this action
               var action = currentState === 'replacing' ? 'replace' : 'insert';
               // scope.logAction(
               //   {
               //     action: 'postEditor.' + action,
               //     data  : {
               //       'originalTarget': origTarget,
               //       'newTarget'     : newTarget
               //     }
               //   }
               // );
             } else {
               $el.find('.tooltip-span').contents().unwrap();
             }
             scope.showTooltip = false;
             scope.state.action === 'default';
             scope.$digest();

             // TESTING CONSTRAINED DECODING
             console.log('Querying constrained decoding');
             queryConstrainedDecoding();
           }
         }

        var handleUndo = function(e) {
          if (e.keyCode == 90 && e.ctrlKey) {
            console.log('Ctrl-Z');
            resetTargetSegment();
          }
          scope.showTooltip = false;
          scope.state.action === 'default';
          scope.$digest();
        };

        // use a namespace on the event to bind the escape keypress to this element
        // unbind when component goes out of focus, rebind when it comes back in
        scope.$watch(function() {
          return scope.isActive;
        }, function(isActive) {
          if (isActive) {
            $(document).on('keyup.posteditor_escape', handleEscape)
            $(document).on('keyup.posteditor_undo', handleUndo)
          } else {
            $(document).unbind('keyup.posteditor_escape')
            $(document).unbind('keyup.posteditor_undo')
          }
        });

        $timeout(function() {
          updateTargetSegment(true);
        }, 0);

        // query the constrained decoder, ask for a translation, once the request resolves, update the UI
        // TODO: manage callback of this function
        var queryConstrainedDecoding = function () {
          // take the current input representation, including any user constraints, and use it to query the constrained decoder
          // get the text from the user-added constraints from the current local segment
          var currentTokenElements = $el.find('.word-level-qe-token');

          // iterate through elements in localSegment, starting constraints when a new `data-qe-label="user"` is found
          // we don't need the string indices of the constraints, just the constraints themselves since, in general, they may be rearranged by the MT engine
          var allUserConstraints = [];
          var currentUserConstraint = [];
          var prevTokenWasConstraint = false;
          currentTokenElements.each(function(index, element) {
            $thisEl = $(element);
            if ($thisEl.attr('data-qelabel') == 'user') {
              if (!prevTokenWasConstraint) {
                currentUserConstraint = [$thisEl.text()];
                prevTokenWasConstraint = true;
              } else {
                currentUserConstraint.push($thisEl.text());
              }
            } else {
              if (prevTokenWasConstraint) {
                // push the finished constraint, use .slice() to clone it
                allUserConstraints.push(currentUserConstraint.slice());
                currentUserConstraint = [];
                prevTokenWasConstraint = false;
              }
            }
          });
          // finally if the last token was part of a constraint
          if (currentUserConstraint.length > 0) {
            allUserConstraints.push(currentUserConstraint)
          }

          // concat the tokens in each constraint together, and trim whitespace at the beginning and end
          allUserConstraints = allUserConstraints.map(function (currentValue, idx, arr) {
            return currentValue.join('').trim();
          });

          // Now we're ready to ask the server for a lexically constrained translation
          // set the timestamp for the current request
          var reqTimestamp = Date.now();
          $http.get(constrainedDecodingUrl,
            {
              params: {
                source_segment: scope.sourceSegment,
                target_constraints   : allUserConstraints,
                target_lang   : scope.targetLang,
                source_lang   : scope.sourceLang,
                request_time  : reqTimestamp
              }
            }
          )
          .success(
            function (output) {
              var translationObjs = output['outputs'];
              console.log('Translation system outputs:')
              console.log(translationObjs)
              // TODO: now render output in the component
            }
          );
          // TODO: handle failure and timeout

        }

      },
      controller: function($scope) {

      }
    };
}]);

