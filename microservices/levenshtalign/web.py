from flask import Flask, jsonify
from string_alignment import levinstein_diff

app = Flask(__name__)

@app.route('/levenshtalign/<str1>/<str2>')
def levinshtalign_app(str1, str2):
    str1_diff, str2_diff = levinstein_diff(str1, str2)
    return jsonify({'str1_diff': str1_diff, 'str2_diff': str2_diff, 'str1': str1, 'str2': str2})

app.run(debug=True)

