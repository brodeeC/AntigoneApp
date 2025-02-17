from treebank_parse import hash_word, csv_write
import xml.etree.ElementTree as ET


def xml_parse(file):
    tree = ET.parse(file)  
    root = tree.getroot()

    vocab_list = []
    def_list = []
    def_counter = 1
    prev = ''
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

        
        
        def_counter = 1
        for row in def_list[-1:]:
            if lemma_id == row['lemma_id']:
                def_counter = row['def_num'] + def_counter
                break

        prev = lemma_id

        

        def_list.append({'lemma_id': lemma_id, 'def_num': def_counter, 'short_definition': short_definition, 'queries': queries})

    return vocab_list, def_list
    

def check_dups(list):
    for i in range(len(list)):
        first_row = list[i]
        for j in range(i+1, len(list)):
            if list[i] == list[j]:
                print(list[i])
                print(list[j])
                print('\n')




def main():
    vocab_list, def_list = xml_parse('database/raw_data/vocablist.xml')
    check_dups(vocab_list)
    csv_write(vocab_list, 'vocabList')
    csv_write(def_list, 'defList')
    


if __name__ == '__main__':
    main()