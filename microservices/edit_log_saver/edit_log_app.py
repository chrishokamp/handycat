# -*- coding: utf-8 -*-

import logging
import json
import codecs
import os
import errno
from flask import Flask, request, jsonify, abort
import argparse

logging.basicConfig()
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

app = Flask(__name__)
app.log_directory = None


def mkdir_p(path):
    try:
        os.makedirs(path)
    except OSError as exc:  # Python >2.5
        if exc.errno == errno.EEXIST and os.path.isdir(path):
            pass
        else:
            raise


# TODO: multiple instances of the same model, delegate via thread queue? -- with Flask this is way too buggy
# TODO: online updating via cache
@app.route('/save', methods=['POST'])
def save_locally():
    request_data = request.get_json()
    #spec:
    # req: {
    #   "json_edit_log": ...
    # }
    # logger.info('Request data: {}'.format(request_data))

    #if (source_lang, target_lang) not in app.models:
    #    logger.error('MT Server does not have a model for: {}'.format((source_lang, target_lang)))
    #    abort(404)

    # TODO: abort if fields are missing
    edit_log_json = request_data.get('json_edit_log', None)
    # parse the log to get the filename
    projects_in_log = edit_log_json['document'].keys()

    # get the segments field from a project
    segments_in_first_project = edit_log_json['document'][projects_in_log[0]]['segments']
    # get the user name from the list of edits for a segment in a project
    user_name = segments_in_first_project[segments_in_first_project.keys()[0]][0]['user']['name']
    # split user name if it was an email
    user_name = user_name.split('@')[0]

    log_file_name = '{}.{}.edit_log.json'.format(user_name, '+'.join(projects_in_log))
    log_file_name = os.path.join(app.log_directory, log_file_name)
    with codecs.open(log_file_name, 'w', encoding='utf8') as log_out:
        log_out.write(json.dumps(edit_log_json, indent=2))
    logger.info('Wrote an edit log to: {}'.format(log_file_name))

    # {
    #   "document": {
    #     "BASIC-Task-A": {
    #       "segments": {
    #         "0": [
    #           {
    #             "time": 1513093269406,
    #             "user": {
    #               "_id": "589b4e7446311fad41eeb78b",
    #               "name": "adapt@test.com"
    #             },
    #             "project": {
    #               "name": "BASIC-Task-A",
    #               "_id": "5a2ff893c6190b6651d55af5"
    #             },
    #             "action": "change-segment",
    #             "data": {
    #               "segmentId": 0,
    #             }
    #           },
    # username_timestamp_projects-...-.json

    return jsonify({'log_saved': True})


def run_log_saver_server(log_directory, port=6090):

    logger.info('Making sure directory exists: {}'.format(log_directory))
    mkdir_p(log_directory)
    app.log_directory = log_directory

    logger.info('Edit log saver microservice starting on port: {}'.format(port))
    app.run(debug=False, port=port, host='127.0.0.1', threaded=False)


if __name__ == '__main__':

    parser = argparse.ArgumentParser()
    parser.add_argument('--log_directory', required=True, type=str, help="The directory where logs will be saved")
    parser.add_argument('--port', help='the port where the microservice will run',
                        type=int, required=False, default=6090)
    args = parser.parse_args()

    run_log_saver_server(args.log_directory, port=args.port)


