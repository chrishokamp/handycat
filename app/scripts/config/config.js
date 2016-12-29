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
      'targetComponentSelector': true,
      'qeScore': false,
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
        {
          'directiveName': 'postEditor',
          'textName': 'postEditor'
        },
        // {
        //   'directiveName': 'qeScore',
        //   'textName': 'QE Score'
        // },
      ]
    }
  })

// allow experiment configuration via handyCAT config
var experimentGroups = [
  {
    name       : 'Demo',
    sampleFiles: [
      {
        name         : 'Session 0 - Project 0 - Post Editor',
        internalName : 'Mobile Phone Instructions - Post Editor',
        url          : 'data/porto_experiments/matecat/Project_1_-_Mobile_phone_instructions.doc.xlf',
        configuration: {
          target: {
            activeComponent : 'postEditor',
            defaultComponent: 'postEditor',
            components      : [
              {
                directiveName: 'postEditor',
                textName     : 'Post Editor'
              }
            ]
          }
        },
      },
      {
        name         : 'Session 0 - Project 0 - Autocomplete',
        internalName : 'Mobile Phone Instructions - Autocomplete',
        url          : 'data/porto_experiments/matecat/Project_1_-_Mobile_phone_instructions.doc.xlf',
        configuration: {
          target: {
            activeComponent : 'typeaheadEditor',
            defaultComponent: 'typeaheadEditor',
            components      : [
              {
                directiveName: 'typeaheadEditor',
                textName     : 'Autocomplete'
              }
            ]
          }
        },
      }
    ]
  },
  {
    name       : 'Group 1',
    sampleFiles: [
      {
        name         : 'Group 1 - Session 1',
        internalName : 'Marketing Questionnaire - Autocomplete',
        url          : 'data/porto_experiments/matecat/Project_2_-_Marketing_questionnaire.doc.xlf',
        configuration: {
          target: {
            activeComponent : 'typeaheadEditor',
            defaultComponent: 'typeaheadEditor',
            components      : [
              {
                directiveName: 'typeaheadEditor',
                textName     : 'Autocomplete'
              }
            ]
          }
        },
      },
      {
        name         : 'Group 1 - Session 2',
        internalName : 'Product Catalog - Office Supplies - postEditor',
        url          : 'data/porto_experiments/matecat/Project_3_-_Product_catalog_-_Office_supplies.doc.xlf',
        configuration: {
          target: {
            activeComponent : 'postEditor',
            defaultComponent: 'postEditor',
            components      : [
              {
                directiveName: 'postEditor',
                textName     : 'Post Editor'
              }
            ]
          }
        },
      },
      {
        name         : 'Group 1 - Session 3',
        internalName : 'User Manual - Industrial Equipment - Autocomplete',
        url          : 'data/porto_experiments/matecat/Project_4_-_User_manual_-_industrial_equipment.doc.xlf',
        configuration: {
          target: {
            activeComponent : 'typeaheadEditor',
            defaultComponent: 'typeaheadEditor',
            components      : [
              {
                directiveName: 'typeaheadEditor',
                textName     : 'Autocomplete'
              }
            ]
          }
        },
      },
      {
        name         : 'Group 1 - Session 4',
        internalName : '',
        url          : 'data/porto_experiments/matecat/Project_4_-_User_manual_-_industrial_equipment.doc.xlf',
        configuration: {
          target: {
            activeComponent : 'postEditor',
            defaultComponent: 'postEditor',
            components      : [
              {
                directiveName: 'postEditor',
                textName     : 'Post Editor'
              }
            ]
          }
        }
      }
    ]
  },
  {
    name       : 'Group 2',
    sampleFiles: [
      {
        name         : 'Group 2 - Session 1',
        internalName : 'Product Catalog - Office Supplies - Autocomplete',
        url          : 'data/porto_experiments/matecat/Project_3_-_Product_catalog_-_Office_supplies.doc.xlf',
        configuration: {
          target: {
            activeComponent : 'typeaheadEditor',
            defaultComponent: 'typeaheadEditor',
            components      : [
              {
                directiveName: 'typeaheadEditor',
                textName     : 'Autocomplete'
              }
            ]
          }
        },
      },
      {
        name         : 'Group 2 - Session 2',
        internalName : 'User Manual - Industrial Equipment - Post Editor',
        url          : 'data/porto_experiments/matecat/Project_4_-_User_manual_-_industrial_equipment.doc.xlf',
        configuration: {
          target: {
            activeComponent : 'postEditor',
            defaultComponent: 'postEditor',
            components      : [
              {
                directiveName: 'postEditor',
                textName     : 'Post Editor'
              }
            ]
          }
        }
      },
      {
        name         : 'Group 2 - Session 3',
        internalName : 'Marketing Questionnaire - Autocomplete',
        url          : 'data/porto_experiments/matecat/Project_2_-_Marketing_questionnaire.doc.xlf',
        configuration: {
          target: {
            activeComponent : 'typeaheadEditor',
            defaultComponent: 'typeaheadEditor',
            components      : [
              {
                directiveName: 'typeaheadEditor',
                textName     : 'Autocomplete'
              }
            ]
          }
        },
      },
      {
        name         : 'Group 2 - Session 4',
        internalName : 'Marketing Questionnaire - Post Editor',
        url          : 'data/porto_experiments/matecat/Project_2_-_Marketing_questionnaire.doc.xlf',
        configuration: {
          target: {
            activeComponent : 'postEditor',
            defaultComponent: 'postEditor',
            components      : [
              {
                directiveName: 'postEditor',
                textName     : 'Post Editor'
              }
            ]
          }
        },
      }
    ]
  },
  {
    name       : 'Group 3',
    sampleFiles: [
      {
        name         : 'Group 3 - Session 1',
        internalName : 'User Manual - Industrial Equipment - Autocomplete',
        url          : 'data/porto_experiments/matecat/Project_4_-_User_manual_-_industrial_equipment.doc.xlf',
        configuration: {
          target: {
            activeComponent : 'typeaheadEditor',
            defaultComponent: 'typeaheadEditor',
            components      : [
              {
                directiveName: 'typeaheadEditor',
                textName     : 'Autocomplete'
              }
            ]
          }
        }
      },
      {
        name         : 'Group 3 - Session 2',
        internalName : 'Marketing Questionnaire - Post Editor',
        url          : 'data/porto_experiments/matecat/Project_2_-_Marketing_questionnaire.doc.xlf',
        configuration: {
          target: {
            activeComponent : 'postEditor',
            defaultComponent: 'postEditor',
            components      : [
              {
                directiveName: 'postEditor',
                textName     : 'Post Editor'
              }
            ]
          }
        },
      },
      {
        name         : 'Group 3 - Session 3',
        internalName : 'Product Catalog - Office Supplies - Autocomplete',
        url          : 'data/porto_experiments/matecat/Project_3_-_Product_catalog_-_Office_supplies.doc.xlf',
        configuration: {
          target: {
            activeComponent : 'typeaheadEditor',
            defaultComponent: 'typeaheadEditor',
            components      : [
              {
                directiveName: 'typeaheadEditor',
                textName     : 'Autocomplete'
              }
            ]
          }
        },
      },
      {
        name         : 'Group 3 - Session 4',
        internalName : 'Product Catalog - Office Supplies - Post Editor',
        url          : 'data/porto_experiments/matecat/Project_3_-_Product_catalog_-_Office_supplies.doc.xlf',
        configuration: {
          target: {
            activeComponent : 'postEditor',
            defaultComponent: 'postEditor',
            components      : [
              {
                directiveName: 'postEditor',
                textName     : 'Post Editor'
              }
            ]
          }
        },
      },
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

