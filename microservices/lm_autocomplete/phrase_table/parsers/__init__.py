from abc import ABCMeta, abstractmethod

class PhraseTableParser(object):

    __metaclass__ = ABCMeta

    # subclasses must provide the implementation
    @abstractmethod
    def parse(self, *args, **kwargs):
        """
        return a list of phrase objects that can be indexed by a phrase table
        :return: list
        - if the files that the parser requires aren't available, raise an exception
        """
        pass

    def __call__(self, *args, **kwargs):
        return self.parse(*args, **kwargs)
