#!/usr/bin/env python
"""
Write some stats to a tsv for each task, given a directory of .json log files
"""

import os
import json
import codecs
import re
import argparse
from collections import defaultdict, Counter

import difflib

__author__ = "Chris Hokamp"


def tasks_from_session_log(log):
    return [(name, log['document'][name]['segments']) for name in log['document'].keys()]


# time per segment given a dict of segments
def get_time_per_segment(segments):
    ordered_segments = sorted([(int(k), v) for k,v in segments.items()], key=lambda x: x[0])
    segment_times = []
    for seg_id, events in ordered_segments:
        action_names = [e['action'] for e in events]
        time_in_segment = 0
        if 'change-segment' in action_names:
            start_event_idx = action_names.index('change-segment')
            # first index of 'change-segment'
            start_event_time = events[start_event_idx]['time']
            if 'segment-complete' in action_names:
                # last index of 'segment-complete'
                end_event_idx = len(action_names) - 1 - action_names[::-1].index('segment-complete')
                end_event_time = events[end_event_idx]['time']
                time_in_segment = end_event_time - start_event_time
                # convert to seconds
                time_in_segment = time_in_segment / 1000.

        segment_times.append((seg_id, time_in_segment))

    return segment_times


# time per segment given a dict of segments
def get_total_keystrokes_per_segment(segments):
    ordered_segments = sorted([(int(k), v) for k,v in segments.items()], key=lambda x: x[0])
    segment_keystrokes = []
    for seg_id, events in ordered_segments:
        action_names = [e['action'] for e in events]
        num_keystrokes = sum([1 for action in action_names if action == 'plaintextEditor.keypress'])
        segment_keystrokes.append((seg_id, num_keystrokes))

    return segment_keystrokes


# time per segment given a dict of segments
def get_time_spent_editing(segments):
    ordered_segments = sorted([(int(k), v) for k,v in segments.items()], key=lambda x: x[0])
    segment_times = []
    for seg_id, events in ordered_segments:
        action_names = [e['action'] for e in events]
        time_in_segment = 0
        if 'qeScore.accept' in action_names:
            start_event_idx = action_names.index('qeScore.accept')
            start_event_time = events[start_event_idx]['time']
        elif 'change-segment' in action_names:
            start_event_idx = action_names.index('change-segment')
            start_event_time = events[start_event_idx]['time']

        if 'segment-complete' in action_names:
            # last index of 'segment-complete'
            end_event_idx = len(action_names) - 1 - action_names[::-1].index('segment-complete')
            end_event_time = events[end_event_idx]['time']
            time_in_segment = end_event_time - start_event_time
            # convert to seconds
            time_in_segment = time_in_segment / 1000.

        segment_times.append((seg_id, time_in_segment))
    return segment_times


# 'qeScore.accept'
# time per segment given a dict of segments
def get_time_until_score_clicked(segments):
    ordered_segments = sorted([(int(k), v) for k,v in segments.items()], key=lambda x: x[0])
    segment_times = []
    for seg_id, events in ordered_segments:
        action_names = [e['action'] for e in events]
        time_until_score_clicked = 0
        if 'change-segment' in action_names:
            # first index of 'change-segment'
            start_event_idx = action_names.index('change-segment')
            start_event_time = events[start_event_idx]['time']
            if 'qeScore.accept' in action_names:
                # last index of 'segment-complete'
                click_event_idx = action_names.index('qeScore.accept')
                click_event_time = events[click_event_idx]['time']
                time_until_score_clicked = click_event_time - start_event_time
                # convert to seconds
                time_until_score_clicked = time_until_score_clicked / 1000.

        segment_times.append((seg_id, time_until_score_clicked))

    return segment_times


