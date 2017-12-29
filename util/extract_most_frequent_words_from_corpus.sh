sed -e 's/\s/\n/g' < all_text.en-de.de.tok | sort | uniq -c | sort -nr | head  -10 > most_frequent_words.de
