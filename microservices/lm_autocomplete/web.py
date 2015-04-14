from flask import Flask, jsonify, request
from flask.ext.cors import CORS
from lm_autocomplete.srilm_language_model_autocompleter import SrilmLanguageModelAutocompleter
from lm_autocomplete.prefix_language_model_autocompleter import PrefixLanguageModelAutocompleter
from nltk.tokenize import wordpunct_tokenize

app = Flask(__name__)
CORS(app, allow_headers='Content-Type')
tokenizer = wordpunct_tokenize

# TODO: what is the correct way to namespace global objects in Flask?
#available_lms = yaml.load config
from lm_autocomplete.phrase_table.parsers.moses_triple_pipe_parser import MosesTriplePipeParser
from lm_autocomplete.phrase_table.in_memory_phrase_table import InMemoryPhraseTable

phrase_table_file = '/home/chris/projects/maxent_decoder/phrase_table/filtered_phrase_table'
parser = MosesTriplePipeParser()
phrase_objects = parser.parse(phrase_table_file)

pt_cutoff = 5
max_source_len = 3
de_en_phrase_table = InMemoryPhraseTable(phrase_objects, cutoff=pt_cutoff, max_source_len=max_source_len)

# WORKING - test usage of the lm autocomplete lib
from lm_autocomplete.prefix_language_model_autocompleter import PrefixLanguageModelAutocompleter

# language_models are [{'lang_code': <lang_code>, 'srilm_lm_file': <srilm_lm_file>,
# 'phrase_tables': {(source_lang, target_lang): phrase_table}]

# TODO: we have multiple types of lms
# To init lm servers via configuration, we need to name the lm types
language_models = [
    {
        'lang_code': 'en',
        'srilm_lm_file': '/home/chris/projects/maxent_decoder/lm/europarl.srilm.gz',
        'phrase_tables': {
            ('de', 'en'): de_en_phrase_table
        }
    },
    # {
    #     'lang_code': 'en',
    #     'order': 3,
    #     'pickled_lm_lookup_table': '/home/chris/projects/gigaword/proto/europarl.test.ngram_scores.cpkl',
    #     'phrase_tables': {
    #         ('de', 'en'): de_en_phrase_table
    #     }
    # }
]

# the query parameters to the prefix lm tell us how to construct the query
lm_autocompleter = SrilmLanguageModelAutocompleter(language_models=language_models, server_port_range_start=7090)
# lm_autocompleter = PrefixLanguageModelAutocompleter(language_models=language_models)

@app.route('/lm_autocomplete', methods=['GET'])
def lm_interface():
    # TODO: required args: source_lang, target_lang, source_tokens
    # TODO: target_prefix is not required -- if it's empty, we'll assume that we're at the beginning of the sentence
    source_lang = request.args.get('source_lang', '')
    target_lang = request.args.get('target_lang', '')
    # if target_lang in lm_autocompleter.language_model_servers:
    target_prefix_raw = request.args.get('target_prefix', '')
    # TODO: use the wordpunce tokenizer obj with language param (if available)
    # we should
    target_prefix = tokenizer(target_prefix_raw.strip().lower())
    source_segment_raw = request.args.get('source_segment', '')
    # TODO: sometimes the capital letters help us -- i.e. when it's a proper noun
    # for the capitalized tokens, we should have capitalized and uncapitalized versions
    # or do this in the phrase table?
    source_segment = tokenizer(source_segment_raw.strip())

    # TODO: parameterize source and target langs
    # TODO: the API to the various autocompleters must be consistent -- 'metric' doesn't always make sense
    if len(target_prefix) >= 1:
        ranked_completions = lm_autocompleter.get_ranked_completions('de', 'en',
                                                                     source_tokens=source_segment,
                                                                     target_prefix=target_prefix,
                                                                     metric='ppl1', add_oovs=True)
    else:
        ranked_completions = []

    return jsonify({'ranked_completions': ranked_completions})

app.run(debug=True, port=8010)

# if __name__ == '__main__':
#
#     parser = ArgumentParser()
#     parser.add_argument("configuration_file", action="store", help="path to the config file (in YAML format).")
#     args = parser.parse_args()
#     experiment_config = {}
#
#     # Experiment hyperparams
#     cfg_path = args.configuration_file
#     # read configuration file
#     with open(cfg_path, "r") as cfg_file:
#         experiment_config = yaml.load(cfg_file.read())
#     main(experiment_config)
#     # parse the yaml config

# build one of these for each available target language
#     language_models = [
#         {
#             'lang_code': 'en',
#             'srilm_lm_file': '/home/chris/projects/maxent_decoder/lm/europarl.srilm.gz',
#             'phrase_tables': {
#                 ('de', 'en'): de_en_phrase_table
#             }
#         }
#     ]

