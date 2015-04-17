import codecs
import re
from collections import deque
from interactive_decoding.phrase_table.parsers import PhraseTableParser
from nltk.tokenize import wordpunct_tokenize


def strip_list(l):
    return deque([u.strip() for u in l])

class MosesTriplePipeParser(PhraseTableParser):

    def __init__(self):
        # hard-coded for now
        self.phrase_object_keys = ['source', 'target', 'fe', 'lex_fe', 'ef', 'lex_ef']

    def parse(self, moses_phrase_table_file):
        """
        parse the triple pipe phrase table format used by moses
        :param moses_phrase_table_file:
        :return: list of phrase objects
        """
        with codecs.open(moses_phrase_table_file, encoding='utf8') as text_phrase_table:
            lines = [line.strip() for line in text_phrase_table]
            line_units = [line.split('|||') for line in lines]
            lists_of_units = [strip_list(x) for x in line_units]

            phrase_objects = []
            for entry in lists_of_units:
                f_phrase = entry.popleft()
                e_phrase = entry.popleft()
                features = entry.popleft()

                # currently unused -- need to pop so that they don't get added to the db row
                # counts = entry.pop()
                # alignment = entry.pop()
                # end unused

                # split each field on whitespace except target -- there should be a name for every field
                flattened = re.split('\s+', features)
                phrase_tuple = (f_phrase, e_phrase) + tuple([float(f) for f in flattened])
                assert len(self.phrase_object_keys) == len(phrase_tuple), 'the lens of keys and phrase_tuple must match'
                phrase_obj = {k:v for k,v in zip(self.phrase_object_keys, phrase_tuple)}
                # tokenize source and target, then rejoin, just so we don't get any weird stuff
                phrase_obj['source'] = ' '.join(wordpunct_tokenize(phrase_obj['source']))
                phrase_obj['target'] = ' '.join(wordpunct_tokenize(phrase_obj['target']))
                phrase_objects.append(phrase_obj)

        return phrase_objects
