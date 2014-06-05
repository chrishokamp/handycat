var sharedConfig = require('./karma-shared.conf');

module.exports = function(config) {
  var conf = sharedConfig();

  conf.files = conf.files.concat([
    //extra testing code
    'node_modules/ng-midway-tester/src/ngMidwayTester.js',

    //mocha stuff
//    'test/mocha.conf.js',

    //test files
    'test/midway/**/*.js'
  ]);

  conf.proxies = {
    '/': 'http://localhost:9999/'
//    '/': 'http://localhost:9000/'
  };

  config.set(conf);
};