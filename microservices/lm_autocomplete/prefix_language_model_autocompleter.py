import codecs
import subprocess
import tempfile
import re
import os
import cPickle

from collections import OrderedDict

from lm_autocomplete import extract_phrases

# TODO: make the Abstract Base Class for language model autocompleters

class PrefixLanguageModelAutocompleter:
    """
    a class which holds language models, and knows how to return ranked completions given a prefix
    """

    def __init__(self, language_models=[], order=3):
        # TODO: there's only one language model for each lang, but there may be multiple phrase tables
        # phrase table keys are tuples of lang codes
        # language_models are [{'lang_code': <lang_code>, 'srilm_lm_file': <srilm_lm_file>,
        # 'phrase_tables': {(source_lang, target_lang): phrase_table}]
        # phrase tables for lms must implement get_target_phrases

        self.order = order
        self.language_model_completers = {}
        self._phrase_tables = {}

        for language_model_data in language_models:
            assert type(language_model_data['pickled_lm_lookup_table']) == str, 'language model file names must be strings'
            # unpickle the table
            with open(language_model_data['pickled_lm_lookup_table'], 'rb') as lm_pickled:
                lm_lookup_table = cPickle.load(lm_pickled)
            print('unpickled lm at: {}'.format(language_model_data['pickled_lm_lookup_table']))
            # index it by language
            lm_lang = language_model_data['lang_code']
            self.language_model_completers[lm_lang] = lm_lookup_table
            self._phrase_tables = language_model_data['phrase_tables']

    # TODO: move to LM autocompleter ABC
    def _generate_completion_candidates(self, source_lang, target_lang, source_tokens=[], add_oovs=False, max_source_phrase_len=2):
        """
        use the source phrases to generate completion candidates for the language model
        :return: list
        """
        source_phrases = extract_phrases(source_tokens)
        target_candidate_map = {tuple(source_phrase): self._phrase_tables[(source_lang, target_lang)]
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
    def get_ranked_completions(self, source_lang, target_lang, source_tokens=[], target_prefix=[], metric='logprob', add_oovs=False, filter=False):
        cands = self._generate_completion_candidates(source_lang, target_lang, source_tokens=source_tokens, add_oovs=add_oovs)
        lm_lookup_table = self.language_model_completers[target_lang]

        # FILTERING: this code is if we want to filter using the phrase table
        # trim the target prefix to the last lm_order-1 tokens

        if filter is True:
            all_possible_completions = OrderedDict(lm_lookup_table[tuple(target_prefix[-self.order-1:])])
            matched_completions = []
            for candidate in cands:
                if candidate in all_possible_completions:
                    # append (cand, score)
                    matched_completions.append((candidate, all_possible_completions[candidate]))

            sorted_completions = sorted(matched_completions, key=lambda u: u[1], reverse=True)
            # END PHRASE TABLE FILTERING
        else:
            sorted_completions = list(lm_lookup_table[tuple(target_prefix[-self.order+1:])])

        return sorted_completions








