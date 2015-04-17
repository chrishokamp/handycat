// this module sets up the environment for HandyCAT
// the values that you must provide here depend upon which components you are using

// WORKING -- proxy all of these URLs through the express server

var handyCATconfig = angular.module('handycatConfig', []);

var xliffCreatorUrl = 'http://localhost:8080/create-xliff/1.2'
handyCATconfig.constant('xliffCreatorUrl', xliffCreatorUrl);

// the concordancer URL
var concordancerURL = 'http://127.0.0.1:8899/concordancer';
handyCATconfig.constant('concordancerURL', concordancerURL);

// the Translation Memory (graphTM) URL
var graphTMUrl = 'http://localhost:8899/tm';
handyCATconfig.constant('graphTMUrl', graphTMUrl);

// the levenshtaligner URL
var levenshtalignerURL = 'http://127.0.0.1:5000/levenshtalign';
handyCATconfig.constant('levenshtalignerURL', levenshtalignerURL);

// the lm autocompleter URL
var lmAutocompleterURL = 'http://localhost:8010/lm_autocomplete';
// TODO: proxy through express
//var lmAutocompleterURL = 'lm_autocomplete';
handyCATconfig.constant('lmAutocompleterURL', lmAutocompleterURL);

// the languages that HandyCAT supports
var supportedLangs = [
  'es-ES',
  'en-US',
  'de-DE'
]
handyCATconfig.constant('supportedLangs', supportedLangs);

var vocablistURL = 'http://localhost:9000/vocablist';
handyCATconfig.constant('vocablistURL', vocablistURL);

