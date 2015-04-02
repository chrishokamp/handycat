# Utils for autocomplete
def extract_phrases(tokens, max_len=2):
    phrase_list = []
    for i in range(1, min(len(tokens)+1, max_len+1)):
        phrase_list.extend([tokens[j:j+i] for j in range(len(tokens)-i+1)])
    return phrase_list
