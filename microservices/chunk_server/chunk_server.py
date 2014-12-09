#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import print_function, division
import sys

import flask as flask
from flask import Flask
from flask import redirect, request
from flask.ext.cors import cross_origin

from chunk_finder import string_with_chunks, just_chunks

# Create app
app = Flask(__name__)
app.config['DEBUG'] = True

# the server routes
@app.route('/chunk_string', methods=['GET'])
@cross_origin(methods=['GET'], send_wildcard=True, always_send=True)
def string_to_chunks():
    try:
        query = request.args['query']
        chunked_string = string_with_chunks(query)
        output = {'chunked_string': chunked_string}
        return flask.jsonify(output)
    except KeyError:
        return flask.jsonify({'error': 'you did not specify a query'})

@app.route('/chunks', methods=['GET'])
@cross_origin(methods=['GET'], send_wildcard=True, always_send=True)
def find_chunks():
    try:
        query = request.args['query']
        chunks = just_chunks(query)
        output = {'chunks': chunks}
        return flask.jsonify(output)
    except KeyError:
        return flask.jsonify({'error': 'you did not specify a query'})


try:
    port = int(sys.argv[1])
except:
    port = 5005

app.run(debug=True, host='0.0.0.0', port=port)
print('flask app is running on port: {}'.format(port))
