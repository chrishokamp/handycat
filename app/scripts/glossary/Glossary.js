// Controller for any element that uses the glossary service
// TODO: define live template before proceeding

'use strict';

define(['../controllers/controllers'], function(controllers) {

  controllers.controller('GlossaryCtrl', ['$scope', 'Glossary', function($scope, Glossary) {

    $scope.makeHtml = function() {
      var out = "";
      Glossary.words.forEach(function(word) {
        out += '<div>' + word + '</div>';
      });
      return out;
    }

  }]);
});
