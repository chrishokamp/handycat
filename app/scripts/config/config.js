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
      "name": "Translator 1",
      "sampleFiles": [
        {
          "name": "Translator 1: task: 0 project name: PRJ0",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          },
          "internal_name": "PRJ0"
        },
        {
          "name": "Translator 1: task: 1 project name: PRJ1",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          },
          "internal_name": "PRJ1"
        },
        {
          "name": "Translator 1: task: 2 project name: PRJ2",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          },
          "internal_name": "PRJ2"
        },
        {
          "name": "Translator 1: task: 3 project name: PRJ3",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          },
          "internal_name": "PRJ3"
        }
      ]
    },
    {
      "name": "Translator 2",
      "sampleFiles": [
        {
          "name": "Translator 2: task: 0 project name: PRJ1",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          },
          "internal_name": "PRJ1"
        },
        {
          "name": "Translator 2: task: 1 project name: PRJ2",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          },
          "internal_name": "PRJ2"
        },
        {
          "name": "Translator 2: task: 2 project name: PRJ3",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          },
          "internal_name": "PRJ3"
        },
        {
          "name": "Translator 2: task: 3 project name: PRJ0",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          },
          "internal_name": "PRJ0"
        }
      ]
    },
    {
      "name": "Translator 3",
      "sampleFiles": [
        {
          "name": "Translator 3: task: 0 project name: PRJ2",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          },
          "internal_name": "PRJ2"
        },
        {
          "name": "Translator 3: task: 1 project name: PRJ3",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          },
          "internal_name": "PRJ3"
        },
        {
          "name": "Translator 3: task: 2 project name: PRJ0",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          },
          "internal_name": "PRJ0"
        },
        {
          "name": "Translator 3: task: 3 project name: PRJ1",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          },
          "internal_name": "PRJ1"
        }
      ]
    },
    {
      "name": "Translator 4",
      "sampleFiles": [
        {
          "name": "Translator 4: task: 0 project name: PRJ3",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          },
          "internal_name": "PRJ3"
        },
        {
          "name": "Translator 4: task: 1 project name: PRJ0",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          },
          "internal_name": "PRJ0"
        },
        {
          "name": "Translator 4: task: 2 project name: PRJ1",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          },
          "internal_name": "PRJ1"
        },
        {
          "name": "Translator 4: task: 3 project name: PRJ2",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          },
          "internal_name": "PRJ2"
        }
      ]
    },
    {
      "name": "Translator 5",
      "sampleFiles": [
        {
          "name": "Translator 5: task: 0 project name: PRJ1",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          },
          "internal_name": "PRJ1"
        },
        {
          "name": "Translator 5: task: 1 project name: PRJ2",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          },
          "internal_name": "PRJ2"
        },
        {
          "name": "Translator 5: task: 2 project name: PRJ3",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          },
          "internal_name": "PRJ3"
        },
        {
          "name": "Translator 5: task: 3 project name: PRJ0",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          },
          "internal_name": "PRJ0"
        }
      ]
    },
    {
      "name": "Translator 6",
      "sampleFiles": [
        {
          "name": "Translator 6: task: 0 project name: PRJ0",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          },
          "internal_name": "PRJ0"
        },
        {
          "name": "Translator 6: task: 1 project name: PRJ1",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          },
          "internal_name": "PRJ1"
        },
        {
          "name": "Translator 6: task: 2 project name: PRJ2",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          },
          "internal_name": "PRJ2"
        },
        {
          "name": "Translator 6: task: 3 project name: PRJ3",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          },
          "internal_name": "PRJ3"
        }
      ]
    },
    {
      "name": "Translator 7",
      "sampleFiles": [
        {
          "name": "Translator 7: task: 0 project name: PRJ1",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          },
          "internal_name": "PRJ1"
        },
        {
          "name": "Translator 7: task: 1 project name: PRJ2",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          },
          "internal_name": "PRJ2"
        },
        {
          "name": "Translator 7: task: 2 project name: PRJ3",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          },
          "internal_name": "PRJ3"
        },
        {
          "name": "Translator 7: task: 3 project name: PRJ0",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          },
          "internal_name": "PRJ0"
        }
      ]
    },
    {
      "name": "Translator 8",
      "sampleFiles": [
        {
          "name": "Translator 8: task: 0 project name: PRJ2",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          },
          "internal_name": "PRJ2"
        },
        {
          "name": "Translator 8: task: 1 project name: PRJ3",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          },
          "internal_name": "PRJ3"
        },
        {
          "name": "Translator 8: task: 2 project name: PRJ0",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          },
          "internal_name": "PRJ0"
        },
        {
          "name": "Translator 8: task: 3 project name: PRJ1",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          },
          "internal_name": "PRJ1"
        }
      ]
    },
    {
      "name": "Translator 9",
      "sampleFiles": [
        {
          "name": "Translator 9: task: 0 project name: PRJ3",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          },
          "internal_name": "PRJ3"
        },
        {
          "name": "Translator 9: task: 1 project name: PRJ0",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          },
          "internal_name": "PRJ0"
        },
        {
          "name": "Translator 9: task: 2 project name: PRJ1",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          },
          "internal_name": "PRJ1"
        },
        {
          "name": "Translator 9: task: 3 project name: PRJ2",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          },
          "internal_name": "PRJ2"
        }
      ]
    },
    {
      "name": "Translator 10",
      "sampleFiles": [
        {
          "name": "Translator 10: task: 0 project name: PRJ2",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          },
          "internal_name": "PRJ2"
        },
        {
          "name": "Translator 10: task: 1 project name: PRJ3",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          },
          "internal_name": "PRJ3"
        },
        {
          "name": "Translator 10: task: 2 project name: PRJ0",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          },
          "internal_name": "PRJ0"
        },
        {
          "name": "Translator 10: task: 3 project name: PRJ1",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          },
          "internal_name": "PRJ1"
        }
      ]
    },
    {
      "name": "Translator 11",
      "sampleFiles": [
        {
          "name": "Translator 11: task: 0 project name: PRJ0",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          },
          "internal_name": "PRJ0"
        },
        {
          "name": "Translator 11: task: 1 project name: PRJ1",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          },
          "internal_name": "PRJ1"
        },
        {
          "name": "Translator 11: task: 2 project name: PRJ2",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          },
          "internal_name": "PRJ2"
        },
        {
          "name": "Translator 11: task: 3 project name: PRJ3",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          },
          "internal_name": "PRJ3"
        }
      ]
    },
    {
      "name": "Translator 12",
      "sampleFiles": [
        {
          "name": "Translator 12: task: 0 project name: PRJ1",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          },
          "internal_name": "PRJ1"
        },
        {
          "name": "Translator 12: task: 1 project name: PRJ2",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          },
          "internal_name": "PRJ2"
        },
        {
          "name": "Translator 12: task: 2 project name: PRJ3",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          },
          "internal_name": "PRJ3"
        },
        {
          "name": "Translator 12: task: 3 project name: PRJ0",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          },
          "internal_name": "PRJ0"
        }
      ]
    },
    {
      "name": "Translator 13",
      "sampleFiles": [
        {
          "name": "Translator 13: task: 0 project name: PRJ2",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          },
          "internal_name": "PRJ2"
        },
        {
          "name": "Translator 13: task: 1 project name: PRJ3",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          },
          "internal_name": "PRJ3"
        },
        {
          "name": "Translator 13: task: 2 project name: PRJ0",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          },
          "internal_name": "PRJ0"
        },
        {
          "name": "Translator 13: task: 3 project name: PRJ1",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          },
          "internal_name": "PRJ1"
        }
      ]
    },
    {
      "name": "Translator 14",
      "sampleFiles": [
        {
          "name": "Translator 14: task: 0 project name: PRJ3",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          },
          "internal_name": "PRJ3"
        },
        {
          "name": "Translator 14: task: 1 project name: PRJ0",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          },
          "internal_name": "PRJ0"
        },
        {
          "name": "Translator 14: task: 2 project name: PRJ1",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          },
          "internal_name": "PRJ1"
        },
        {
          "name": "Translator 14: task: 3 project name: PRJ2",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          },
          "internal_name": "PRJ2"
        }
      ]
    },
    {
      "name": "Translator 15",
      "sampleFiles": [
        {
          "name": "Translator 15: task: 0 project name: PRJ0",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          },
          "internal_name": "PRJ0"
        },
        {
          "name": "Translator 15: task: 1 project name: PRJ1",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          },
          "internal_name": "PRJ1"
        },
        {
          "name": "Translator 15: task: 2 project name: PRJ2",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          },
          "internal_name": "PRJ2"
        },
        {
          "name": "Translator 15: task: 3 project name: PRJ3",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          },
          "internal_name": "PRJ3"
        }
      ]
    },
    {
      "name": "Translator 16",
      "sampleFiles": [
        {
          "name": "Translator 16: task: 0 project name: PRJ0",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          },
          "internal_name": "PRJ0"
        },
        {
          "name": "Translator 16: task: 1 project name: PRJ1",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          },
          "internal_name": "PRJ1"
        },
        {
          "name": "Translator 16: task: 2 project name: PRJ2",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          },
          "internal_name": "PRJ2"
        },
        {
          "name": "Translator 16: task: 3 project name: PRJ3",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          },
          "internal_name": "PRJ3"
        }
      ]
    },
    {
      "name": "Translator 17",
      "sampleFiles": [
        {
          "name": "Translator 17: task: 0 project name: PRJ1",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          },
          "internal_name": "PRJ1"
        },
        {
          "name": "Translator 17: task: 1 project name: PRJ2",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          },
          "internal_name": "PRJ2"
        },
        {
          "name": "Translator 17: task: 2 project name: PRJ3",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          },
          "internal_name": "PRJ3"
        },
        {
          "name": "Translator 17: task: 3 project name: PRJ0",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          },
          "internal_name": "PRJ0"
        }
      ]
    },
    {
      "name": "Translator 18",
      "sampleFiles": [
        {
          "name": "Translator 18: task: 0 project name: PRJ2",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          },
          "internal_name": "PRJ2"
        },
        {
          "name": "Translator 18: task: 1 project name: PRJ3",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          },
          "internal_name": "PRJ3"
        },
        {
          "name": "Translator 18: task: 2 project name: PRJ0",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          },
          "internal_name": "PRJ0"
        },
        {
          "name": "Translator 18: task: 3 project name: PRJ1",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          },
          "internal_name": "PRJ1"
        }
      ]
    },
    {
      "name": "Translator 19",
      "sampleFiles": [
        {
          "name": "Translator 19: task: 0 project name: PRJ3",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          },
          "internal_name": "PRJ3"
        },
        {
          "name": "Translator 19: task: 1 project name: PRJ0",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          },
          "internal_name": "PRJ0"
        },
        {
          "name": "Translator 19: task: 2 project name: PRJ1",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          },
          "internal_name": "PRJ1"
        },
        {
          "name": "Translator 19: task: 3 project name: PRJ2",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          },
          "internal_name": "PRJ2"
        }
      ]
    },
    {
      "name": "Translator 20",
      "sampleFiles": [
        {
          "name": "Translator 20: task: 0 project name: PRJ1",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          },
          "internal_name": "PRJ1"
        },
        {
          "name": "Translator 20: task: 1 project name: PRJ2",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          },
          "internal_name": "PRJ2"
        },
        {
          "name": "Translator 20: task: 2 project name: PRJ3",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          },
          "internal_name": "PRJ3"
        },
        {
          "name": "Translator 20: task: 3 project name: PRJ0",
          "internalName": "",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "typeaheadEditor",
              "defaultComponent": "typeaheadEditor",
              "components": {
                "directiveName": "typeaheadEditor",
                "textName": "typeaheadEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          },
          "internal_name": "PRJ0"
        }
      ]
    }
  ]
handyCATconfig.constant('experimentGroups', experimentGroups)

