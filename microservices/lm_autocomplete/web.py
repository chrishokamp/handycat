from flask import Flask, jsonify, request
from flask.ext.cors import cross_origin
from string_alignment import levinstein_diff

app = Flask(__name__)

# TODO: what is the correct way to namespace global objects in Flask?
#available_lms = yaml.load config
#lm_autocompleter

# working - get the lm autocompletions

@app.route('/lm_autocomplete', methods=['GET'])
@cross_origin()
def lm_interface():
    target_lang = request.args.get('target_lang', '')
    if target_lang in lm_autocompleter.language_models:
        current_prefix = request.args.get('current_prefix', '')

    ranked_completions = get_lm_completions(target_lang, current_prefix=current_prefix)

    return jsonify({'ranked_completions': ranked_completions})

def get_lm_completions(target_lang,
    pass

app.run(debug=True)

