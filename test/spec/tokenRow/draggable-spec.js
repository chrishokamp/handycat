'use strict';
define(['angular',
  'app',
  'directives/directives',
  'tokenRow/draggable'],
  function(angular, app) {
    // compile the test template -- or the main page?
    // inject the directive
    // use jquery to test actions on the DOM

    // load the templates on the directives, then add the directives into html
    // compile the html and do a $digest before testing

    describe('Directives: draggable', function () {
      var elm, scope;

      // load the directives module
      beforeEach(module('editorComponentsApp'));
      beforeEach(function() {
        module('directives');
      });

      beforeEach(inject(function($rootScope, $compile) {
        // we might move this tpl into an html file as well...
        // TODO: how to get the html from a file
        elm = angular.element('<div draggable>Drag Me</div>');

        scope = $rootScope;
        $compile(elm)(scope);
        scope.$digest();
      }));

      // TODO: change to actual tests
      it('Should contain text', inject(function($compile, $rootScope) {
          d("inside draggable test");
          var $elem = $(elm);
          var text = $elem.text();
          // how to drag with jquery?
          //expect(text).toBe("Drag Me");
          //expect(text).toBe("Balls");
        expect(text).toBe("Drag Me");
          console.error($elem);

          // use jquery simulate to simulate dragging
          $elem.simulate('drag', { dx: 200, dy: 100 });
          expect($elem.hasClass('i-was-dragged')).toBeTruthy();
          console.error($elem);

        })
      );
    });

  }
);
