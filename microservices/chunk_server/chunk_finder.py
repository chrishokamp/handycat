#!/usr/bin/env python
# -*- coding: utf-8 -*-

# this module exposes utilities to parse raw text into chunks
import nltk
import cPickle
from nltk_chunker import ConsecutiveNPChunker

# load the chunk parser model
phrase_chunker = cPickle.load(open('english_chunker.pickle'))

from nltk.tag import pos_tag
from nltk.tokenize import word_tokenize

def get_chunks(tree):
    # get the trees below the root node
    chunk_tuples = []
    for subtree in list(tree.subtrees())[1:]:
        chunk_tuples.append([tok[0] for tok in subtree])
    return(chunk_tuples)

# find the indices of a subsequence
def contains(small, big):
    for i in xrange(len(big)-len(small)+1):
        for j in xrange(len(small)):
            if big[i+j] != small[j]:
                break
        else:
            return i, i+len(small)
    return False

def just_chunks(sentence):
    tagged = pos_tag(word_tokenize(sentence))
    tree = phrase_chunker.parse(tagged)
    chunks = get_chunks(tree)
    return [" ".join(chunk) for chunk in chunks if len(chunk) > 1]

def string_with_chunks(sentence):
    tagged = pos_tag(word_tokenize(sentence))
    tree = phrase_chunker.parse(tagged)
    chunks = get_chunks(tree)
    all_toks = [tok[0] for tok in tree.leaves()]
    chunk_indices = [contains(chunk, all_toks) for chunk in chunks]
    # filter to those chunks containing at least two tokens
    chunk_indices = [chunk_idx for chunk_idx in chunk_indices if chunk_idx[1] - chunk_idx[0] > 1]

    # now join the larger chunks together with underscores
    final_representation = []
    idx = 0
    chunk_idx = 0
    while idx < len(all_toks):
        if chunk_idx < len(chunk_indices) and chunk_indices[chunk_idx][0] == idx:
            final_representation.append('_'.join(all_toks[chunk_indices[chunk_idx][0]:chunk_indices[chunk_idx][1]]))
            idx = chunk_indices[chunk_idx][1]
            chunk_idx += 1
        else:
            final_representation.append(all_toks[idx])
            idx += 1
    return final_representation
