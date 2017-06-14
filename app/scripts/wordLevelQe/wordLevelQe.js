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

                // WORKING HERE: support underlined divs
                var a = document.createElement("span");

                a.setAttribute('class', 'tooltip-span');
                // a.setAttribute('display', 'inline-block');

                $compile(a)(scope);
                range = sel.getRangeAt(0).cloneRange();
                sel.removeAllRanges();

                // TODO: there will be an error here if user has dragged to highlight instead of clicking a token
                range.surroundContents(a);
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
          // WORKING: remove helper spans, just select the text inside

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

        var updateTargetSegment = function(newValue) {
          var origTargetSegment, newTargetSegment;

          origTargetSegment = scope.targetSegment;
          // make sure the tooltip span is gone
          $el.find('.tooltip-span').remove();
          if (!newValue) {
            newTargetSegment = $el.find('.post-editor').first().text();
            // remove any extra whitespace
            newTargetSegment = newTargetSegment.replace(/\s+/g,' ');
            // remove whitespace at beginning and end
            newTargetSegment = newTargetSegment.replace(/^\s+/,'');
            newTargetSegment = newTargetSegment.replace(/\s+$/,'');

            // push the old value to the undo stack if the user is not undoing something
            scope.state.undoStack.push(scope.targetSegment);
          } else {
            newTargetSegment = newValue;
          }

          scope.targetSegment = newTargetSegment;

          // set the component text to the targetSegment, adding some space so user can move to the beginning or end
          $el.find('.post-editor').first().text('    ' + scope.targetSegment + '    ');
          var posteditorText = '    ' + scope.targetSegment + '    ';
          var re = /\s+|[^\s!@#$%^&*(),.;:'"/?\\]+|[!@#$%^&*(),.;:'"/?\\]/g;
          // var re = '/(\s+)/g';

          // WORKING: we want to underline good/bad tokens

          var allTokens = posteditorText.match(re);
          var posteditorHtml = allTokens.map(function (m) {
            if (/^\s+$/.test(m)) {
                return '<div class="post-editor-whitespace word-level-qe-token">' + m + '</div>';
            } else {
                return '<div class="post-editor-whitespace word-level-qe-token test-underline">' + m + '<div class="qe-bar"></div></div>';
            }
          });
          $el.find('.post-editor').first().html(posteditorHtml);

          // WORKING: randomly assign color in scale to qe-bars
          // bind to each span
          function getRandomColor() {
            var colors = ['red', 'green', 'green', 'green', 'green'];
            var randomColor = colors[Math.floor(Math.random() * 5)];
            return randomColor;
          }

          $el.find('div.qe-bar').css('background-color',
            // function() { $(this).css('background-color','pink'); },
            function() { return getRandomColor(); }
          );

          // select text in span on click
          $el.find('div.post-editor-whitespace').hover(
            function() {
              var origWidth = $(this).width();
              this['origWidth'] = origWidth;
              $(this).css('background-color','#87cefa')
                // .animate({'width': '+=10'}, 200)
            },
            function() {
              $(this).css('background-color', 'transparent')
                // .animate({'width': this['origWidth']}, 200)
            }
          ).click(function (){
            // remove this span
            var range, selection;

            if (window.getSelection && document.createRange) {
              selection = window.getSelection();
              range = document.createRange();
              range.selectNodeContents(this);
              selection.removeAllRanges();
              selection.addRange(range);
            } else if (document.selection && document.body.createTextRange) {
              range = document.body.createTextRange();
              range.moveToElementText(this);
              range.select();
            }
          });

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
             $el.find('.tooltip-span').contents().unwrap();
             if (currentState === 'replacing' || currentState === 'inserting') {
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

        // Working: add ctrl+Z to trigger undo
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
          updateTargetSegment();
        }, 0);

      },
      controller: function($scope) {

      }
    };
}]);

