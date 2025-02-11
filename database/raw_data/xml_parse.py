import csv
import xml.etree.ElementTree as ET


def xml_parse(file):
    tree = ET.parse(file)  
    root = tree.getroot()

    wordList = []
    for elem in root.iter('./sentence/word'): 
        word = elem.text.strip()
        if word:
            wordList.append({'word': elem,  })


def main():
    xml_parse('database/raw_data/treebank.xml')


if __name__ == '__main__':
    main()