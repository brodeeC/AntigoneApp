from treebank_parse import hash_word, csv_write
import xml.etree.ElementTree as ET


def xml_parse(file):
    tree = ET.parse(file)  
    root = tree.getroot()

    vocab_list = []
    def_list = []
    def_counter = 1
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

        present = False
        for row in vocab_list:
            if lemma_id in row.values():
                present = True
                break
        
        if present == False: 
            vocab_list.append({'lemma_id': lemma_id, 'headword': headword})

        def_list.append({'lemma_id': lemma_id, 'def_num': def_counter, 'short_definition': short_definition, 'queries': queries})
        def_counter += 1

    return vocab_list, def_list
    





def main():
    vocab_list, def_list = xml_parse('database/raw_data/vocablist.xml')
    csv_write(vocab_list, 'vocabList')
    #csv_write(def_list, 'defList')
    


if __name__ == '__main__':
    main()