angular.module('handycat.wordLevelQe', ['handycatConfig']);

// WORKING: inject widgetConfiguration service
angular.module('handycat.wordLevelQe')
.directive('wordLevelQeEditor', ['widgetConfiguration', 'constrainedDecodingUrl', 'apeQeUrl', '$log',
                                 'tokenizer', '$compile', '$timeout', '$http', '$q',
  function(widgetConfiguration, constrainedDecodingUrl, apeQeUrl, $log, tokenizer, $compile, $timeout, $http, $q) {
    // take the text inside the element, tokenize it, and wrap in spans that we can interact with
    return {
      scope: {
        sourceSegment: '=',
        targetSegment: '=',
        targetLang: '@',
        sourceLang: '@',
        // qeAnnotation: '=',
        // constrainedDecoding: '=',
        isActive: '=',
        // logAction: '&'
      },
      templateUrl: 'scripts/wordLevelQe/wordLevelQe.html',
      restrict: 'E',
      link: function(scope, $el, attrs) {

          // TODO: implement qeAnnotation mode and constrainedDecoding mode in config
          // TODO: server caches inputs on disk -- for our experiments, the first QE query is always the same
          scope.constrainedDecoding = true;
          scope.qeAnnotation = true;

          scope.state = {
              'action': 'default',
              'translationPending': false,
              'qePending': false,
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
                      // console.log('Selected text: ' + text);
                      //if we're in move mode
                      if (scope.state.action === 'moving') {
                          var textInSpan = $el.find('.tooltip-span').text();

                          range = sel.getRangeAt(0);
                          range.deleteContents();
                          range.insertNode(document.createTextNode(' ' + textInSpan + ' '));
                          scope.state.action = 'default';

                          updateTargetSegment('insert');
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
                          // debugging: this removes a class from the output
                          // WARNING: `modify` is a non-standard function
                          // sel.modify('extend', 'forward', 'character');
                          // sel.modify('extend', 'backward', 'character');
                          range = sel.getRangeAt(0).cloneRange();
                          sel.removeAllRanges();

                          // logic which creates the tooltip span
                          // var a = document.createElement("div");
                          var a = document.createElement("span");
                          a.appendChild(range.extractContents())
                          var justText = a.innerText;
                          // justText = justText;
                          // recreate the element, but just with text (no HTML markup inside the span)
                          a = document.createElement("span");
                          a.setAttribute('class', 'tooltip-span');
                          // set its text
                          var txt = document.createTextNode(justText);
                          a.innerText = txt.textContent;
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
          var isHighlight = 0;
          var mouseDown = 0;
          $el.mousedown(function () {
              mouseDown = 1;
          }).mousemove(function () {
              if (mouseDown == 1) {
                  isHighlight = 1;
              }
          }).on('mouseup', function (e) {
              console.log('mouseup');

              $timeout(function () {
                  if (isHighlight == 1) {
                      // var selectedText = getSelectedText();
                      // scope.selectedText = selectedText;
                      // $log.log('selected text');
                      // $log.log(selectedText);
                      // $log.log('isHighlight: ' + isHighlight);
                      addTooltipToSelected();
                  }

                  isHighlight = 0;
                  mouseDown = 0;
              }, 0);
              // }
          });

          // this event comes from parent scope, user wants to do GBS
          scope.$on('request-new-translation', function (e) {
              console.log('heard request-new-translation');
              $timeout(function () {
                var currentAnnotationMap = getCurrentAnnotationMap();
                // console.log(currentAnnotationMap);

                // this Async block updates the UI with the results of the configured services
                // WORKING: GBS only happens when user asks for it, expose GBS on scope
                // WORKING: if GBS+QE in configuration, GBS manager calls QE after finishing, otherwise GBS output renders directly
                var gbsPromise = queryConstrainedDecoding(currentAnnotationMap);
                gbsPromise.then(function (newAnnotationMap) {
                    // Note: here we pass the representation via the UI state, this is wasteful
                    renderAnnotations(newAnnotationMap);
                    updateTargetSegment();
                }, function(reason) {
                   // error
                }, function(update) {
                   // update
                });
                  // GBS Promise resolves with annotation map
                  // Note: GBS overwrites the annotation map, QE modifies it
              }, 0);
          });

          scope.$on('delete-event', function (e) {
              // delete this span, update targetSegment model
              $el.find('.tooltip-span').remove();
              scope.showTooltip = false;
              updateTargetSegment();

              // var oldNewTarget = updateTargetSegment();
              // var origTarget = oldNewTarget[0];
              // var newTarget = oldNewTarget[1];

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
              var $tooltipSpan = $el.find('.tooltip-span');
              var currentText = $tooltipSpan.text();
              $tooltipSpan.attr('contentEditable', true).text(currentText);

              $tooltipSpan.focus();
              scope.showTooltip = false;

              scope.state.action = 'replacing';
          });

          // This event just adds the currenty highlighted text as a constraint
          scope.$on('confirm-event', function (e) {
              console.log('HEARD CONFIRM');
              // clear text and make contenteditable
              var $tooltipSpan = $el.find('.tooltip-span');
              var currentText = $tooltipSpan.text();
              $tooltipSpan.text(currentText);
              updateTargetSegment();
              scope.showTooltip = false;
          });

          scope.$on('insert-event', function (e) {
              console.log('HEARD INSERT');
              var tooltipElement = $el.find('.tooltip-span').attr('contentEditable', true).text('  ').focus()[0];
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

          scope.$on('undo-change', function () {
              console.log('Heard UNDO');
              resetTargetSegment();
          });

          scope.$on('clear-editor', function () {
              console.error('Not Implemented');
          });

          // called when user clicks undo
          var resetTargetSegment = function () {
              var previousState;
              if (scope.state.undoStack.length > 0) {
                  previousState = scope.state.undoStack.pop();
                  renderAnnotations(previousState);
              }
          };

          // keybindings
          var handleEscape = function (e) {
              var currentState = scope.state.action;
              if (e.which == 27) {
                  console.log('ESCAPE WAS PRESSED')
                  if (currentState === 'replacing' || currentState === 'inserting') {
                      // this is the call which updates the new UI state
                      // IDEA: don't do this unless user actually changed something
                      updateTargetSegment('insert');
                      // var oldNewTarget = updateTargetSegment();
                      // var origTarget = oldNewTarget[0];
                      // var newTarget = oldNewTarget[1];

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
                      // render the UI
                      // $el.find('.tooltip-span').contents().unwrap();
                      // $el.find('.tooltip-span').remove();
                      // put the UI back in the state before the highlight event
                      renderAnnotations(scope.previousState);
                  }
                  scope.showTooltip = false;
                  scope.state.action === 'default';
                  scope.$digest();

              }
          };

          var handleUndo = function (e) {
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
          scope.$watch(function () {
              return scope.isActive;
          }, function (isActive) {
              if (isActive) {
                  $(document).on('keyup.posteditor_escape', handleEscape)
                  $(document).on('keyup.posteditor_undo', handleUndo)
              } else {
                  $(document).unbind('keyup.posteditor_escape')
                  $(document).unbind('keyup.posteditor_undo')
              }
          });


          var getCurrentAnnotationMap = function (mode) {

            // take the current input representation, including any user constraints, and use it to query the constrained decoder
            // get the text from the user-added constraints from the current local segment

            // TODO: this shouldn't be required, there is a bug somewhere
            if(mode === 'insert') {
                $el.find('.tooltip-span').remove();
                // $digest or $apply
                scope.$digest();
                var currentTokenElements = $el.find('.word-level-qe-token');
            }

            // TODO: BUG -- there can be tags that wrap other tags -- fix this
            var currentTokenElements = $el.find('.word-level-qe-token').filter(function (index, element) {
                return !($(element).find('span.word-level-qe-token').length)
            });

            // we need the span indices of user constraints [(start, end), (start, end), ...]
            // iterate through elements in localSegment, starting constraints when a new `data-qe-label="user"` is found
            // constraints may be rearranged by the MT engine
            // Note we also need to normalize whitespace along the way -- consecutive whitespace isn't allowed

            var allUserConstraints = [];
            var currentUserConstraint = [];
            var userConstraintSpans = [];
            var currentConstraintSpan = [];
            var prevTokenWasConstraint = false;
            var currentSurfaceRepresentation = '';
            console.log('Getting user constraint idxs');

            var whiteSpaceOffset = 0;
            var sawText = false;
            var previousChar = '';
            var currentChar = '';
            currentTokenElements.each(function (index, element) {
                var $thisEl = $(element);
                // console.log('EL: ' + $thisEl);
                // console.log('Text: ' + $thisEl.text());
                if ($thisEl.text().length > 0) {
                    // hack: this is an actual character
                    previousChar = currentChar;
                    currentChar = $thisEl.text();
                } else {
                  // this is a 0 length character
                }
                // console.log('previousChar :' + previousChar);
                // console.log('currentChar: ' + currentChar);

                // TODO: use spans in constrained decoding, don't duplicate logic
                var consecutiveWhitespace = false;
                if (/^\s+$/.test(currentChar)) {
                    if (sawText && /^\s+$/.test(previousChar)) {
                        // consecutive whitespace, we won't use this character
                        consecutiveWhitespace = true;
                    } else {
                        consecutiveWhitespace = false;
                    }
                } else {
                    if (previousChar.length != 0) {
                      sawText = true;
                    }
                    consecutiveWhitespace = false;
                }

                // console.log('currentChar: ' + currentChar + ' len: ' + currentChar.length);
                // console.log('previousChar: ' + previousChar + ' len: ' + previousChar.length);
                if (!consecutiveWhitespace) {
                  // console.log('YES')
                  // we use $thisEl.text() instead of currentChar because there can be elements with no text
                  currentSurfaceRepresentation = currentSurfaceRepresentation + $thisEl.text();
                } else {
                  // console.log('NO')
                }
                // console.log('REP: ' + currentSurfaceRepresentation);

                // currentSurfaceRepresentation = currentSurfaceRepresentation + $thisEl.text();

                // TODO: this is a hack, it's not clear why there can be token elements which contain no text
                var idxOffset = (currentSurfaceRepresentation.length - 1) - index;
                // console.log('len Rep: ' + currentSurfaceRepresentation.length);
                if ($thisEl.attr('data-qelabel') == 'user' && !consecutiveWhitespace) {
                    if (!prevTokenWasConstraint) {
                        // starting
                        // console.log('starting');
                        currentConstraintSpan.push(index + idxOffset);
                        currentUserConstraint = [$thisEl.text()];
                        prevTokenWasConstraint = true;
                    } else {
                        // continuing
                        // console.log('continuing');
                        currentUserConstraint.push($thisEl.text());
                    }
                } else {
                    if (prevTokenWasConstraint) {
                        // finishing
                        // console.log('finishing');
                        // if we're finishing, add 1
                        // TODO: there is an off by one bug here somewhere
                        currentConstraintSpan.push(index + idxOffset);
                        // currentConstraintSpan.push(index + idxOffset + 1);

                        userConstraintSpans.push(currentConstraintSpan);
                        currentConstraintSpan = [];
                        // push the finished constraint, use .slice() to clone it
                        allUserConstraints.push(currentUserConstraint.slice());
                        currentUserConstraint = [];
                        prevTokenWasConstraint = false;
                    }
                }
                // console.log("Index: " + index);
            });
            // finally if the last token was part of a constraint
            if (currentUserConstraint.length > 0) {
                // TODO: confirm offset logic, we don't hit this code because there's always whitespace at the end
                var idxOffset = (currentSurfaceRepresentation.length - 1) - currentTokenElements.length;
                currentConstraintSpan.push(currentTokenElements.length + idxOffset);
                userConstraintSpans.push(currentConstraintSpan)
                allUserConstraints.push(currentUserConstraint)
            }

            // concat the tokens in each constraint together, and trim whitespace at the beginning and end
            allUserConstraints = allUserConstraints.map(function (currentValue, idx, arr) {
                return currentValue.join('').trim();
            });

            // now expand any partial constraints that aren't whole tokens
            var expandedUserConstraints = [];
            userConstraintSpans.forEach(function (span) {
                var spanStart = span[0];
                var spanEnd = span[1];

                // expand left
                while (spanStart > 0 && !/^\s+$/.test(currentSurfaceRepresentation.charAt(spanStart - 1))) {
                    spanStart = spanStart - 1;
                }
                // expand right
                while (spanEnd < currentSurfaceRepresentation.length && !/^\s+$/.test(currentSurfaceRepresentation.charAt(spanEnd))) {
                    spanEnd = spanEnd + 1;
                }
                expandedUserConstraints.push([spanStart, spanEnd]);
            });

            var currentAnnotations = {};
            // now overwrite with user constraint annotations
            expandedUserConstraints.forEach(function (span, idx) {
                for (var i = span[0]; i < span[1]; i++) {
                    currentAnnotations[i] = {'tag': 'USER', 'confidence': 1.}
                }
                // console.log('constraint at: ' + span);
                console.log(currentSurfaceRepresentation.slice(span[0], span[1]))
            });

            // just make sure there's a bit of helper whitespace at the end of the surface representation
            currentSurfaceRepresentation = currentSurfaceRepresentation.replace(/\s+$/, '');
            currentSurfaceRepresentation = currentSurfaceRepresentation + '   ';

            return {
                'text': currentSurfaceRepresentation,
                'annotations': currentAnnotations,
                'spans': expandedUserConstraints
            };
          };

          // query the constrained decoder, ask for a translation, once the request resolves, update the UI
          var queryConstrainedDecoding = function (currentAnnotationObj) {
              var deferred = $q.defer();

              // return annotationObj immediately if constrained decoding is not enabled
              if (!scope.constrainedDecoding) {
                deferred.resolve(currentAnnotationObj);
                return deferred.promise;
              }

              var surfaceRepresentation = currentAnnotationObj['text'];
              var allUserConstraints = [];
              currentAnnotationObj['spans'].forEach(function (span, idx) {
                  allUserConstraints.push(surfaceRepresentation.slice(span[0], span[1]))
              });

              // concat the tokens in each constraint together, and trim whitespace at the beginning and end
              allUserConstraints = allUserConstraints.map(function (currentValue, idx, arr) {
                  return currentValue.trim();
              });

              // Now we're ready to ask the server for a lexically constrained translation
              // UI state changes while we're waiting for a translation
              // TODO: pulse colors when translation arrives

              scope.state.action = 'translating';
              scope.state.translationPending = true;
              // set the timestamp for the current request
              var reqTimestamp = Date.now();
              $http.post(constrainedDecodingUrl,
                  {
                      source_segment: scope.sourceSegment,
                      target_constraints: allUserConstraints,
                      // target_lang   : scope.targetLang,
                      target_lang: 'de',
                      source_lang: scope.sourceLang,
                      request_time: reqTimestamp
                  }
                  // {headers: {'Content-Type': 'application/json'}
              )
              .success(
                  function (output) {
                      // working: change this logic for render interface
                      var translationObjs = output['outputs'];
                      // we only care about the 1-best translation
                      var outputObj = translationObjs[0];
                      var outputTranslation = outputObj['translation'];
                      var constraintAnnotations = outputObj['constraint_annotations'];

                      var annotationMap = {}
                      constraintAnnotations.forEach(function (span) {
                          for (var i = span[0]; i < span[1]; i++) {
                            annotationMap[i] = {'tag': 'USER', 'confidence': 1.}
                          }
                      });

                      // create new annotation obj
                      var annotationObj = {
                          'text': outputTranslation,
                          'annotations': annotationMap,
                          'spans': constraintAnnotations
                      }

                      deferred.resolve(annotationObj);

                      scope.state.translationPending = false;
                      scope.state.action = 'default';
                  }
              ).error(function () {
                  scope.state.translationPending = false;
                  scope.state.action = 'default';
                  // TODO: handle error (reject deferred)
              });

              // TODO: handle failure and timeout
            return deferred.promise;

          };

          // query the constrained decoder, ask for a translation, once the request resolves, update the UI
          var queryApeQe = function (currentAnnotationObj) {
              var deferred = $q.defer();

              // return annotationObj immediately if constrained decoding is not enabled
              if (!scope.qeAnnotation) {
                  deferred.resolve(currentAnnotationObj);
                  return deferred.promise;
              }

              // Now we're ready to ask the server for Quality Estimation span annotations
              // remember that the surface string isn't going to change, and user constraints are going to stay, overriding anything we get back
              // UI state changes while we're waiting for QE?

              // TODO: pulse colors when QE arrives
              // Note: what we send to the server should be _exactly_ the surface representation in the UI
              // Note: except for the whitespace at the beginning and end
              // Note: when we get the QE annotations back, we offset them by the whitespaces at beginning and end
              // console.log(currentAnnotationObj);
              var currentSurfaceRepresentation = currentAnnotationObj['text'];
              var numStartWhitespaceChars = 0;
              if (/^\s+/.test(currentSurfaceRepresentation)) {
                  numStartWhitespaceChars = currentSurfaceRepresentation.match(/^\s+/)[0].length;
              }
              var qeInputString = currentSurfaceRepresentation.trim();

              // set the timestamp for the current request
              var reqTimestamp = Date.now();
              if (!scope.state.qePending) {
                  scope.state.qePending = true;
                  scope.state.action = 'estimating quality';

                $http.post(apeQeUrl,
                    {
                        src_lang: 'en',
                        trg_lang: 'de',
                        src_segment: scope.sourceSegment,
                        trg_segment: qeInputString
                    },
                    {headers: {'Content-Type': 'application/json'}}
                )
                // "qe_labels": [
                //     {
                //         "confidence": 1,
                //         "span": [
                //             0,
                //             6
                //         ],
                //         "tag": "OK"
                //     },
                .success(
                    function (output) {
                        var qeSpanAnnotations = output['qe_labels'];

                        // TODO: use the leading whitespace offset on the qe annotations

                        // first go through qe annotations from server
                        // console.log('QE output: ');
                        // TODO: deep copy annotation obj, and modify that

                        var currentAnnotations = {};
                        var offsetAnnotations = []
                        qeSpanAnnotations.forEach(function (obj, idx) {

                            // use the leading whitespace offset on the qe annotations
                            var span = obj['span']
                            span[0] += numStartWhitespaceChars;
                            span[1] += numStartWhitespaceChars;
                            offsetAnnotations.push(span);
                            // console.log('Span: ' + span);
                            // console.log('substring: ' + currentSurfaceRepresentation.slice(span[0], span[1]));
                            // console.log('tag: ' + obj['tag']);

                            for (var i = span[0]; i < span[1]; i++) {
                                currentAnnotations[i] = {'tag': obj['tag'], 'confidence': obj['confidence']}
                            }
                        });

                        var existingAnnotations = JSON.parse(JSON.stringify(currentAnnotationObj['annotations']))

                        // now overwrite the QE annotations with the current constraint annotations where they exist
                        currentAnnotations = $.extend(true, {}, currentAnnotations, existingAnnotations);

                        // now spans are correct in currentAnnotations
                        // TODO: remember to ensure currentSurfaceRepresentation has whitespace at beginning and end
                        var annotationObj = {
                            'text': currentSurfaceRepresentation,
                            'annotations': currentAnnotations,
                            'spans': offsetAnnotations
                        }
                        deferred.resolve(annotationObj);

                      scope.state.qePending = false;
                      scope.state.action = 'default';
                  }
                ).error(function () {
                    scope.state.qePending = false;
                    scope.state.action = 'default';
                    // TODO: handle error (reject deferred)
                    // TODO: handle failure and timeout
                }
              );
          }

          return deferred.promise
      }

        // global "single truth" rendering function
        // render output in the component -- maintain user annotations, but add QE annotation around the user annotation
        // TODO: log actions when UI state changes, this function could take event that caused the change as input
        scope.previousState = undefined;
        var addUndo = function (annotationObj) {
          // Undo Stack
          if (scope.previousState != null) {

              if (scope.state.undoStack.length >= 1) {
                  var lastIndex = scope.state.undoStack.length - 1;
                  if (JSON.stringify(scope.previousState) !== JSON.stringify(scope.state.undoStack[lastIndex])) {
                      scope.state.undoStack.push(scope.previousState);
                  }
              } else {
                  scope.state.undoStack.push(scope.previousState);
              }
          }
          scope.previousState = annotationObj;
          // End Undo Stack

        };

        var renderAnnotations = function(annotationObj) {
          // sanity: enumerate the surface representation character by character.
          //      - append a character span for each character:
          //         - when the current index is found in the annotation index, add the TAG's markup according to the tag id

          // GLOBAL DATA MODEL
          // Updating the target segment data model for the actual document model (i.e. removing the markup associated with this component)
          // remove any extra whitespace
          var currentText = annotationObj['text'];
          currentText = currentText.replace(/\s+/g, ' ');

          // remove whitespace at beginning and end
          currentText = currentText.replace(/^\s+/, '');
          currentText = currentText.replace(/\s+$/, '');

          // finally set the targetSegment to just the current string representation of the component
          scope.targetSegment = currentText;
          // END GLOBAL DATA MODEL


          var surfaceText = annotationObj['text'];
          var annotations = annotationObj['annotations'];

          var surfaceHtml = [];
          for (var i=0; i<surfaceText.length; i++) {
            var char = surfaceText.charAt(i);
            var tag = undefined;
            var confidence = undefined;
            if (i in annotations) {
              tag = annotations[i]['tag'];
              confidence = annotations[i]['confidence'];
            }

            // opacity/color is a function of confidence
            // TODO: tooltip on qe-bars showing confidence score
            // TODO: qe-bars always fade in quickly on render
            if (tag != null) {
              if (tag === 'USER') {
                if (/^\s+$/.test(char)) {
                    surfaceHtml.push('<span class="post-editor-whitespace word-level-qe-token" data-qelabel="user">' + char + '</span>');
                } else {
                    surfaceHtml.push('<span class="post-editor-whitespace word-level-qe-token" data-qelabel="user">' + char + '<div class="qe-bar-user"></div></span>');
                }
              } else {
                // the first check is just to be sure in case QE model accidentally annotated whitespace
                if (/^\s+$/.test(char)) {
                  surfaceHtml.push('<span class="post-editor-whitespace word-level-qe-token">' + char + '</span>');
                } else if (tag === 'OK') {
                  surfaceHtml.push('<span class="post-editor-whitespace word-level-qe-token">' + char + '<div class="qe-bar-good" style="opacity: ' + confidence + '"></div></span>');
                } else if (tag === 'BAD') {
                  surfaceHtml.push('<span class="post-editor-whitespace word-level-qe-token">' + char + '<div class="qe-bar-bad" style="opacity: ' + confidence + '"></div></span>');
                }
              }
            } else {
              surfaceHtml.push('<span class="post-editor-whitespace word-level-qe-token">' + char + '</span>');
            }

          }
          // now replace the component HTML with the new HTML
          surfaceHtml = surfaceHtml.join('');
          $el.find('.post-editor').first().html(surfaceHtml);
          console.log('repopulated component HTML');
        };


        // we want to map the original segment through QE each time, then at each editing step update annotations as needed
        // This is effectively the god function:
        // - updates the UI state triggered by a user interaction
        //     - constrained decoding returns a promise which either (1) resolves immediately or (2) calls the server
        //     - QE returns a promise which either (1) resolves immediately or (2) calls the QE server
        //     - all server functions pass the current annotationObj through
        //     - after the QE server promise resolves, UI gets rendered
        var updateTargetSegment = function (mode) {
                // handling new content inserted by user
                var userAddedText = $el.find('.tooltip-span').text();
                userAddedText = userAddedText.replace(/\s+/g, ' ');
                console.log('user added text: ' + userAddedText);
                console.log('mode: ' + mode);

                // if (!/^\s+$/.test(userAddedText)) {
                //   userAddedText = $.trim(userAddedText);
                // }

                // reannotate the userAddedText with special user spans, all other spans retain their original annotations
                var startingSpace = '';
                if (userAddedText.match(/^\s+/)) {
                    startingSpace = userAddedText.match(/^\s+/)[0];
                }
                var trailingSpace = '';
                if (userAddedText.match(/\s+$/)) {
                  trailingSpace = userAddedText.match(/\s+$/)[0];
                }

                userAddedText = $.trim(userAddedText);
                var newUserTokens = userAddedText.split('');
                var newUserHtml = newUserTokens.map(function (m) {
                    if (/^\s+$/.test(m)) {
                        return '<span class="post-editor-whitespace word-level-qe-token" data-qelabel="user">' + m + '</span>';
                    } else {
                        return '<span class="post-editor-whitespace word-level-qe-token" data-qelabel="user">' + m + '<div class="qe-bar-user"></div></span>';
                    }
                }).join('');
                if (startingSpace.length > 0) {
                  newUserHtml = '<span class="post-editor-whitespace word-level-qe-token"> </span>' + newUserHtml;
                }
                if (trailingSpace.length > 0) {
                  newUserHtml = newUserHtml + '<span class="post-editor-whitespace word-level-qe-token"> </span>';
                }

                // add the new annotated user data into the current tooltip span
                $el.find('.tooltip-span').html(newUserHtml);

                // now remove the tooltip span, leaving the contents
                $el.find('.tooltip-span').contents().unwrap();
                $el.find('.tooltip-span').remove();

                // The $digest is important here, otherwise component state won't be ready
                if(mode === 'insert') {
                    // $digest or $apply
                    scope.$digest();
                }

                // Now user constraints are now annotated in the UI

                // now rebuild the annotation object with the surface representation + annotation indices
                // in baseline and constrainedDecoding mode we just show the user-added spans underlined
                // in qe mode we also annotate for QE
                $timeout(function () {
                  var currentAnnotationMap = getCurrentAnnotationMap(mode);
                  // console.log(currentAnnotationMap);

                  // this Async block updates the UI with the results of the configured services
                  var qePromise = queryApeQe(currentAnnotationMap);
                  qePromise.then(function (newAnnotationMap) {
                    // now render UI
                    addUndo(newAnnotationMap);
                    renderAnnotations(newAnnotationMap);
                    scope.state.action = 'default';
                  }, function (reason) {

                  }, function (update) {

                  });
                }, 0);


                    // Note: this method requires us to call color annotation every time, otherwise colors will disappear when we replace element HTML
                    // placeholder for calling the annotation function, which returns span annotations of the input text
                    // random color
                    // WORKING: the QE can actually be hard-coded, we don't need dynamic access because user edits are automatically "OK"

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

                    // resets component state
                    // $timeout(
                    //     function () {
                    //         scope.state.action = 'default';
                    //     }, 0)

                };

        var componentTextToHtml = function () {
          // The "reannotation" should only happen on the first call
          // Note addition of whitespace on both sides -- TODO: make this more explicit
          var posteditorText = '    ' + scope.localTargetSegment + '    ';

          // Key idea: annotations are stored in the DOM via data-* attributes, mapped to each token
          // split on characters
          var allTokens = posteditorText.split('');
          // wraps every character in its own span
          var posteditorHtml = allTokens.map(function (m, idx, arr) {
              return '<span class="post-editor-whitespace word-level-qe-token">' + m + '</span>';
          });
          $el.find('.post-editor').first().html(posteditorHtml);

          // DEV: random annotations while developing
          // var prevClass = undefined;
          // var qeClasses = ["qe-bar-good", "qe-bar-good", "qe-bar-good", "qe-bar-good", "qe-bar-bad"];
          // var posteditorHtml = allTokens.map(function (m, idx, arr) {
          //     if (/^\s+$/.test(m)) {
          //         return '<span class="post-editor-whitespace word-level-qe-token">' + m + '</span>';
          //     } else {
          //         // check if we're continuing a word
          //         if (idx === 0 || /^\s+$/.test(arr[idx - 1])) {
          //             // we're starting a new class, select a new random label
          //             prevClass = qeClasses[Math.floor(Math.random() * qeClasses.length)];
          //         }
          //         return '<span class="post-editor-whitespace word-level-qe-token">' + m + '<div class="' + prevClass + '"></div></span>';
          //     }
          // });
          // constraints and QE annotations are now in the UI

          // hack
          // $el.find('.post-editor').find('.word-level-qe-token').each(function() {
          //     console.log($(this).text());
          //     if ($(this).text().length == 0) {
          //         $(this).remove();
          //     }
          // });
        };


        // when the directive initializes
        $timeout(function () {
            // TODO: the `true` arg says to do QE annotation -- make this configurable in component initialization
            // TODO: annotate tokens and push to undo stack when directive initializes
            componentTextToHtml();
            updateTargetSegment();
        }, 0);

      },
      controller: function($scope) {}
    };
}]);