def get_before_after_from_segments(segments):
    ordered_segments = sorted([(int(k), v) for k,v in segments.items()], key=lambda x: x[0])
    segment_before_after = []
    for seg_id, events in ordered_segments:
        action_names = [e['action'] for e in events]
        before = u''
        after = u''
        if 'segment-complete' in action_names:
            # first index of 'change-segment'
            end_event_idx = action_names.index('segment-complete')
            before = events[end_event_idx]['data']['previousValue']
            after = events[end_event_idx]['data']['newValue']

        segment_before_after.append((seg_id, before, after))

    return segment_before_after


def get_username_from_segments(segments):
    """just a utility to write the username for each segment to make analysis easier"""
    ordered_segments = sorted([(int(k), v) for k,v in segments.items()], key=lambda x: x[0])
    segment_usernames = []
    for seg_id, events in ordered_segments:
      seg_username = events[0]['user']['name']
      segment_usernames.append((seg_id, seg_username))

    return segment_usernames


def get_edit_distance(before, after):
    matcher = difflib.SequenceMatcher(isjunk=None, a=before, b=after)
    return 1. - matcher.ratio()


def main(logdir):
    logfiles = [os.path.join(logdir, f) for f in os.listdir(logdir)
                if os.path.isfile(os.path.join(logdir, f)) and '.json' in f]
    json_logs = [json.loads(codecs.open(f, encoding='utf8').read()) for f in logfiles]
    tasks_by_log = [tasks_from_session_log(log) for log in json_logs]

    username_by_task_by_log = [[(name, get_username_from_segments(segments)) for name, segments in log]
                                for log in tasks_by_log]
    editing_times_by_task_by_log = [[(name, get_time_spent_editing(segments)) for name, segments in log]
                                      for log in tasks_by_log]
    time_until_score_clicked_by_task_by_log = [[(name, get_time_until_score_clicked(segments)) for name, segments in log]
                                                 for log in tasks_by_log]
    num_keystrokes_by_task_by_log = [[(name, get_total_keystrokes_per_segment(segments)) for name, segments in log]
                                       for log in tasks_by_log]
    before_after_by_task_by_log = [[(name, get_before_after_from_segments(segments)) for name, segments in log]
                                       for log in tasks_by_log]

    already_used_filenames = set()
    for i, log in enumerate(tasks_by_log):
        for j, (task_name, segments) in enumerate(log):
            task_name = re.sub(u' \| ', u'_', task_name)
            task_name = re.sub(u' ', u'_', task_name)
            rows = []
            rows.append(['segment', 'username', 'time_until_score_accept', 'editing_time',
                         'num_keystrokes', 'edit_distance', 'original_mt', 'post_edited'])
            for seg_id in sorted([int(k) for k in segments.keys()]):
                _, username = username_by_task_by_log[i][j][1][seg_id]
                _, time_until_score_accept = time_until_score_clicked_by_task_by_log[i][j][1][seg_id]
                _, editing_time = editing_times_by_task_by_log[i][j][1][seg_id]
                _, num_keystrokes = num_keystrokes_by_task_by_log[i][j][1][seg_id]
                _, before_, after_ = before_after_by_task_by_log[i][j][1][seg_id]
                edit_distance = get_edit_distance(before_, after_)
                new_row = [seg_id+1, username, time_until_score_accept, editing_time, num_keystrokes, edit_distance, before_, after_]
                rows.append(new_row)

            output_file = task_name
            if output_file in already_used_filenames:
                idx = 1
                while output_file in already_used_filenames:
                    output_file = output_file + '_{}'.format(idx)
                    idx += 1
            output_file = output_file
            with codecs.open(output_file + '.tsv', 'w', encoding='utf8') as out:
                for row in rows:
                    out.write(u'{}\t{}\t{}\t{}\t{}\t{}\t{}\t{}\n'.format(*row))
            already_used_filenames.update([output_file])
            print('Wrote {}'.format(output_file))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("--logdir", type=str,
                        help="A directory storing (only) logs in json format")
    args = parser.parse_args()
    main(args.logdir)

