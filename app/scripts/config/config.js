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
      activeComponent: 'plaintextEditor',
      defaultComponent: 'plaintextEditor',
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
        "name": "Test EN-DE Word Level QE",
        "sampleFiles": [
            {
                "name": "Test EN-DE Word Level QE",
                "internalName": "wl-qe-test",
                "url": "data/word_level_qe_experiments/sample_data/sample_qe.xliff",
                "configuration": {
                    "project": {
                        "useConstrainedDecoding": false,
                        "useWordLevelQE": false,
                    },
                    "target": {
                        "activeComponent": "wordLevelQeEditor",
                        "defaultComponent": "wordLevelQeEditor",
                        "components": [
                            {
                                "directiveName": "plaintextEditor",
                                "textName": "plaintextEditor"
                            },
                            {
                                "directiveName": "wordLevelQeEditor",
                                "textName": "wordLevelQeEditor"
                            },
                            // {
                            //     "directiveName": "postEditor",
                            //     "textName": "postEditor"
                            // }
                        ]
                    },
                }
            }
        ]
    },
    {
        "name": "Test Word Level QE",
        "sampleFiles": [
            {
                "name": "Test Word Level QE",
                "internalName": "wl-qe-test",
                "url": "data/qe_score_experiments/documents/PRJ0.xliff",
                "configuration": {
                    "project": {
                      "useConstrainedDecoding": false,
                      "useWordLevelQE": false,
                    },
                    "target": {
                        "activeComponent": "wordLevelQeEditor",
                        "defaultComponent": "wordLevelQeEditor",
                        "components": [
                          {
                            "directiveName": "plaintextEditor",
                            "textName": "plaintextEditor"
                          },
                          {
                              "directiveName": "wordLevelQeEditor",
                              "textName": "wordLevelQeEditor"
                          },
                          // {
                          //     "directiveName": "postEditor",
                          //     "textName": "postEditor"
                          // }
                        ]
                    },
                    "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
                    "tsvData": [],
                    "qeScoreConfig": {
                        "scoreIndex": 0
                    }
                }
            }
        ]
    },
    {
      "name": "Translator 1",
      "sampleFiles": [
        {
          "name": "Translator 1 | Task 1 | PRJ0",
          "internalName": "PRJ0",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          }
        },
        {
          "name": "Translator 1 | Task 2 | PRJ1",
          "internalName": "PRJ1",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          }
        },
        {
          "name": "Translator 1 | Task 3 | PRJ2",
          "internalName": "PRJ2",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          }
        },
        {
          "name": "Translator 1 | Task 4 | PRJ3",
          "internalName": "PRJ3",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          }
        }
      ]
    },
    {
      "name": "Translator 2",
      "sampleFiles": [
        {
          "name": "Translator 2 | Task 1 | PRJ1",
          "internalName": "PRJ1",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          }
        },
        {
          "name": "Translator 2 | Task 2 | PRJ2",
          "internalName": "PRJ2",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          }
        },
        {
          "name": "Translator 2 | Task 3 | PRJ3",
          "internalName": "PRJ3",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          }
        },
        {
          "name": "Translator 2 | Task 4 | PRJ0",
          "internalName": "PRJ0",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          }
        }
      ]
    },
    {
      "name": "Translator 3",
      "sampleFiles": [
        {
          "name": "Translator 3 | Task 1 | PRJ2",
          "internalName": "PRJ2",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          }
        },
        {
          "name": "Translator 3 | Task 2 | PRJ3",
          "internalName": "PRJ3",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          }
        },
        {
          "name": "Translator 3 | Task 3 | PRJ0",
          "internalName": "PRJ0",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          }
        },
        {
          "name": "Translator 3 | Task 4 | PRJ1",
          "internalName": "PRJ1",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          }
        }
      ]
    },
    {
      "name": "Translator 4",
      "sampleFiles": [
        {
          "name": "Translator 4 | Task 1 | PRJ3",
          "internalName": "PRJ3",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          }
        },
        {
          "name": "Translator 4 | Task 2 | PRJ0",
          "internalName": "PRJ0",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          }
        },
        {
          "name": "Translator 4 | Task 3 | PRJ1",
          "internalName": "PRJ1",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          }
        },
        {
          "name": "Translator 4 | Task 4 | PRJ2",
          "internalName": "PRJ2",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          }
        }
      ]
    },
    {
      "name": "Translator 5",
      "sampleFiles": [
        {
          "name": "Translator 5 | Task 1 | PRJ1",
          "internalName": "PRJ1",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          }
        },
        {
          "name": "Translator 5 | Task 2 | PRJ2",
          "internalName": "PRJ2",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          }
        },
        {
          "name": "Translator 5 | Task 3 | PRJ3",
          "internalName": "PRJ3",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          }
        },
        {
          "name": "Translator 5 | Task 4 | PRJ0",
          "internalName": "PRJ0",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          }
        }
      ]
    },
    {
      "name": "Translator 6",
      "sampleFiles": [
        {
          "name": "Translator 6 | Task 1 | PRJ0",
          "internalName": "PRJ0",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          }
        },
        {
          "name": "Translator 6 | Task 2 | PRJ1",
          "internalName": "PRJ1",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          }
        },
        {
          "name": "Translator 6 | Task 3 | PRJ2",
          "internalName": "PRJ2",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          }
        },
        {
          "name": "Translator 6 | Task 4 | PRJ3",
          "internalName": "PRJ3",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          }
        }
      ]
    },
    {
      "name": "Translator 7",
      "sampleFiles": [
        {
          "name": "Translator 7 | Task 1 | PRJ1",
          "internalName": "PRJ1",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          }
        },
        {
          "name": "Translator 7 | Task 2 | PRJ2",
          "internalName": "PRJ2",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          }
        },
        {
          "name": "Translator 7 | Task 3 | PRJ3",
          "internalName": "PRJ3",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          }
        },
        {
          "name": "Translator 7 | Task 4 | PRJ0",
          "internalName": "PRJ0",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          }
        }
      ]
    },
    {
      "name": "Translator 8",
      "sampleFiles": [
        {
          "name": "Translator 8 | Task 1 | PRJ2",
          "internalName": "PRJ2",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          }
        },
        {
          "name": "Translator 8 | Task 2 | PRJ3",
          "internalName": "PRJ3",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          }
        },
        {
          "name": "Translator 8 | Task 3 | PRJ0",
          "internalName": "PRJ0",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          }
        },
        {
          "name": "Translator 8 | Task 4 | PRJ1",
          "internalName": "PRJ1",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          }
        }
      ]
    },
    {
      "name": "Translator 9",
      "sampleFiles": [
        {
          "name": "Translator 9 | Task 1 | PRJ3",
          "internalName": "PRJ3",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          }
        },
        {
          "name": "Translator 9 | Task 2 | PRJ0",
          "internalName": "PRJ0",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          }
        },
        {
          "name": "Translator 9 | Task 3 | PRJ1",
          "internalName": "PRJ1",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          }
        },
        {
          "name": "Translator 9 | Task 4 | PRJ2",
          "internalName": "PRJ2",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          }
        }
      ]
    },
    {
      "name": "Translator 10",
      "sampleFiles": [
        {
          "name": "Translator 10 | Task 1 | PRJ2",
          "internalName": "PRJ2",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          }
        },
        {
          "name": "Translator 10 | Task 2 | PRJ3",
          "internalName": "PRJ3",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          }
        },
        {
          "name": "Translator 10 | Task 3 | PRJ0",
          "internalName": "PRJ0",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          }
        },
        {
          "name": "Translator 10 | Task 4 | PRJ1",
          "internalName": "PRJ1",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          }
        }
      ]
    },
    {
      "name": "Translator 11",
      "sampleFiles": [
        {
          "name": "Translator 11 | Task 1 | PRJ0",
          "internalName": "PRJ0",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          }
        },
        {
          "name": "Translator 11 | Task 2 | PRJ1",
          "internalName": "PRJ1",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          }
        },
        {
          "name": "Translator 11 | Task 3 | PRJ2",
          "internalName": "PRJ2",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          }
        },
        {
          "name": "Translator 11 | Task 4 | PRJ3",
          "internalName": "PRJ3",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          }
        }
      ]
    },
    {
      "name": "Translator 12",
      "sampleFiles": [
        {
          "name": "Translator 12 | Task 1 | PRJ1",
          "internalName": "PRJ1",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          }
        },
        {
          "name": "Translator 12 | Task 2 | PRJ2",
          "internalName": "PRJ2",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          }
        },
        {
          "name": "Translator 12 | Task 3 | PRJ3",
          "internalName": "PRJ3",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          }
        },
        {
          "name": "Translator 12 | Task 4 | PRJ0",
          "internalName": "PRJ0",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          }
        }
      ]
    },
    {
      "name": "Translator 13",
      "sampleFiles": [
        {
          "name": "Translator 13 | Task 1 | PRJ2",
          "internalName": "PRJ2",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          }
        },
        {
          "name": "Translator 13 | Task 2 | PRJ3",
          "internalName": "PRJ3",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          }
        },
        {
          "name": "Translator 13 | Task 3 | PRJ0",
          "internalName": "PRJ0",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          }
        },
        {
          "name": "Translator 13 | Task 4 | PRJ1",
          "internalName": "PRJ1",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          }
        }
      ]
    },
    {
      "name": "Translator 14",
      "sampleFiles": [
        {
          "name": "Translator 14 | Task 1 | PRJ3",
          "internalName": "PRJ3",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          }
        },
        {
          "name": "Translator 14 | Task 2 | PRJ0",
          "internalName": "PRJ0",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          }
        },
        {
          "name": "Translator 14 | Task 3 | PRJ1",
          "internalName": "PRJ1",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          }
        },
        {
          "name": "Translator 14 | Task 4 | PRJ2",
          "internalName": "PRJ2",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          }
        }
      ]
    },
    {
      "name": "Translator 15",
      "sampleFiles": [
        {
          "name": "Translator 15 | Task 1 | PRJ0",
          "internalName": "PRJ0",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          }
        },
        {
          "name": "Translator 15 | Task 2 | PRJ1",
          "internalName": "PRJ1",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          }
        },
        {
          "name": "Translator 15 | Task 3 | PRJ2",
          "internalName": "PRJ2",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          }
        },
        {
          "name": "Translator 15 | Task 4 | PRJ3",
          "internalName": "PRJ3",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          }
        }
      ]
    },
    {
      "name": "Translator 16",
      "sampleFiles": [
        {
          "name": "Translator 16 | Task 1 | PRJ0",
          "internalName": "PRJ0",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          }
        },
        {
          "name": "Translator 16 | Task 2 | PRJ1",
          "internalName": "PRJ1",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          }
        },
        {
          "name": "Translator 16 | Task 3 | PRJ2",
          "internalName": "PRJ2",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          }
        },
        {
          "name": "Translator 16 | Task 4 | PRJ3",
          "internalName": "PRJ3",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          }
        }
      ]
    },
    {
      "name": "Translator 17",
      "sampleFiles": [
        {
          "name": "Translator 17 | Task 1 | PRJ1",
          "internalName": "PRJ1",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          }
        },
        {
          "name": "Translator 17 | Task 2 | PRJ2",
          "internalName": "PRJ2",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          }
        },
        {
          "name": "Translator 17 | Task 3 | PRJ3",
          "internalName": "PRJ3",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          }
        },
        {
          "name": "Translator 17 | Task 4 | PRJ0",
          "internalName": "PRJ0",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          }
        }
      ]
    },
    {
      "name": "Translator 18",
      "sampleFiles": [
        {
          "name": "Translator 18 | Task 1 | PRJ2",
          "internalName": "PRJ2",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          }
        },
        {
          "name": "Translator 18 | Task 2 | PRJ3",
          "internalName": "PRJ3",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          }
        },
        {
          "name": "Translator 18 | Task 3 | PRJ0",
          "internalName": "PRJ0",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          }
        },
        {
          "name": "Translator 18 | Task 4 | PRJ1",
          "internalName": "PRJ1",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          }
        }
      ]
    },
    {
      "name": "Translator 19",
      "sampleFiles": [
        {
          "name": "Translator 19 | Task 1 | PRJ3",
          "internalName": "PRJ3",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          }
        },
        {
          "name": "Translator 19 | Task 2 | PRJ0",
          "internalName": "PRJ0",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          }
        },
        {
          "name": "Translator 19 | Task 3 | PRJ1",
          "internalName": "PRJ1",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          }
        },
        {
          "name": "Translator 19 | Task 4 | PRJ2",
          "internalName": "PRJ2",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          }
        }
      ]
    },
    {
      "name": "Translator 20",
      "sampleFiles": [
        {
          "name": "Translator 20 | Task 1 | PRJ1",
          "internalName": "PRJ1",
          "url": "data/qe_score_experiments/documents/PRJ1.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE0",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 0
            }
          }
        },
        {
          "name": "Translator 20 | Task 2 | PRJ2",
          "internalName": "PRJ2",
          "url": "data/qe_score_experiments/documents/PRJ2.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE1",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 1
            }
          }
        },
        {
          "name": "Translator 20 | Task 3 | PRJ3",
          "internalName": "PRJ3",
          "url": "data/qe_score_experiments/documents/PRJ3.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE2",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 2
            }
          }
        },
        {
          "name": "Translator 20 | Task 4 | PRJ0",
          "internalName": "PRJ0",
          "url": "data/qe_score_experiments/documents/PRJ0.xliff",
          "configuration": {
            "target": {
              "activeComponent": "plaintextEditor",
              "defaultComponent": "plaintextEditor",
              "components": {
                "directiveName": "plaintextEditor",
                "textName": "plaintextEditor"
              }
            },
            "tsvUrl": "data/qe_score_experiments/documents/score_tsvs/QE3",
            "tsvData": [],
            "qeScoreConfig": {
              "scoreIndex": 3
            }
          }
        }
      ]
    }
  ]
handyCATconfig.constant('experimentGroups', experimentGroups)

