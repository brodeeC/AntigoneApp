import json
from flask import Flask, jsonify
import sqlite3
import unicodedata
from backend.database.raw_data.treebank_parse import grk_to_eng, hash_word, strip_accents

app = Flask(__name__)
FIRST_PAGE = 1
LAST_PAGE = 123
MIN_LINE = 1
MAX_LINE = 1353

def get_db_connection():
    conn = sqlite3.connect('backend/database/antigone.db')  # Update path to your DB
    conn.row_factory = sqlite3.Row
    return conn

def get_line(lineNum):
    conn = get_db_connection()
    query = f'SELECT line_text, speaker FROM full_text WHERE line_number={lineNum}'
    data = conn.execute(query).fetchall()
    conn.close()

    # Check if any rows are returned
    if data:    
        row = data[0]  

        line_text = row["line_text"]
        speaker = row["speaker"]
        

        return line_text, speaker
    
    else:
        return None
    
def is_ancient_greek(word):
    for char in word:
        unicode_block = unicodedata.name(char, "").split()[0]
        if unicode_block != "GREEK":
            return False
    return True
    
def get_speaker(eng_speaker):
    conn = get_db_connection()
    query = f'SELECT line_text, line_number FROM full_text WHERE eng_speaker LIKE %{eng_speaker}%'
    data = conn.execute(query).fetchall()
    conn.close()

    # Check if any rows are returned
    if data:    
        row = data[0]  

        line_text = row["line_text"]
        lineNum = row["line_number"]
        

        return lineNum, line_text
    
    else:
        return None

# Takes greek word -> english -> hash -> SQL query for definition  
# Could use lemma from lemma_data table to get defs, may need to depending
def get_word_defs(lemma_id, form):
    #lemma_id = hash_word(grk_to_eng(grk_word))

    conn = get_db_connection()
    query = f'SELECT def_num, short_definition, queries  FROM lemma_definitions WHERE lemma_id={lemma_id}'
    data = conn.execute(query).fetchall()
    conn.close()

    def_list = []

    if not data: return def_list
    for row in data:
        def_num = row['def_num']
        short_def = row['short_definition']
        queries = row['queries']

        def_list.append({'def_num':def_num, 'short_def':short_def, 'queries':queries})

    return def_list

def parse_postag(postag):
    pos_dict = {"n": "noun", "v": "verb", "a": "adjective", "d": "adverb", "l": "article", "g": "particle",
        "c": "conjunction", "r": "preposition", "p": "pronoun", "m": "numeral", "i": "interjection",
        "u": "punctuation", "x": "not available"}
    
    person_dict = {"1": "first person", "2": "second person", "3": "third person"}
    
    number_dict = {"s": "singular", "p": "plural", "d": "dual", "-": "category does not apply"}
    
    tense_dict = {"p": "present", "i": "imperfect", "r": "perfect", "l": "pluperfect", "t": "future perfect", 
        "f": "future", "a": "aorist"}
    
    mood_dict = {"i": "indicative", "s": "subjunctive", "o": "optative", "n": "infinitive", "m": "imperative",
        "p": "participle"}
    
    voice_dict = {"a": "active", "p": "passive", "m": "middle", "e": "medio-passive"}

    
    gender_dict = {"m": "masculine", "f": "feminine", "n": "neuter"}

    case_dict = {"n": "nominative", "g": "genitive", "d": "dative", "a": "accusative", "v": "vocative",
        "l": "locative"}
    
    degree_dict = {"c": "comparative", "s": "superlative"}

    full_arr = []
    for i in range(1,10):
        char = postag[i-1]
        if char == '-':
            full_arr.append(i)
            continue
        # Part of speech
        if i == 1:
            full_arr.append(pos_dict[char])
        # Person
        elif i == 2:
            full_arr.append(person_dict[char])
        # Number
        elif i == 3:
            full_arr.append(number_dict[char])
        # Tense
        elif i == 4:
            full_arr.append(tense_dict[char])
        # Mood
        elif i == 5:
            full_arr.append(mood_dict[char])
        # Voice
        elif i == 6:
            full_arr.append(voice_dict[char])
        # Gender
        elif i == 7:
            full_arr.append(gender_dict[char])
        # Case
        elif i == 8:
            full_arr.append(case_dict[char])
        # Degree
        elif i == 9:
            full_arr.append(degree_dict[char])
        else:
            break
            
    return jsonify(full_arr)

