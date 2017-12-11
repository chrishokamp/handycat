// this module sets up the environment for HandyCAT
// the values that you must provide here depend upon which components you are using

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

var constrainedDecodingUrl = 'imt/constrained_decoding';
handyCATconfig.constant('constrainedDecodingUrl', constrainedDecodingUrl);

var apeQeUrl = 'qe/word_level';
handyCATconfig.constant('apeQeUrl', apeQeUrl);

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
      'qeScore': false
    },
    'target': {
      activeComponent: 'wordLevelQEEditor',
      defaultComponent: 'wordLevelQEEditor',
      // a list of all available components
      components: [
        {
          'directiveName': 'plaintextEditor',
          'textName': 'Text Editor'
        },
        // {
        //   'directiveName': 'typeaheadEditor',
        //   'textName': 'Autocomplete'
        // },
        // {
        //   'directiveName': 'postEditor',
        //   'textName': 'postEditor'
        // },
        {
            'directiveName': 'wordLevelQeEditor',
            'textName': 'Word Level QE Editor'
        }
        // {
        //   'directiveName': 'qeScore',
        //   'textName': 'QE Score'
        // },
      ]
    }
  })

// allow experiment configuration via handyCAT config
// TODO: load experiment configuration from external json file via grunt task with optional arguments

