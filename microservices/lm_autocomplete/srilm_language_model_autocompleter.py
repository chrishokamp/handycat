import codecs
import subprocess
import tempfile
import re
import os

from lm_autocomplete import extract_phrases

class SrilmLanguageModelAutocompleter:
    """
    a class which holds language models, and knows how to return ranked completions given a prefix
    """

    def __init__(self, language_models=[], server_port_range_start=6090):
        # TODO: there's only one language model for each lang, but there may be multiple phrase tables
        # phrase table keys are tuples of lang codes
        # language_models are [{'lang_code': <lang_code>, 'srilm_lm_file': <srilm_lm_file>,
        # 'phrase_tables': {(source_lang, target_lang): phrase_table}]
        # phrase tables for lms must implement get_target_phrases

        self.language_model_servers = {}
        self.start_server_template = "ngram -server-port {} -lm {}"
        self.call_server_template = "ngram -use-server {} -ppl {} -debug 2 -tolower"

        # start srilm servers for each of the language models
        for language_model_data, port in zip(language_models, range(server_port_range_start, server_port_range_start + len(language_models))):
            assert type(language_model_data['srilm_lm_file']) == str, 'language model file names must be strings'
            language_model_server = self._start_ngram_server(language_model_data['lang_code'],
                                                             language_model_data['srilm_lm_file'], port)
            # add the phrase table key to the server object
            language_model_server['phrase_tables'] = language_model_data['phrase_tables']
            self.language_model_servers[language_model_data['lang_code']] = language_model_server

    # kill all of the server processes when this obj gets garbage collected
    def __del__(self):
        for lang_code, server_data in self.language_model_servers.items():
            server_data['process'].kill()

    def _start_ngram_server(self, lang_code, lm_file, port):
        print('init lm')
        start_server_command = self.start_server_template.format(port, lm_file)
        server_process = subprocess.Popen(start_server_command.split())
        return {'process': server_process, 'port': port}

    def _generate_completion_candidates(self, source_lang, target_lang, source_tokens=[], add_oovs=False, max_source_phrase_len=2):
        """
        use the source phrases to generate completion candidates for the language model
        :return: list
        """
        source_phrases = extract_phrases(source_tokens)
        target_candidate_map = {tuple(source_phrase): self.language_model_servers[target_lang]['phrase_tables'][(source_lang, target_lang)]
                                .get_target_phrases(source_phrase)
                                for source_phrase in source_phrases}
        # flatten and extract just the target phrase from the phrase table object
        target_candidates = []
        for source_phrase, candidates in target_candidate_map.items():
            if add_oovs:
                if len(candidates) == 0 and len(source_phrase) <= max_source_phrase_len:
                    target_candidates.append(' '.join(source_phrase))
            target_candidates.extend([c['target'] for c in candidates])
        # target_candidates = [c['target'] for l in nested_target_candidates for c in l]
        return target_candidates

    # generate ranked completions given the source segment and the current target prefix
    def get_ranked_completions(self, source_lang, target_lang, source_tokens=[], target_prefix=[], metric='logprob', add_oovs=False):
        cands = self._generate_completion_candidates(source_lang, target_lang, source_tokens=source_tokens, add_oovs=add_oovs)
        lm_server = self.language_model_servers[target_lang]
        # with tempfile.NamedTemporaryFile(mode='w') as options_file:
        dump_file = tempfile.NamedTemporaryFile(delete=False)
        print('tmp filename is: ' + dump_file.name)
        # with codecs.open('cands.tmp', 'w', encoding='utf8') as options_file:
        with codecs.open(dump_file.name, 'w', encoding='utf8') as options_file:
            for candidate in cands:
                completion = target_prefix + [candidate]
                # remember that the lm is assumed to be _lowercase_
                options_file.write(' '.join(completion).lower() + '\n')
                # note that here we are actually reopening an open file

            call_server_command = self.call_server_template.format(lm_server['port'], options_file.name)
            lm_client_output, lm_client_error = subprocess.Popen(
                call_server_command.split(), stdout=subprocess.PIPE,
                stderr=subprocess.PIPE).communicate()
        os.remove(dump_file.name)

        # each entry is: (score, num_oovs)
        ordered_logprobs_and_zeroprobs = self._parse_srilm_output(lm_client_output, metric=metric)
        assert len(ordered_logprobs_and_zeroprobs) == len(cands), "we must have a probability for every candidate"
        # sort by length (longest first)
        length_sorted = sorted(zip(cands, ordered_logprobs_and_zeroprobs), key=lambda u: len(u[0]), reverse=True)
        # first sort by score descending
        score_sorted = sorted(length_sorted, key=lambda u: u[1][0], reverse=True)
        # now sort by num oovs ascending
        sorted_completions = sorted(score_sorted, key=lambda u: u[1][1], reverse=False)
        print(sorted_completions)
        return sorted_completions

    @staticmethod
    def _parse_srilm_output(srilm_output, metric='logprob'):
        """

        :param srilm_output:
        :param metric: 'logprob' | 'ppl1'
        logprob includes p('<\s>' | w1..wn)
        ppl1 does not include the end of sentence tag probability
        :return:
        """

        # WORKING -- get num zeroprobs and do a secondary sort ascending on that field
        print('srilm output')
        print(srilm_output)
        assert metric == 'logprob' or metric == 'ppl1', 'the lm scoring metric must be \'logprob\' or \'ppl1\''
        # SRILM prints one blank line and an info snippet at the end of the file, ignore it
        output_lines = srilm_output.split('\n')[:-1]

        # each result is separated by one blank line
        # iterate until a blank line, then get the previous index
        ordered_logprobs = []
        for i, l in enumerate(output_lines):
            if re.match("^$", l):
                completion_scores = output_lines[i-1].split()
                # the number of oovs in the segment -- first field, last line before the blank line
                num_zeroprobs = output_lines[i-1].split()[0]
                print('num_zeroprobs: ' + num_zeroprobs)
                if metric == 'ppl1':
                    # the ppl1 (ppl without sentence ending is the last unit in the whitespace-delimeted last line
                    # higher ppl is worse, so lets make scores negative so we can sort the same way as with logprobs
                    ppl1 = -float(completion_scores[-1])
                    ordered_logprobs.append((ppl1, num_zeroprobs))
                else:
                    # the logprob is the fourth unit in the whitespace-delimeted last line
                    logprob = float(completion_scores[3])
                    ordered_logprobs.append((logprob, num_zeroprobs))
        return ordered_logprobs










