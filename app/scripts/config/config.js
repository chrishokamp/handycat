// this module sets up the environment for HandyCAT
// the values that you must provide here depend upon which components you are using

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
handyCATconfig.constant('lmAutocompleterURL', lmAutocompleterURL);
