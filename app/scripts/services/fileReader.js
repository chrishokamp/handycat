angular.module('services').factory('fileReader', ['$q', '$log', function($q, $log) {

  // begin fileReader with promises - three methods: onLoad, onError, and onProgress
  var fileReader = function ($q, $log) {

    // TESTING for inter-service communication
    var onLoad = function(reader, deferred, scope) {
      return function () {
        deferred.resolve(reader.result);
      };
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

// Why are we passing in scope here? - Answer: because the resolution of the promise is called with scope.$apply
    var readAsText = function (file) {
      $log.log('READING AS TEXT');
      var deferred = $q.defer();

      //var reader = getReader(deferred, scope);
      var reader = getReader(deferred);
      reader.readAsText(file);

      return deferred.promise;
    };

// TODO: how to maintain document state as the user changes stuff?
    var readAsXML = function (file, scope) {
      $log.log('READING AS XML');
      var deferred = $q.defer();

      var reader = getReader(deferred, scope);
      reader.readAsText(file);

      return deferred.promise;
    };

    return {
      readAsDataUrl: readAsDataURL,
      readAsText: readAsText,
      readAsXML: readAsXML
    };
  };

  return fileReader($q, $log);

}]);
