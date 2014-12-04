#!/usr/bin/env python

# -*- coding: utf-8 -*-
from __future__ import print_function, division
import codecs

import flask as flask
from flask import Flask
from flask import redirect, request
from flask.ext.cors import cross_origin

from nltk.tokenize import word_tokenize

# load the data into a dict with set keys
# TODO: use an inverse index instead
test_phrases = 'test/1000.en'
with codecs.open(test_phrases, encoding='utf8') as input_phrases:
    lines = input_phrases.read().strip().split('\n')
    all_phrases = [(set(word_tokenize(l)), l) for l in lines]


# Create app
app = Flask(__name__)
app.config['DEBUG'] = True

# the server routes
@app.route('/phrases', methods=['GET'])
@cross_origin(methods=['GET'], send_wildcard=True, always_send=True)
def find_phrases():
    try:
        query = request.args['query']
        query_toks = set(word_tokenize(query))
	# TODO: use an inverse index instead
        matches = [match[1] for match in all_phrases if query_toks.issubset(match[0])]
        output = {'query': query, 'matches': matches}
        return flask.jsonify(output)
    except KeyError:
        return flask.jsonify({'error': 'you did not specify a query'})

try:
    port = int(sys.argv[1])
except:
    port = 5001

app.run(debug=True, host='0.0.0.0', port=port)
print('flask app is running on port: {}'.format(port))
