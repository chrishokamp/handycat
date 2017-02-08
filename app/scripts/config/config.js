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

// to create XLIFFs from parallel source and target files
var parallelXliffCreatorUrl = 'create-parallel-xliff/'
handyCATconfig.constant('parallelXliffCreatorUrl', parallelXliffCreatorUrl);

// autocompleter URLs
//var lmAutocompleterURL = baseURL + ':8010/lm_autocomplete';
// the two autocompleter types that we currently support

//var lmAutocompleterURL = 'lm_autocomplete/constrained';
var lmAutocompleterURL = 'lm_autocomplete/default';
var constrainedAutocompleterURL = 'lm_autocomplete/constrained';
var defaultAutocompleterURL = 'lm_autocomplete/default';
//var imtAutocompleterURL = 'imt_autocomplete';
var imtAutocompleterURL = 'imt/neural_imt';

handyCATconfig.service('autocompleterURLs', function() {
  // controls whether we will use a remote autocompleter at all
  // if this is a url, we'll hit it to get suggestions
  this.useRemoteAutocompleter = false;

  // this may get overwritten in the app
  this.lmAutocompleterURL = constrainedAutocompleterURL;
  // these will be set as needed by injectors
  this.constrainedLMAutocompleterURL = constrainedAutocompleterURL;
  this.defaultLMAutocompleterURL = defaultAutocompleterURL;
  this.imtAutocompleterURL = imtAutocompleterURL;
});

// the languages that HandyCAT supports
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

// TODO: raw textarea component (no typeahead)
// this is the default global configuration -- projects can override this config
handyCATconfig.constant('projectCreationConfiguration',
  {
    showFileCreation: false,
    showRawTextCreation: false,
    showExperiment: true
  });

handyCATconfig.constant('widgetConfiguration',
  {
    'segmentControls': {
      'targetComponentSelector': false,
      'qeScore': true,
    },
    'target': {
      activeComponent: 'typeaheadEditor',
      defaultComponent: 'typeaheadEditor',
      // a list of the available components
      components: [
        {
          'directiveName': 'typeaheadEditor',
          'textName': 'Autocomplete'
        },
        // {
        //   'directiveName': 'postEditor',
        //   'textName': 'postEditor'
        // },
        // {
        //   'directiveName': 'qeScore',
        //   'textName': 'QE Score'
        // },
      ]
    }
  })

// allow experiment configuration via handyCAT config
// TODO: gen the grouping for each translator automagically
var experimentGroups = [
  {
    name       : 'Translator 1',
    sampleFiles: [
      {
        name         : 'Task 1',
        internalName : 'PRJ0',
        url          : 'data/qe_score_experiments/documents/PRJ0.xliff',
        configuration: {
          target: {
            activeComponent : 'typeaheadEditor',
            defaultComponent: 'typeaheadEditor',
            components      : [
              {
                directiveName: 'typeaheadEditor',
                textName     : 'Typeahead Editor'
              }
            ]
          },
          tsvUrl: 'data/qe_score_experiments/documents/score_tsvs/QE0',
          tsvData: undefined,
          qeScoreConfig: {
            scoreIndex: 0
          }
        },
      },
      {
        name         : 'Task 1',
        internalName : 'PRJ1',
        url          : 'data/qe_score_experiments/documents/PRJ1.xliff',
        configuration: {
          target: {
            activeComponent : 'typeaheadEditor',
            defaultComponent: 'typeaheadEditor',
            components      : [
              {
                directiveName: 'typeaheadEditor',
                textName     : 'Typeahead Editor'
              }
            ]
          }
        },
      },
      {
        name         : 'Task 3',
        internalName : 'PRJ2',
        url          : 'data/qe_score_experiments/documents/PRJ2.xliff',
        configuration: {
          target: {
            activeComponent : 'typeaheadEditor',
            defaultComponent: 'typeaheadEditor',
            components      : [
              {
                directiveName: 'typeaheadEditor',
                textName     : 'Typeahead Editor'
              }
            ]
          }
        },
      },
      {
        name         : 'Task 4',
        internalName : 'PRJ3',
        url          : 'data/qe_score_experiments/documents/PRJ3.xliff',
        configuration: {
          target: {
            activeComponent : 'typeaheadEditor',
            defaultComponent: 'typeaheadEditor',
            components      : [
              {
                directiveName: 'typeaheadEditor',
                textName     : 'Typeahead Editor'
              }
            ]
          }
        },
      }
    ]
  }

  // TODO: add a separate constant for sample files
  // {
  //   name: 'Group N',
  //   sampleFiles: [
  //     {
  //       name: 'Mobile Phone Instructions',
  //       url: 'data/porto_experiments/matecat/Project_1_-_Mobile_phone_instructions.doc.xlf',
  //       configuration: {
  //         target :{
  //           components: [
  //             {
  //               directiveName: 'postEditor',
  //               textName: 'postEditor'
  //               // directiveName: 'typeaheadEditor',
  //               // textName: 'typeaheadEditor'
  //             }
  //           ]
  //         }
  //       },
  //     },
  //     {name: 'Marketing Questionnaire', url: 'data/porto_experiments/matecat/Project_2_-_Marketing_questionnaire.doc.xlf',
  //       configuration: {'target': {'widgets': {'constrainedLMAutocomplete': true}}}
  //     },
  //     {name: 'Product Catalog - Office Supplies', url: 'data/porto_experiments/matecat/Project_3_-_Product_catalog_-_Office_supplies.doc.xlf',
  //       configuration: {'target': {'widgets': {'constrainedLMAutocomplete': true}}}
  //     },
  //     {name: 'User Manual: Industrial Equipment', url: 'data/porto_experiments/matecat/Project_4_-_User_manual_-_industrial_equipment.doc.xlf',
  //       configuration: {'target': {'widgets': {'constrainedLMAutocomplete': true}}}
  //     },
  //   ]
  // },
]

handyCATconfig.constant('experimentGroups', experimentGroups)

