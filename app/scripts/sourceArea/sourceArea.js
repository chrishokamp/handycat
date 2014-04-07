angular.module('directives')
.directive('sourceArea', ['$log', 'tokenizer', '$compile', function($log, tokenizer,$compile) {
    // take the text inside the element, tokenize it, and wrap in spans that we can interact with
    return {
      scope: {
        sourceSentence: '=',
        annotatedSentence: '='
      },
      restrict: 'E',
      //templateUrl: 'scripts/sourceArea/sourceArea.html',
      link: function(scope,el,attrs){
        // tokens should be undefined here
//        $log.log('sourceArea directive - tokens: ' + scope.tokens);
        var tokenStrings = tokenizer.tokenize(scope.sourceSentence);
        $log.log('tokenized sentence: ' + tokenStrings);
        // give each token an id, and also move to dot notation
        // var tokens =  _.map(tokenStrings, function(tok, index) { return { index: index, token: tok} });
        // wrap tokens in spans
        var tokenSpans =  _.map(tokenStrings, function(tok, index) { return '<span class="source-token">' + tok + '</span>'});
        var annotatedSentence = tokenSpans.join(' ');
        $log.log('annotatedSentence is: ' + annotatedSentence);

        var compiledHTML = $compile(annotatedSentence)(scope);
//        scope.annotatedSentence = annotatedSentence;
        $log.log('compiledHTML is:' + compiledHTML);
        el.append(compiledHTML);


      }
    };
}]);