var experimentGroups = [
  {
    "name": "Project 1",
    "sampleFiles": [
      {
        "name": "DEMO-Task-A",
        "internalName": "test_1-DEMO",
        "url": "data/word_level_qe_experiments/experiment_data/xliff/test_1.xliff",
        "configuration": {
          "target": {
            "services": {
              "useConstrainedDecoding": true,
              "useWordLevelQE": true
            },
            "activeComponent": "wordLevelQeEditor",
            "defaultComponent": "wordLevelQeEditor",
            "components": [
              {
                "directiveName": "wordLevelQeEditor",
                "textName": "wordLevelQeEditor"
              }
            ]
          }
        }
      },
      {
        "name": "BASIC-Task-A",
        "internalName": "test_1-BASIC",
        "url": "data/word_level_qe_experiments/experiment_data/xliff/test_1.xliff",
        "configuration": {
          "target": {
            "services": {
              "useConstrainedDecoding": false,
              "useWordLevelQE": false
            },
            "activeComponent": "wordLevelQeEditor",
            "defaultComponent": "wordLevelQeEditor",
            "components": [
              {
                "directiveName": "wordLevelQeEditor",
                "textName": "wordLevelQeEditor"
              }
            ]
          }
        }
      },
      {
        "name": "QE-Task-A",
        "internalName": "test_1-QE",
        "url": "data/word_level_qe_experiments/experiment_data/xliff/test_1.xliff",
        "configuration": {
          "target": {
            "services": {
              "useConstrainedDecoding": false,
              "useWordLevelQE": true
            },
            "activeComponent": "wordLevelQeEditor",
            "defaultComponent": "wordLevelQeEditor",
            "components": [
              {
                "directiveName": "wordLevelQeEditor",
                "textName": "wordLevelQeEditor"
              }
            ]
          }
        }
      },
      {
        "name": "CD-Task-A",
        "internalName": "test_1-CD",
        "url": "data/word_level_qe_experiments/experiment_data/xliff/test_1.xliff",
        "configuration": {
          "target": {
            "services": {
              "useConstrainedDecoding": true,
              "useWordLevelQE": false
            },
            "activeComponent": "wordLevelQeEditor",
            "defaultComponent": "wordLevelQeEditor",
            "components": [
              {
                "directiveName": "wordLevelQeEditor",
                "textName": "wordLevelQeEditor"
              }
            ]
          }
        }
      },
      {
        "name": "IPE-Task-A",
        "internalName": "test_1-IPE",
        "url": "data/word_level_qe_experiments/experiment_data/xliff/test_1.xliff",
        "configuration": {
          "target": {
            "services": {
              "useConstrainedDecoding": true,
              "useWordLevelQE": true
            },
            "activeComponent": "wordLevelQeEditor",
            "defaultComponent": "wordLevelQeEditor",
            "components": [
              {
                "directiveName": "wordLevelQeEditor",
                "textName": "wordLevelQeEditor"
              }
            ]
          }
        }
      }
    ]
  },
  {
    "name"       : "Project 2",
    "sampleFiles": [
      {
        "name"         : "DEMO-Task-B",
        "internalName" : "test_2-DEMO",
        "url"          : "data/word_level_qe_experiments/experiment_data/xliff/test_2.xliff",
        "configuration": {
          "target": {
            "services"        : {
              "useConstrainedDecoding": true,
              "useWordLevelQE"        : true
            },
            "activeComponent" : "wordLevelQeEditor",
            "defaultComponent": "wordLevelQeEditor",
            "components"      : [
              {
                "directiveName": "wordLevelQeEditor",
                "textName"     : "wordLevelQeEditor"
              }
            ]
          }
        }
      },
      {
        "name"         : "BASIC-Task-B",
        "internalName" : "test_2-BASIC",
        "url"          : "data/word_level_qe_experiments/experiment_data/xliff/test_2.xliff",
        "configuration": {
          "target": {
            "services"        : {
              "useConstrainedDecoding": false,
              "useWordLevelQE"        : false
            },
            "activeComponent" : "wordLevelQeEditor",
            "defaultComponent": "wordLevelQeEditor",
            "components"      : [
              {
                "directiveName": "wordLevelQeEditor",
                "textName"     : "wordLevelQeEditor"
              }
            ]
          }
        }
      },
      {
        "name"         : "QE-Task-B",
        "internalName" : "test_2-QE",
        "url"          : "data/word_level_qe_experiments/experiment_data/xliff/test_2.xliff",
        "configuration": {
          "target": {
            "services"        : {
              "useConstrainedDecoding": false,
              "useWordLevelQE"        : true
            },
            "activeComponent" : "wordLevelQeEditor",
            "defaultComponent": "wordLevelQeEditor",
            "components"      : [
              {
                "directiveName": "wordLevelQeEditor",
                "textName"     : "wordLevelQeEditor"
              }
            ]
          }
        }
      },
      {
        "name"         : "CD-Task-B",
        "internalName" : "test_2-CD",
        "url"          : "data/word_level_qe_experiments/experiment_data/xliff/test_2.xliff",
        "configuration": {
          "target": {
            "services"        : {
              "useConstrainedDecoding": true,
              "useWordLevelQE"        : false
            },
            "activeComponent" : "wordLevelQeEditor",
            "defaultComponent": "wordLevelQeEditor",
            "components"      : [
              {
                "directiveName": "wordLevelQeEditor",
                "textName"     : "wordLevelQeEditor"
              }
            ]
          }
        }
      },
      {
        "name"         : "IPE-Task-B",
        "internalName" : "test_2-IPE",
        "url"          : "data/word_level_qe_experiments/experiment_data/xliff/test_2.xliff",
        "configuration": {
          "target": {
            "services"        : {
              "useConstrainedDecoding": true,
              "useWordLevelQE"        : true
            },
            "activeComponent" : "wordLevelQeEditor",
            "defaultComponent": "wordLevelQeEditor",
            "components"      : [
              {
                "directiveName": "wordLevelQeEditor",
                "textName"     : "wordLevelQeEditor"
              }
            ]
          }
        }
      }
    ]
  },
  {
    "name"       : "Project 3",
    "sampleFiles": [
      {
        "name"         : "DEMO-Task-C",
        "internalName" : "test_3-DEMO",
        "url"          : "data/word_level_qe_experiments/experiment_data/xliff/test_3.xliff",
        "configuration": {
          "target": {
            "services"        : {
              "useConstrainedDecoding": true,
              "useWordLevelQE"        : true
            },
            "activeComponent" : "wordLevelQeEditor",
            "defaultComponent": "wordLevelQeEditor",
            "components"      : [
              {
                "directiveName": "wordLevelQeEditor",
                "textName"     : "wordLevelQeEditor"
              }
            ]
          }
        }
      },
      {
        "name"         : "BASIC-Task-C",
        "internalName" : "test_3-BASIC",
        "url"          : "data/word_level_qe_experiments/experiment_data/xliff/test_3.xliff",
        "configuration": {
          "target": {
            "services"        : {
              "useConstrainedDecoding": false,
              "useWordLevelQE"        : false
            },
            "activeComponent" : "wordLevelQeEditor",
            "defaultComponent": "wordLevelQeEditor",
            "components"      : [
              {
                "directiveName": "wordLevelQeEditor",
                "textName"     : "wordLevelQeEditor"
              }
            ]
          }
        }
      },
      {
        "name"         : "QE-Task-C",
        "internalName" : "test_3-QE",
        "url"          : "data/word_level_qe_experiments/experiment_data/xliff/test_3.xliff",
        "configuration": {
          "target": {
            "services"        : {
              "useConstrainedDecoding": false,
              "useWordLevelQE"        : true
            },
            "activeComponent" : "wordLevelQeEditor",
            "defaultComponent": "wordLevelQeEditor",
            "components"      : [
              {
                "directiveName": "wordLevelQeEditor",
                "textName"     : "wordLevelQeEditor"
              }
            ]
          }
        }
      },
      {
        "name"         : "CD-Task-C",
        "internalName" : "test_3-CD",
        "url"          : "data/word_level_qe_experiments/experiment_data/xliff/test_3.xliff",
        "configuration": {
          "target": {
            "services"        : {
              "useConstrainedDecoding": true,
              "useWordLevelQE"        : false
            },
            "activeComponent" : "wordLevelQeEditor",
            "defaultComponent": "wordLevelQeEditor",
            "components"      : [
              {
                "directiveName": "wordLevelQeEditor",
                "textName"     : "wordLevelQeEditor"
              }
            ]
          }
        }
      },
      {
        "name"         : "IPE-Task-C",
        "internalName" : "test_3-IPE",
        "url"          : "data/word_level_qe_experiments/experiment_data/xliff/test_3.xliff",
        "configuration": {
          "target": {
            "services"        : {
              "useConstrainedDecoding": true,
              "useWordLevelQE"        : true
            },
            "activeComponent" : "wordLevelQeEditor",
            "defaultComponent": "wordLevelQeEditor",
            "components"      : [
              {
                "directiveName": "wordLevelQeEditor",
                "textName"     : "wordLevelQeEditor"
              }
            ]
          }
        }
      }
    ]
  },
  {
    "name"       : "Project 4",
    "sampleFiles": [
      {
        "name"         : "DEMO-Task-D",
        "internalName" : "test_4-DEMO",
        "url"          : "data/word_level_qe_experiments/experiment_data/xliff/test_4.xliff",
        "configuration": {
          "target": {
            "services"        : {
              "useConstrainedDecoding": true,
              "useWordLevelQE"        : true
            },
            "activeComponent" : "wordLevelQeEditor",
            "defaultComponent": "wordLevelQeEditor",
            "components"      : [
              {
                "directiveName": "wordLevelQeEditor",
                "textName"     : "wordLevelQeEditor"
              }
            ]
          }
        }
      },
      {
        "name"         : "BASIC-Task-D",
        "internalName" : "test_4-BASIC",
        "url"          : "data/word_level_qe_experiments/experiment_data/xliff/test_4.xliff",
        "configuration": {
          "target": {
            "services"        : {
              "useConstrainedDecoding": false,
              "useWordLevelQE"        : false
            },
            "activeComponent" : "wordLevelQeEditor",
            "defaultComponent": "wordLevelQeEditor",
            "components"      : [
              {
                "directiveName": "wordLevelQeEditor",
                "textName"     : "wordLevelQeEditor"
              }
            ]
          }
        }
      },
      {
        "name"         : "QE-Task-D",
        "internalName" : "test_4-QE",
        "url"          : "data/word_level_qe_experiments/experiment_data/xliff/test_4.xliff",
        "configuration": {
          "target": {
            "services"        : {
              "useConstrainedDecoding": false,
              "useWordLevelQE"        : true
            },
            "activeComponent" : "wordLevelQeEditor",
            "defaultComponent": "wordLevelQeEditor",
            "components"      : [
              {
                "directiveName": "wordLevelQeEditor",
                "textName"     : "wordLevelQeEditor"
              }
            ]
          }
        }
      },
      {
        "name"         : "CD-Task-D",
        "internalName" : "test_4-CD",
        "url"          : "data/word_level_qe_experiments/experiment_data/xliff/test_4.xliff",
        "configuration": {
          "target": {
            "services"        : {
              "useConstrainedDecoding": true,
              "useWordLevelQE"        : false
            },
            "activeComponent" : "wordLevelQeEditor",
            "defaultComponent": "wordLevelQeEditor",
            "components"      : [
              {
                "directiveName": "wordLevelQeEditor",
                "textName"     : "wordLevelQeEditor"
              }
            ]
          }
        }
      },
      {
        "name"         : "IPE-Task-D",
        "internalName" : "test_4-IPE",
        "url"          : "data/word_level_qe_experiments/experiment_data/xliff/test_4.xliff",
        "configuration": {
          "target": {
            "services"        : {
              "useConstrainedDecoding": true,
              "useWordLevelQE"        : true
            },
            "activeComponent" : "wordLevelQeEditor",
            "defaultComponent": "wordLevelQeEditor",
            "components"      : [
              {
                "directiveName": "wordLevelQeEditor",
                "textName"     : "wordLevelQeEditor"
              }
            ]
          }
        }
      }
    ]
  },
  {
    "name": "Project 0",
    "sampleFiles": [
      {
        "name": "DEMO-Task-E",
        "internalName": "test_0-DEMO",
        "url": "data/word_level_qe_experiments/experiment_data/xliff/test_0.xliff",
        "configuration": {
          "target": {
            "services": {
              "useConstrainedDecoding": true,
              "useWordLevelQE": true
            },
            "activeComponent": "wordLevelQeEditor",
            "defaultComponent": "wordLevelQeEditor",
            "components": [
              {
                "directiveName": "wordLevelQeEditor",
                "textName": "wordLevelQeEditor"
              }
            ]
          }
        }
      },
      {
        "name": "BASIC-Task-E",
        "internalName": "test_0-BASIC",
        "url": "data/word_level_qe_experiments/experiment_data/xliff/test_0.xliff",
        "configuration": {
          "target": {
            "services": {
              "useConstrainedDecoding": false,
              "useWordLevelQE": false
            },
            "activeComponent": "wordLevelQeEditor",
            "defaultComponent": "wordLevelQeEditor",
            "components": [
              {
                "directiveName": "wordLevelQeEditor",
                "textName": "wordLevelQeEditor"
              }
            ]
          }
        }
      },
      {
        "name": "QE-Task-E",
        "internalName": "test_0-QE",
        "url": "data/word_level_qe_experiments/experiment_data/xliff/test_0.xliff",
        "configuration": {
          "target": {
            "services": {
              "useConstrainedDecoding": false,
              "useWordLevelQE": true
            },
            "activeComponent": "wordLevelQeEditor",
            "defaultComponent": "wordLevelQeEditor",
            "components": [
              {
                "directiveName": "wordLevelQeEditor",
                "textName": "wordLevelQeEditor"
              }
            ]
          }
        }
      },
      {
        "name": "CD-Task-E",
        "internalName": "test_0-CD",
        "url": "data/word_level_qe_experiments/experiment_data/xliff/test_0.xliff",
        "configuration": {
          "target": {
            "services": {
              "useConstrainedDecoding": true,
              "useWordLevelQE": false
            },
            "activeComponent": "wordLevelQeEditor",
            "defaultComponent": "wordLevelQeEditor",
            "components": [
              {
                "directiveName": "wordLevelQeEditor",
                "textName": "wordLevelQeEditor"
              }
            ]
          }
        }
      },
      {
        "name": "IPE-Task-E",
        "internalName": "test_0-IPE",
        "url": "data/word_level_qe_experiments/experiment_data/xliff/test_0.xliff",
        "configuration": {
          "target": {
            "services": {
              "useConstrainedDecoding": true,
              "useWordLevelQE": true
            },
            "activeComponent": "wordLevelQeEditor",
            "defaultComponent": "wordLevelQeEditor",
            "components": [
              {
                "directiveName": "wordLevelQeEditor",
                "textName": "wordLevelQeEditor"
              }
            ]
          }
        }
      }
    ]
  }
]


