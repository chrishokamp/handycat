from flask import Flask, jsonify, request
from flask.ext.cors import CORS
from lm_autocomplete.language_model_autocompleter import LanguageModelAutocompleter
from nltk.tokenize import wordpunct_tokenize

app = Flask(__name__)
CORS(app, allow_headers='Content-Type')
tokenizer = wordpunct_tokenize

# TODO: what is the correct way to namespace global objects in Flask?
#available_lms = yaml.load config
#lm_autocompleter
# WORKING - copied from notebook
from lm_autocomplete.phrase_table.parsers.moses_triple_pipe_parser import MosesTriplePipeParser
from lm_autocomplete.phrase_table.in_memory_phrase_table import InMemoryPhraseTable

phrase_table_file = '/home/chris/projects/maxent_decoder/phrase_table/filtered_phrase_table'
parser = MosesTriplePipeParser()
phrase_objects = parser.parse(phrase_table_file)

pt_cutoff = 5
max_source_len = 3
de_en_phrase_table = InMemoryPhraseTable(phrase_objects, cutoff=pt_cutoff, max_source_len=max_source_len)

# WORKING - test usage of the lm autocomplete lib
from lm_autocomplete.language_model_autocompleter import LanguageModelAutocompleter

# language_models are [{'lang_code': <lang_code>, 'srilm_lm_file': <srilm_lm_file>,
# 'phrase_tables': {(source_lang, target_lang): phrase_table}]

language_models = [
    {
        'lang_code': 'en',
        'srilm_lm_file': '/home/chris/projects/maxent_decoder/lm/europarl.srilm.gz',
        'phrase_tables': {
            ('de', 'en'): de_en_phrase_table
        }
    }
]

lm_autocompleter = LanguageModelAutocompleter(language_models=language_models, server_port_range_start=7090)
# WORKING - END copied from notebook`

# working - get the lm autocompletions

# @cross_origin()
@app.route('/lm_autocomplete', methods=['GET'])
def lm_interface():
    # TODO: required args: source_lang, target_lang, source_tokens
    # TODO: target_prefix is not required -- if it's empty, we'll assume that we're at the beginning of the sentence
    source_lang = request.args.get('source_lang', '')
    target_lang = request.args.get('target_lang', '')
    # if target_lang in lm_autocompleter.language_model_servers:
    target_prefix_raw = request.args.get('target_prefix', '')
    # TODO: use the wordpunce tokenizer obj
    target_prefix = tokenizer(target_prefix_raw.strip())
    source_segment_raw = request.args.get('source_segment', '')
    source_segment = tokenizer(source_segment_raw.strip())

    if len(target_prefix) >= 1:
        ranked_completions = lm_autocompleter.get_ranked_completions('de', 'en',
                                                                     source_tokens=source_segment,
                                                                     target_prefix=target_prefix, metric='ppl1')
    else:
        ranked_completions = []
    # ranked_completions = get_lm_completions(target_lang, current_prefix=current_prefix)

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

