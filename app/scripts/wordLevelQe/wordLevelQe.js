angular.module('handycat.wordLevelQe', ['handycatConfig']);

angular.module('handycat.wordLevelQe')
.directive('wordLevelQeEditor', ['$log', 'tokenizer', '$compile', '$timeout',
  function($log, tokenizer, $compile, $timeout) {
    // take the text inside the element, tokenize it, and wrap in spans that we can interact with
    return {
      scope: {
        targetSegment: '=',
        isActive: '=',
        // logAction: '&'
      },
      templateUrl: 'scripts/wordLevelQe/wordLevelQe.html',
      restrict: 'E',
      link: function(scope, $el, attrs) {

        scope.state = {
          'action'   : 'default',
          'undoStack': [scope.targetSegment]
        }

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

          // WORKING: remove all token helper spans when tooltip displays, add them back when it hides
          // var b = document.getElementsByClassName('post-editor-whitespace');
          // while(b.length) {
          //   var parent = b[ 0 ].parentNode;
          //   while( b[ 0 ].firstChild ) {
          //     parent.insertBefore(  b[ 0 ].firstChild, b[ 0 ] );
          //   }
          //   parent.removeChild( b[ 0 ] );
          // }

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
        }

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
            previousSegment = scope.state.undoStack.pop();
            updateTargetSegment(previousSegment);
          }
        }


        // WORKING: we want to map the original segment through QE each time, then at each editing step update annotations as needed
        var updateTargetSegment = function(qeAnnotate, newValue) {
          var origTargetSegment, newTargetSegment;

          origTargetSegment = scope.targetSegment;
          // make sure the tooltip span is gone
          // TODO: make sure any new user spans are newly annotated before removing span
          // TODO: anything inside this span was edited by user
          var userAddedText = $el.find('.tooltip-span').text();
          // reannotate the userAddedText with special user spans
          var newUserTokens = userAddedText.split('');
          var newUserHtml = newUserTokens.map(function (m) {
              if (/^\s+$/.test(m)) {
                  return '<div class="post-editor-whitespace word-level-qe-token">' + m + '</div>';
              } else {
                  return '<div class="post-editor-whitespace word-level-qe-token test-underline">' + m + '<div class="qe-user-bar"></div></div>';
              }
          });
          // add the new annotated user data into the current tooltip span
          $el.find('.tooltip-span').html(newUserHtml);

          // now remove the tooltip span, leaving the contents
          $el.find('.tooltip-span').contents().unwrap();
          $el.find('.tooltip-span').remove();


          if (!newValue) {
            // WORKING: here we need to differentiate the user-provided text from the qe-annotated segments
            // WORKING: ideally, we need to join the annotated left context and the annotated right context
            // IDEA: instead of getting only the text, get each of the _elements_ -- qe tags should be attributes
            // IDEA: on the elements -- simplest way is jquery with data-* attributes

            // newTargetSegment = $el.find('.post-editor').first().text();
            newTargetSegment = $el.find('.post-editor').first().html();

            // remove any extra whitespace
            // newTargetSegment = newTargetSegment.replace(/\s+/g,' ');

            // remove whitespace at beginning and end
            // newTargetSegment = newTargetSegment.replace(/^\s+/,'');
            // newTargetSegment = newTargetSegment.replace(/\s+$/,'');

            // push the old value to the undo stack if the user is not undoing something
            scope.state.undoStack.push(scope.targetSegment);
          } else {
            newTargetSegment = newValue;
          }

          scope.targetSegment = newTargetSegment;

          if (qeAnnotate === true) {
            // The "reannotation" should only happen on the first call
            var posteditorText = '    ' + scope.targetSegment + '    ';
            // var re = /\s+|[^\s!@#$%^&*(),.;:'"/?\\]+|[!@#$%^&*(),.;:'"/?\\]/g;

            // IDEA: split on characters
            // var re = /\s+|[^\s!@#$%^&*(),.;:'"/?\\]+|[!@#$%^&*(),.;:'"/?\\]/g;

            // WORKING: we want to underline good/bad tokens
            // WORKING: we need a data model that can add, remove, and update span annotations
            // WORKING: IDEA: annotations are stored in the DOM, mapped to each token
            // var allTokens = posteditorText.match(re);

            // IDEA: split on characters
            var allTokens = posteditorText.split('');
            var posteditorHtml = allTokens.map(function (m) {
                if (/^\s+$/.test(m)) {
                    return '<div class="post-editor-whitespace word-level-qe-token">' + m + '</div>';
                } else {
                    return '<div class="post-editor-whitespace word-level-qe-token test-underline">' + m + '<div class="qe-bar"></div></div>';
                }
            });
            $el.find('.post-editor').first().html(posteditorHtml);
            // just add raw text
            // $el.find('.post-editor').first().text(posteditorText);
          }

          // set the component text to the targetSegment, adding some space so user can easily move to the beginning or end
          // $el.find('.post-editor').first().text('    ' + scope.targetSegment + '    ');


          // WORKING: randomly assign color in scale to qe-bars
          // bind to each span
          function getRandomColor() {
            var colors = ['red', 'green', 'green', 'green', 'green'];
            var randomColor = colors[Math.floor(Math.random() * 5)];
            return randomColor;
          }

          // random color
          // WORKING: change getRandomColor to a function which calls configurable QE backend microservice
          // WORKING: the QE can actually be hard-coded, we don't need dynamic access because user edits are automatically "OK"
          $el.find('div.qe-bar').css('background-color',
            function() { return getRandomColor(); }
          );
          // random opacity
          $el.find('div.qe-bar').css('opacity',
            function() { return Math.random(); }
          );

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

          return [origTargetSegment, newTargetSegment]
        }

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
        }

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
        })

        $timeout(function() {
          updateTargetSegment(true);
        }, 0);

      },
      controller: function($scope) {

      }
    };
}]);

