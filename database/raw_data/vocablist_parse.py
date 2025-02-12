from treebank_parse import hash_word
import csv
import xml.etree.ElementTree as ET


def xml_parse(file):
    tree = ET.parse(file)  
    root = tree.getroot()

    vocab_list = []
    for frequency in root.findall('.//frequency'):
        # Access the lemma, headword, shortDefinition, and lexiconQueries
        headword = frequency.find('.//headword').text
        short_definition = frequency.find('.//shortDefinition').text
        
        # Extract the lexicon query reference if it exists
        lexicon_queries = frequency.findall('.//lexiconQueries/query')
        queries = []

        for query in lexicon_queries:
            url = 'https://www.perseus.tufts.edu/hopper/text?doc=' + query.get('ref')
            queries.append({'name': query.get('name'), 'url': url})

        
        lemma_id = hash_word(headword)

        vocab_list.append({'lemma_id': lemma_id, 'headword': headword, 'short_definition': short_definition, 'queries': queries})

    return vocab_list
    
def csv_write(wordList, fname):
    filepath = f"/Users/brodee69/Documents/GitHub/AntigoneApp/database/csv/{fname}.csv"
    with open(filepath, 'w', encoding='utf-8', newline='') as csvfile:
        fieldnames = ['lemma_id', 'headword', 'short_definition', 'queries']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()
        for row in wordList:
            writer.writerow(row)




def main():
    vocab_list = xml_parse('/Users/brodee69/Documents/GitHub/AntigoneApp/database/raw_data/vocablist.xml')
    csv_write(vocab_list, 'vocabList')
    


if __name__ == '__main__':
    main()