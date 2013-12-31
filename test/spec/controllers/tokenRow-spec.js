'use strict';
define(['angular',
  'app',
  'controllers/controllers',
  'tokenRow/tokenRow'],
  function(angular, app) {

    describe('Controller: MainCtrl', function () {

      // load the controller's module
      beforeEach(module('editorComponentsApp'));
      beforeEach(function() {
        module('controllers');
      });

      var MainCtrl,
        scope;

      // Initialize the controller and a mock scope
      beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        MainCtrl = $controller('RowCtrl', {
          $scope: scope
        });
      }));

      it('Should have a property called tokens whose length is 5', function () {
        expect(scope.tokens.length).toBe(5);
      });
      it('The length of tokens should NOT be 4', function () {
        expect(scope.tokens.length).not.toBe(4);
      });
});

});
