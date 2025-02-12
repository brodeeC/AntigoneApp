from treebank_parse import csv_write, grk_to_eng, hash_word
import csv
import xml.etree.ElementTree as ET


def xml_parse(file):
    tree = ET.parse(file)  
    root = tree.getroot()

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

        
        print(headword, short_definition, queries)



def main():
    xml_parse('database/raw_data/vocablist.xml')


if __name__ == '__main__':
    main()