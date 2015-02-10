from flask import Flask, jsonify, request
from flask.ext.cors import cross_origin
from string_alignment import levinstein_diff

app = Flask(__name__)

@app.route('/levenshtalign', methods=['GET'])
@cross_origin()
def levinshtalign_app():
    str1 = request.args.get('str1', '')
    str2 = request.args.get('str2', '')
    str1_diff, str2_diff = levinstein_diff(str1, str2)
    return jsonify({'str1_diff': str1_diff, 'str2_diff': str2_diff, 'str1': str1, 'str2': str2})

app.run(debug=True)

