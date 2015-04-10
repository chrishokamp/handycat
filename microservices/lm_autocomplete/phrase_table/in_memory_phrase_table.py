# a phrase table which is completely in memory

from lm_autocomplete.phrase_table import PhraseTable
from collections import defaultdict
from blist import sortedlist

# each key will have its phrases sorted (ascending) by the 'ef' key
# TODO: the sort key is currently hard-coded
def init_sorted_list():
    return sortedlist([], lambda i: i['ef'])


class InMemoryPhraseTable(PhraseTable):

    def __init__(self, phrase_objects, cutoff=None, max_source_len=None):
        self.phrase_table = defaultdict(init_sorted_list)
        self._populate_pt(phrase_objects)
        self.cutoff = cutoff
        self.max_source_len = max_source_len

    def __contains__(self, item):
        return item in self.phrase_table

    def _populate_pt(self, phrase_objects):
        for phrase_obj in phrase_objects:
            self.phrase_table[phrase_obj['source']].add(phrase_obj)

    def get_target_phrases(self, source_tokens):
        assert type(source_tokens) is list, 'the query to the InMemoryPhraseTable must be a list of tokens'

        # provide the ability to constrain source phrase length
        if self.max_source_len is not None:
            if len(source_tokens) > self.max_source_len:
                return []

        # the list-->string mapping is specific to this phrase table implementation
        source_phrase = ' '.join(source_tokens)
        assert type(source_phrase) is unicode, 'all phrase table keys must be unicode strings'

        phrase_objs = self.phrase_table[source_phrase]
        if self.cutoff is not None:
            # the fields are sorted ascending, so take the end
            phrase_objs = phrase_objs[-self.cutoff:]
        return phrase_objs

