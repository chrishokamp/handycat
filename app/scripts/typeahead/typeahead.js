angular.module('handycat.typeaheads', []);

// an input area with one or more typeahead datasets enabled

angular.module('handycat.typeaheads')
  .directive('typeaheadEditor', ['$log', '$timeout', function($log, $timeout) {
    return {
      scope: {

      },
      templateUrl: 'scripts/typeahead/typeahead.html',
      link: function($scope, el, attrs) {
        el.find('#atwho-input').atwho({
          at: '',
          suffix: ''
        })
        // controllers are named by their 'at' trigger
        $log.log(el.find('#atwho-input').data('atwho').controllers[""].setting.callbacks.filter);

        var remoteFilter = function(query, callback) {
          $log.log('remoteFilter');
          console.log('remote')
          callback(['this', 'is', 'a', 'test']);
        }

        var testFilter = function(query, data, searchKey) {
          console.log('filter')
          $log.log('filter called with:');
          $log.log('query');
          $log.log(query);
          $log.log('data');
          $log.log(data);
          $log.log('searchKey');
          $log.log(searchKey);
          return []
        }

        el.find('#atwho-input').data('atwho').controllers[""].setting.callbacks.filter = testFilter;
        el.find('#atwho-input').data('atwho').controllers[""].setting.callbacks.remoteFilter = remoteFilter;
          //.set_context_for('').Controller);
        //el.atwho().Controller);
        //$.atwho.Controller.filter = testFilter;


        //  .atwho({
        //  at: ":",
        //  data: ["+1", "-1", "smile"]
        //});
      }
    }

}]);
