from abc import ABCMeta, abstractmethod

# the base class for a phrase table
# a PhraseTable returns dicts representing the entries


class PhraseTable(object):

    __metaclass__ = ABCMeta

    @abstractmethod
    def get_target_phrases(self, source_phrase):
        """
        map the source phrase to a list of target phrases
        :param source_phrase: str to query the phrase table
        :return: a list of target phrases
        """
        return []

    @abstractmethod
    def __contains__(self, item):
        pass

    # TODO: implement
    # @abstractmethod
    # def add_phrase(self, phrase_obj):
    #     """
    #     allow dynamic addition of phrases to deal with OOVs
    #     :param phrase_obj: a dict (or defaultdict(list)) representing a new phrase
    #     :return: True or False, indicating whether the phrase was added
    #     """
    #     pass