'use strict';

define(['services/services'], function(services) {

  services.factory('Glossary', [ function() {
    return {
      words: ["apple", "pear", "peach"]
    }

  }]);
});