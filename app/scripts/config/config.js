// this module sets up the environment for HandyCAT
// the values that you must provide here depend upon which components you are using

// WORKING -- proxy all of these URLs through the express server

var handyCATconfig = angular.module('handycatConfig', []);

// TODO: -- this is a quick hack
var baseURL = 'http://localhost'


// the concordancer URL
var concordancerURL = 'http://127.0.0.1:8899/concordancer';
handyCATconfig.constant('concordancerURL', concordancerURL);

// the Translation Memory (graphTM) URL
//var graphTMUrl = 'http://localhost:8899/tm';
var graphTMUrl = 'tm';
handyCATconfig.constant('graphTMUrl', graphTMUrl);

// the levenshtaligner URL
var levenshtalignerURL = 'http://127.0.0.1:5000/levenshtalign';
handyCATconfig.constant('levenshtalignerURL', levenshtalignerURL);

var xliffCreatorUrl = 'create-xliff/'
handyCATconfig.constant('xliffCreatorUrl', xliffCreatorUrl);

// the lm autocompleter URL
//var lmAutocompleterURL = baseURL + ':8010/lm_autocomplete';
// the two autocompleter types that we currently support

//var lmAutocompleterURL = 'lm_autocomplete/constrained';
var lmAutocompleterURL = 'lm_autocomplete/default';
var constrainedAutocompleterURL = 'lm_autocomplete/constrained';
var defaultAutocompleterURL = 'lm_autocomplete/default';
//var imtAutocompleterURL = 'imt_autocomplete';
var imtAutocompleterURL = 'imt/neural_imt';

handyCATconfig.service('autocompleterURLs', function() {
  // this may get overwritten in the app
  this.lmAutocompleterURL = constrainedAutocompleterURL;
  // these will be set as needed by injectors
  this.constrainedLMAutocompleterURL = constrainedAutocompleterURL;
  this.defaultLMAutocompleterURL = defaultAutocompleterURL;
  this.imtAutocompleterURL = imtAutocompleterURL;
});

// the languages that HandyCAT supports
// TODO: this has to be diff
var supportedLangs = {
  source: [
    'en-EN'
  ],
  target: [
    //'es-ES',
    'fr-FR',
    'ga-IE',
    'de-DE',
    'pt-PT'
  ]
}
handyCATconfig.constant('supportedLangs', supportedLangs);

var vocablistURL = 'vocablist';
handyCATconfig.constant('vocablistURL', vocablistURL);

// TODO: deprecate
var wikipediaURL = 'wikipedia';
handyCATconfig.constant('wikipediaURL', wikipediaURL);

var glossaryURL = 'glossary';
handyCATconfig.constant('glossaryURL', glossaryURL);

var loggerURL = 'logger';
handyCATconfig.constant('loggerURL', loggerURL);

// allow experiment configuration via handyCAT config
var experimentGroups = [
  {
    name: 'Group One',
    sampleFiles: [
      //{name: 'en-es-sentences_1', url: 'data/malaga_experiments/en-es_sentences_1.xlf',
      //  configuration: {'target': {'widgets': {'constrainedLMAutocomplete': true}}}
      //},
      {name: 'felix_porto_matecat', url: 'data/porto_experiments/matecat/Project_1_-_Mobile_phone_instructions.doc.xlf',
        configuration: {'target': {'widgets': {'constrainedLMAutocomplete': true}}}
      },
      {name: 'en-es-sentences_4', url: 'data/malaga_experiments/en-es_sentences_2.xlf',
        configuration: {'target': {'widgets': {'defaultLMAutocomplete': true}}}
      },
    ]
  },
  {
    name: 'Group Two',
    sampleFiles: [
      {name: 'en-es-sentences_2', url: 'data/malaga_experiments/en-es_sentences_2.xlf',
        configuration: {'target': {'widgets': {'constrainedLMAutocomplete': true}}}
      },
      {name: 'en-es-sentences_3', url: 'data/malaga_experiments/en-es_sentences_1.xlf',
        configuration: {'target': {'widgets': {'defaultLMAutocomplete': true}}}
      }
    ]
  }
]

handyCATconfig.constant('experimentGroups', experimentGroups)

