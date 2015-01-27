angular.module('services', []);

// TODO: this should be set in the config - it's here now for testability
angular.module('services')
  // TODO: baseUrl depends where we are deployed -- set this dynamically to the URL of the app
//.constant('baseUrl', 'http://0.0.0.0:5002')
  .constant('baseUrl', 'http://localhost:9000')
