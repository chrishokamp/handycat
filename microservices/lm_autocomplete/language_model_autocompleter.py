import codecs
import subprocess
import tempfile
import re

from lm_autocomplete import extract_phrases

class LanguageModelAutocompleter:
    """
    a class which holds language models, and knows how to return ranked completions given a prefix
    """

    def __init__(self, language_models=[], server_port_range_start=6090):
        # TODO: phrase tables need to tell us both language directions!
        # TODO: there's only one language model for each lang, but there may be multiple phrase tables
        # phrase table keys are tuples of lang codes
        # language_models are [{'lang_code': <lang_code>, 'srilm_lm_file': <srilm_lm_file>,
        # 'phrase_tables': {(source_lang, target_lang): phrase_table}]
        # phrase tables for lms must implement get_target_phrases
        for k, v in language_models.items():
            assert type(v) == str, 'language model file names must be strings'

        self.language_model_servers = {}
        self.start_server_template = "ngram -server-port {} -lm {}"
        self.call_server_template = "ngram -use-server {} -ppl {} -debug 2 -tolower"

        # start srilm servers for each of the language models
        for language_model_data, port in zip(language_models, range(server_port_range_start, len(language_models))):
            language_model_server = self._start_ngram_server(language_model_data['lang_code'],
                                                             language_model_data['srilm_lm_file'], port)
            # add the phrase table key to the server object
            language_model_server['phrase_tables'] = language_model_data['phrase_tables']
            self.language_model_servers.update(language_model_server)

    # kill all of the server processes when this obj gets garbage collected
    def __del__(self):
        for lang_code, server_data in self.language_model_servers.items():
            server_data['process'].kill()

    def _start_ngram_server(self, lang_code, lm_file, port):
        start_server_command = self.start_server_template.format(port, lm_file)
        server_process = popen_obj = subprocess.Popen(start_server_command.split())
        return {lang_code: {'process': server_process, 'port': port}}

    def _generate_completion_candidates(self, source_lang, target_lang, source_tokens=[]):
        """
        use the source phrases to generate completion candidates for the language model
        :return: list
        """
        source_phrases = extract_phrases(source_tokens)
        target_candidates = [self.language_models[target_lang]['phrase_tables'][(source_lang, target_lang)]
                                 .get_target_phrases(source_phrase)
                             for source_phrase in source_phrases]
        return target_candidates

    # generate ranked completions given the source segment and the current target prefix
    def get_ranked_completions(self, source_lang, target_lang, source_tokens=[], target_prefix=[]):
        cands = self._generate_completion_candidates(source_lang, target_lang, source_tokens)
        lm_server = self.language_model_servers[target_lang]
        with tempfile.NamedTemporaryFile(mode='w', encoding='utf8') as options_file:
            for candidate in cands:
                completion = target_prefix + [candidate]
                # remember that the lm is assumed to be _lowercase_
                options_file.write(' '.join(completion).lower() + '\n')
                # note that here we are actually reopening an open file

            call_server_command = self.call_server_template.format(lm_server['port'], options_file.name)
            lm_client_output, lm_client_error = subprocess.Popen(
                call_server_command.split(), stdout=subprocess.PIPE,
                stderr=subprocess.PIPE).communicate()

        ordered_logprobs = self._parse_srilm_output(lm_client_output)
        assert len(ordered_logprobs) == len(cands), "we must have a probability for every candidate"
        sorted_completions = sorted(zip(cands, ordered_logprobs), key=lambda u: u[1], reverse=True)
        return sorted_completions

    @staticmethod
    def _parse_srilm_output(self, srilm_output):
        # SRILM prints one blank line at the end of the file, ignore it
        output_lines = srilm_output.split('\n')[:-1]

        # each result is separated by one blank line
        # iterate until a blank line, then get the previous index
        # the logprob is the fourth unit in the whitespace-delimeted last line
        # the ppl1 (ppl without sentence ending is the last unit in the whitespace-delimeted last line
        ordered_logprobs = []
        for i, l in enumerate(output_lines):
            if re.match("^$", l):
                completion_scores = output_lines[i-1].split()
                logprob = float(completion_scores[3])
                ppl = float(completion_scores[-1])
                ordered_logprobs.append(logprob)
        return ordered_logprobs










