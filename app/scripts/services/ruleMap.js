angular.module('services')
.factory('ruleMap', ['$rootScope','$log', function($rootScope, $log) {

// rules are objects with the form:
//    { 'operationName': 'opName', 'context': '<context>, 'change': <change> }
  return {
    rules: [],
    addRule: function(newRuleObj) {
      // make sure we don't already have the rule
      if (!this.contains(newRuleObj)) {
        rules.push(newRuleObj);
      }
// TODO: fire a 'new rule' event
    },
    contains: function(newRuleObj) {
      return (_.find(this.rules, function(ruleObj) {
        // check all rules for deep equality
        return _.isEqual(newRuleObj, ruleObj);
      }));
    },
    deleteRule: function(ruleObj) {
      this.rules.splice(
        _.indexOf(
          this.rules,
          _.find(this.rules, function(rule) { return _.isEqual(rule, ruleObj) })
        ),
        // splice it out
        1
      );
    }
  }


}]);