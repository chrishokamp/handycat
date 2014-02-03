'use strict';

define(['services/services'], function(services) {

  // begin fileReader with promises - three methods: onLoad, onError, and onProgress
  var fileReader = function ($q, $log) {

    // TESTING for inter-service communication
    var onLoad = function(reader, deferred, scope) {
      return function () {
        deferred.resolve(reader.result);
      }
      //return function () {
      //  scope.$apply(function () {
      //    deferred.resolve(reader.result);
      //  });
      //};
    };

    var onError = function (reader, deferred, scope) {
      return function () {
        scope.$apply(function () {
          deferred.reject(reader.result);
        });
      };
    };

    var onProgress = function(reader, scope) {
      return function (event) {
        //scope.$broadcast("fileProgress",
        //  {
        //    total: event.total,
        //    loaded: event.loaded
        //  });
      };
    };

    var getReader = function(deferred, scope) {
      var reader = new FileReader();
      reader.onload = onLoad(reader, deferred, scope);
      reader.onerror = onError(reader, deferred, scope);
      reader.onprogress = onProgress(reader, scope);
      return reader;
    };

    var readAsDataURL = function (file, scope) {
      var deferred = $q.defer();

      var reader = getReader(deferred, scope);
      reader.readAsDataURL(file);

      return deferred.promise;
    };

// Why are we passing in scope here? - Answer: becuase the resolution of the promise is called with scope.$apply
    var readAsText = function (file) {
      var deferred = $q.defer();

      //var reader = getReader(deferred, scope);
      var reader = getReader(deferred);
      reader.readAsText(file);

      return deferred.promise;
    }

// TODO: how to maintain document state as the user changes stuff?
    var readAsXML = function (file, scope) {
      var deferred = $q.defer();

      var reader = getReader(deferred, scope);
      reader.readAsText(file);

      // now parse the result as XML
// TODO: understand this stuff with promises
// TODO: all of this is specific to xliff, not arbitrary xml
// Moving to controller because i don't understand the promise API
      return deferred.promise;
    }



    // Chris: this code is from the escriba XLIFF parser
    // Chris: this assumes that the translation units are in <mrk></mrk> tags - what if they aren't?
    //function get_mrk_target(doc, segment) {
    //  var segid = _get_segid(segment);
    //  var tuid = _get_tuid(segment);
    //  return doc.querySelector('trans-unit[id="'+tuid+'"] > target > mrk[mtype="seg"][mid="'+segid+'"]');
    //}

    //function get_target(doc, segment) {
    //  var segid = _get_segid(segment);
    //  var tuid = _get_tuid(segment);
    //  return doc.querySelector('trans-unit[id="'+tuid+'"] > target');
    //}

    //function get_transunit(doc, tuid) {
    //  return doc.querySelector('trans-unit[id="'+tuid+'"]');
    //}


    return {
      readAsDataUrl: readAsDataURL,
      readAsText: readAsText,
      readAsXML: readAsXML
    };
  };

  services.factory('fileReader',
    ['$q', '$log', fileReader]);


});
