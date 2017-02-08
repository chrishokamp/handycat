angular.module('handycat.editors', ['handycatConfig']);
// an input area with one or more typeahead backends enabled

angular.module('handycat.editors')
  .directive('plaintextEditor', ['$log',
    function($log) {
    return {
      scope: {
        'targetSegment': '=',
        'sourceSegment': '=',
        'targetLang': '@',
        'sourceLang': '@',
        'activeComponent': '=',
        'isActive': '='
      },
      templateUrl: 'scripts/plaintextEditor/plaintextEditor.html',
      link: function($scope, el, attrs, segmentCtrl) {

        var $inputTextarea = el.find('.atwho-input');

        // when i become active, focus me
        // If the function gets called with the component id -- i.e. 'typeaheadEditor', focus me
        $scope.$watch(
          function() {
            return $scope.isActive;
          }, function(isActive) {
            if (isActive && $scope.activeComponent === 'plaintextEditor') {
              $log.log('focus plaintext editor');
              $inputTextarea.focus();
            }
          }
        )

        $scope.$on('clear-editor', function (event, args) {
          $log.log('clearEditor fired')
          $scope.targetSegment = '';
          $inputTextarea.focus();
        })

      }
    }
}])
