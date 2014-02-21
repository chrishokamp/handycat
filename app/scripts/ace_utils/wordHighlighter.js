// a simple word highlighter for the ace editor
// use ace.require to bring in the dependencies?
// var langTools = ace.require("ace/ext/language_tools");
// TODO: we don't actually have the mode-text dependency in the ace_builds repo
// TODO: just copy and modify another mode in the ace source?
// TODO: currently repurposing the text mode in the Ace editor source
define([], function() {

  var oop = ace.require("ace/lib/oop");
  var TextMode = ace.require("ace/mode/text").Mode;
  var Tokenizer = ace.require("ace/tokenizer").Tokenizer;
  //console.log(Tokenizer);
    // ExampleHighlightRules isn't found
  // var ExampleHighlightRules = ace.require("ace/mode/text_highlight_rules").ExampleHighlightRules;
  var TextHighlightRules = ace.require("ace/mode/text_highlight_rules").TextHighlightRules;
  //console.log(TextHighlightRules);

});