// TODO: Interactive PE experiment configurations
// var experimentGroups = [
//   {
//     "name": "Interactive Post-Editing User Study",
//     "sampleFiles": [
//       {
//         "name": "Practice Project -- Basic",
//         "internalName": "project_0_basic",
//         "url": "data/word_level_qe_experiments/experiment_data/xliff/test_0.xliff",
//         "configuration": {
//           "target": {
//             "services": {
//               "useConstrainedDecoding": false,
//               "useWordLevelQE": false,
//             },
//             "activeComponent": "wordLevelQeEditor",
//             "defaultComponent": "wordLevelQeEditor",
//             "components": [
//               {
//                 "directiveName": "wordLevelQeEditor",
//                 "textName": "wordLevelQeEditor",
//               },
//             ]
//           },
//         }
//       },
//       {
//         "name": "Practice Project -- QE",
//         "internalName": "project_0_qe",
//         "url": "data/word_level_qe_experiments/experiment_data/xliff/test_0.xliff",
//         "configuration": {
//           "target": {
//             "services": {
//               "useConstrainedDecoding": false,
//               "useWordLevelQE": true,
//             },
//             "activeComponent": "wordLevelQeEditor",
//             "defaultComponent": "wordLevelQeEditor",
//             "components": [
//               {
//                 "directiveName": "wordLevelQeEditor",
//                 "textName": "wordLevelQeEditor",
//               },
//             ]
//           },
//         }
//       },
//       {
//         "name": "Practice Project -- CD",
//         "internalName": "project_0_cd",
//         "url": "data/word_level_qe_experiments/experiment_data/xliff/test_0.xliff",
//         "configuration": {
//           "target": {
//             "services": {
//               "useConstrainedDecoding": true,
//               "useWordLevelQE": false,
//             },
//             "activeComponent": "wordLevelQeEditor",
//             "defaultComponent": "wordLevelQeEditor",
//             "components": [
//               {
//                 "directiveName": "wordLevelQeEditor",
//                 "textName": "wordLevelQeEditor",
//               },
//             ]
//           },
//         }
//       },
//       {
//         "name": "Practice Project -- IPE",
//         "internalName": "project_0_ipe",
//         "url": "data/word_level_qe_experiments/experiment_data/xliff/test_0.xliff",
//         "configuration": {
//           "target": {
//             "services": {
//               "useConstrainedDecoding": true,
//               "useWordLevelQE": true,
//             },
//             "activeComponent": "wordLevelQeEditor",
//             "defaultComponent": "wordLevelQeEditor",
//             "components": [
//               {
//                 "directiveName": "wordLevelQeEditor",
//                 "textName": "wordLevelQeEditor",
//               },
//             ]
//           },
//         }
//       },
//       {
//         "name": "Project 1",
//         "internalName": "project_1",
//         "url": "data/word_level_qe_experiments/experiment_data/xliff/test_1.xliff",
//         "configuration": {
//           "target": {
//             "services": {
//               "useConstrainedDecoding": false,
//               "useWordLevelQE": false,
//             },
//             "activeComponent": "wordLevelQeEditor",
//             "defaultComponent": "wordLevelQeEditor",
//             "components": [
//               {
//                 "directiveName": "wordLevelQeEditor",
//                 "textName": "wordLevelQeEditor",
//               },
//             ]
//           },
//         }
//       },
//       {
//         "name": "Project 2",
//         "internalName": "project_2",
//         "url": "data/word_level_qe_experiments/experiment_data/xliff/test_2.xliff",
//         "configuration": {
//           "target": {
//             "services": {
//               "useConstrainedDecoding": false,
//               "useWordLevelQE": true,
//             },
//             "activeComponent": "wordLevelQeEditor",
//             "defaultComponent": "wordLevelQeEditor",
//             "components": [
//               {
//                 "directiveName": "wordLevelQeEditor",
//                 "textName": "wordLevelQeEditor",
//               },
//             ]
//           },
//         }
//       },
//       {
//         "name": "Project 3",
//         "internalName": "project_3",
//         "url": "data/word_level_qe_experiments/experiment_data/xliff/test_3.xliff",
//         "configuration": {
//           "target": {
//             "services": {
//               "useConstrainedDecoding": true,
//               "useWordLevelQE": false,
//             },
//             "activeComponent": "wordLevelQeEditor",
//             "defaultComponent": "wordLevelQeEditor",
//             "components": [
//               {
//                 "directiveName": "wordLevelQeEditor",
//                 "textName": "wordLevelQeEditor",
//               },
//             ]
//           },
//         }
//       },
//       {
//         "name": "Project 4",
//         "internalName": "project_4",
//         "url": "data/word_level_qe_experiments/experiment_data/xliff/test_4.xliff",
//         "configuration": {
//           "target": {
//             "services": {
//               "useConstrainedDecoding": true,
//               "useWordLevelQE": true,
//             },
//             "activeComponent": "wordLevelQeEditor",
//             "defaultComponent": "wordLevelQeEditor",
//             "components": [
//               {
//                 "directiveName": "wordLevelQeEditor",
//                 "textName": "wordLevelQeEditor",
//               },
//             ]
//           },
//         }
//       }
//     ]
//   },
// ]

handyCATconfig.constant('experimentGroups', experimentGroups)