@app.route('/AntigoneApp/lines/<startLine>', defaults={'endLine':None})   
@app.route('/AntigoneApp/lines/<startLine>/<endLine>', methods=['GET'])
def get_lines(startLine, endLine=None):
    try:
        if endLine == None:
          startLine = int(startLine)
          if startLine < MIN_LINE: startLine = MIN_LINE

          result = get_line(startLine)
          if result:
              text, speaker = result
              return [{"lineNum":startLine, "line_text":text, "speaker":speaker}]
          else: return []
          
        else:
          startLine = int(startLine)
          endLine = int(endLine)

    except ValueError:
        return jsonify({"error": "Invalid line number"}), 400
    
    if startLine < MIN_LINE: startLine = MIN_LINE
    if endLine > MAX_LINE: endLine = MAX_LINE
    
    page_dict = []

    for line in range(startLine, endLine+1):
        result = get_line(line)
        if result:
            text, speaker = result
            page_dict.append({"lineNum":line, "line_text":text, "speaker":speaker})

        else:
            page_dict.append({"lineNum":line, "line_text":None, "speaker":None})

    return jsonify(page_dict)

@app.route('/AntigoneApp/read/<int:page>', methods=['GET'])
def get_page(page):
    if page > LAST_PAGE: return []
    if page < FIRST_PAGE: return []

    maxLine = (page*11)
    minLine = ((page-1)*11) + 1

    return get_lines(minLine, maxLine)

### Route to get all of a speaker's lines, param lineNum to return the closest line/lines to that lineNum.
@app.route('/AntigoneApp/speaker/<speaker>/', defaults={'linesNear':None})
@app.route('/AntigoneApp/speaker/<speaker>/<int:linesNear>', methods=['GET'])
def get_speaker_lines(speaker, linesNear=None):
    if is_ancient_greek(speaker):
        speaker = grk_to_eng(strip_accents(speaker))

    result = get_speaker(speaker)

    if not result: return []
    
    speaker_dict = []
    lineNum, line_text = result

    ## So far I'm thinking, first iterate over lineNear - 50 through linesNear + 50
    # and see if speaker is present, return speaker_dict

    ## Then if linesNear == None iterate over full result list and nest array's for 'blocks' of speaker lines
    

    
    return []

### Need routes for advanced searching, will have to make these as frontend develops to gauge needs
### Make raw csv's downloadable?
### 
@app.route('/AntigoneApp/word-details/<word>', methods=['GET'])
def get_word_details(word):
    conn = get_db_connection()
    query = f"SELECT lemma_id, lemma, form, line_number, postag  FROM lemma_data WHERE lemma='{word}' or form='{word}'"
    data = conn.execute(query).fetchall()
    conn.close()

    if not data: return {}

    row_dict = {}
    for row in data:
        lemma_id = row['lemma_id']
        form = row['form']
        line_number = row['line_number']
        postag = row['postag']

        case_list = parse_postag(postag)
        
        result_def = get_word_defs(lemma_id)
        if not result_def: return []

        this_row = {'form':form, 'line_number':line_number, 'postag':postag}
        this_row.update(case_list)
        row_dict.update(this_row)

        def_list = {}
        for definition in result_def:
            def_num = definition['def_num']
            short_def = definition['short_def']
            queries = definition['queries']
            this_def = {'def_num':def_num, 'short_def':short_def, 'queries':queries}
            def_list.update(this_def)

        row_dict.update(def_list)

    return jsonify(row_dict)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
