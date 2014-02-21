// This directive captures the functionality of a token -- maps to a model
// TODO: Remember that tokens are editable, deletable, reorderable, and combinable into larger tokens

// When a token element is dropped, it is appended *after* this gap element
// <dragUnit><token></token><gap></gap></dragUnit>

angular.module('directives').directive('token', function() {
  return {
    restrict: 'EA',
    // TODO: enable this once tokens are editable
    // require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      // Working notes:
      // tokens must come through a tokenizer
      // tokens constantly change as the text changes
      //  - see how ace editor does tokenization

    }
  };
});
