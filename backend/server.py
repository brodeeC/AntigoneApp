import json
from flask import Flask, jsonify, request
#from flask_cors import CORS
import sqlite3
from unicodedata import normalize, category
import unicodedata
import re

app = Flask(__name__)
#CORS(app, supports_credentials=True)

FIRST_PAGE = 1
LAST_PAGE = 123
MIN_LINE = 1
MAX_LINE = 1353

def get_db_connection():
    conn = sqlite3.connect('backend/database/antigone.db')  # Update path to your DB
    conn.row_factory = sqlite3.Row
    return conn

# Stack Overflow: https://stackoverflow.com/questions/517923/what-is-the-best-way-to-remove-accents-normalize-in-a-python-unicode-string
def strip_accents(s):
   return ''.join(c for c in normalize('NFD', s)
        if category(c) != 'Mn' and c != "'")

def hash_word(eng_lemma):
    hash = 0
    for char in eng_lemma:
        idx = eng_lemma.index(char)
        hash += (ord(char) * (ord(char)//(idx+1))) ** 2 
    return hash

def clean_word(word):
    word = re.sub(r'[\u0313\u02BC]', '', word)
    # Remove Greek punctuation marks at the end of the word
    word = re.sub(r'[\u00B7\u002C\u002E\u037E\u0387;]+$', '', word)
    return word

def grk_to_eng(word):

    word_dict = {
        'α': 'a', 'ἁ': 'a(', 'ἀ': 'a)', 'ἂ': 'a)\\', 'ἃ': 'a(\\', 'ἄ': 'a)/', 'ἅ': 'a(/', 'ἆ': 'a)=' , 'ἇ': 'a(=', 
        'ά': 'a/', 'ὰ': 'a\\', 'ᾶ': 'a=', 'ᾳ': 'a|', 'ᾷ': 'a|=', 'ᾴ': 'a|/', 'ᾲ': 'a|\\', 'ᾱ': 'a=', 'ᾰ': 'a', 'ά':'a/',
        'β': 'b', 'γ': 'g', 'δ': 'd', 
        'ε': 'e', 'ἐ': 'e)', 'ἑ': 'e(', 'έ': 'e/', 'ὲ': 'e\\', 
        'ἔ': 'e)/', 'ἕ': 'e(/', 'ἒ': 'e)\\', 'ἓ': 'e(\\', 
        'ζ': 'z', 
        'η': 'h', 'ἡ': 'h(', 'ἠ': 'h)', 'ἤ': 'h)/', 'ἥ': 'h(/', 'ἦ': 'h)=', 'ἧ': 'h(=',  
        'ή': 'h/', 'ὴ': 'h\\', 'ῆ': 'h=', 'ῃ': 'h|', 'ῄ': 'h|/', 'ῂ': 'h|\\', 'ῇ': 'h|=',
        'θ': 'q', 
        'ι': 'i', 'ἰ': 'i)', 'ἱ': 'i(', 'ἲ': 'i)\\', 'ἳ': 'i(\\', 'ἴ': 'i)/', 'ἵ': 'i(/', 'ἶ': 'i)=', 'ἷ': 'i(=',  
        'ί': 'i/', 'ὶ': 'i\\', 'ῖ': 'i=', 'ϊ': 'i+', 'ΐ': 'i+/', 'ῒ': 'i+\\', 'ῗ': 'i+=', 
        'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n',
        'ξ': 'c', 
        'ο': 'o', 'ὀ': 'o)', 'ὁ': 'o(', 'ὄ': 'o)/', 'ὅ': 'o(/', 'ὂ': 'o)\\', 'ὃ': 'o(\\',  
        'ό': 'o/', 'ὸ': 'o\\', 
        'π': 'p', 
        'ρ': 'r', 'ῤ': 'r)', 'ῥ': 'r(', 
        'σ': 's', 'ς': 's', 'τ': 't', 
        'υ': 'u', 'ὐ': 'u)', 'ὑ': 'u(', 'ὒ': 'u)\\', 'ὓ': 'u(\\', 'ὔ': 'u)/', 'ὕ': 'u(/', 'ὖ': 'u)=', 'ὗ': 'u(=',  
        'ύ': 'u/', 'ὺ': 'u\\', 'ῦ': 'u=', 'ϋ': 'u+', 'ΰ': 'u+/', 'ῢ': 'u+\\', 'ῧ': 'u+=', 
        'φ': 'f', 'χ': 'x', 'ψ': 'Y', 
        'ω': 'w', 'ὠ': 'w)', 'ὡ': 'w(', 'ὤ': 'w)/', 'ὥ': 'w(/', 'ὦ': 'w)=', 'ὧ': 'w(=', 'ώ': 'w/',
        'ώ': 'w/', 'ὼ': 'w\\', 'ῶ': 'w=', 'ῳ': 'w|', 'ῴ': 'w|/', 'ῲ': 'w|\\', 'ῷ': 'w|=', 

        # Capital letters 
        'Α': 'A', 'Ἀ': 'A)', 'Ἁ': 'A(', 'Ἄ': 'A)/', 'Ἅ': 'A(/', 'Ἆ': 'A(=', 'Ἇ': 'A)=', 'Ά': 'A/', 'Ᾱ': 'A=', 'Ᾰ': 'A', 
        'Β': 'B', 'Γ': 'G', 'Δ': 'D', 
        'Ε': 'E', 'Ἐ': 'E)', 'Ἑ': 'E(', 'Ἔ': 'E)/', 'Ἕ': 'E(/', 'Ἒ': 'E)\\', 'Ἓ': 'E(\\', 'Έ': 'E/', 
        'Ζ': 'Z', 
        'Η': 'H', 'Ἠ': 'H)', 'Ἡ': 'H(', 'Ἤ': 'H)/', 'Ἥ': 'H(/', 'Ἦ': 'H)=', 'Ἧ': 'H(=', 'Ή': 'H/', 'ῌ': 'H|', 'Ή': 'H|/', 
        'Θ': 'Q)', 
        'Ι': 'I', 'Ἰ': 'I)', 'Ἱ': 'I(', 'Ἴ': 'I)/', 'Ἵ': 'I(/', 'Ἶ': 'I)=', 'Ἷ': 'I(=', 'Ί': 'I/', 'Ῑ': 'I=', 'Ῐ': 'I', 
        'Κ': 'K', 'Λ': 'L', 'Μ': 'M', 'Ν': 'N', 
        'Ξ': 'C', 
        'Ο': 'O', 'Ὀ': 'O)', 'Ὁ': 'O(', 'Ὄ': 'O)/', 'Ὅ': 'O(/', 'Ό': 'O/', 
        'Π': 'P', 
        'Ρ': 'R', 'Ῥ': 'R(', 
        'Σ': 'S', 'Τ': 'T', 
        'Υ': 'U', 'Ὑ': 'U(', 'Ὕ': 'U(/', 'Ὓ': 'U(\\', 'Ὗ': 'U(=', 'Ύ': 'U/', 'Ῡ': 'U=', 'Ῠ': 'U', 
        'Φ': 'F', 'Χ': 'X', 'Ψ': 'Y', 
        'Ω': 'W', 'Ὠ': 'W)', 'Ὡ': 'W(', 'Ὤ': 'W)/', 'Ὥ': 'W(/', 'Ὦ': 'W)=', 'Ὧ': 'W(=', 'Ώ': 'W/', 'ῼ': 'W|', 'Ώ': 'W|/' 
    }




    new_word = ''
    for char in word:
        if char in word_dict:
            new_word += word_dict[char]
        else:
            assert f"Character {char} not found in dictionary"

    return new_word

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
    
def get_speaker(lineNum):
    conn = get_db_connection()
    query = f'SELECT speaker FROM full_text WHERE line_number={lineNum}'
    data = conn.execute(query).fetchall()
    conn.close()

    # Check if any rows are returned
    if data:    
        row = data[0]  

        speaker = row["speaker"]        

        return speaker
    
    else:
        return None

# Takes greek word -> english -> hash -> SQL query for definition  
# Could use lemma from lemma_data table to get defs, may need to depending
def get_word_defs(lemma_id):
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

    full_arr = {}
    for i in range(1,10):
        char = postag[i-1]
        if char == '-':
            full_arr.update({i:'-'})
            continue
        # Part of speech
        if i == 1:
            full_arr.update({i:pos_dict[char]})
        # Person
        elif i == 2:
            full_arr.update({i:person_dict[char]})
        # Number
        elif i == 3:
            full_arr.update({i:number_dict[char]})
        # Tense
        elif i == 4:
            full_arr.update({i:tense_dict[char]})
        # Mood
        elif i == 5:
            full_arr.update({i:mood_dict[char]})
        # Voice
        elif i == 6:
            full_arr.update({i:voice_dict[char]})
        # Gender
        elif i == 7:
            full_arr.update({i:gender_dict[char]})
        # Case
        elif i == 8:
            full_arr.update({i:case_dict[char]})
        # Degree
        elif i == 9:
            full_arr.update({i:degree_dict[char]})
        else:
            break
            
    return full_arr

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

    ### NEW: Look for specific word from speaker

    ## So far I'm thinking, first iterate over lineNear - 50 through linesNear + 50
    # and see if speaker is present, return speaker_dict

    ## Then if linesNear == None iterate over full result list and nest array's for 'blocks' of speaker lines
    

    
    return []

### Make raw csv's downloadable?

# Would it be beneficial to send full_eng up with this data? I don't think it makes sense
@app.route('/AntigoneApp/word-details/<word>', methods=['GET'])
def get_word_details(word):
    
    return jsonify(lookup_word_details(word))

def add_defs(data, result_def):
    def_list = []
    for definition in result_def:
        def_num = definition['def_num']
        short_def = definition['short_def']
        queries = definition['queries']
        this_def = {'def_num':def_num, 'short_def':short_def, 'queries':queries}
        def_list.append(this_def)

    data.append({'definitions': def_list})

    return data

@app.route('/AntigoneApp/search', methods=['GET'])
def search():
    mode = request.args.get('mode')
    query = request.args.get('q')

    if not query or not mode:
        return jsonify({'error': 'Missing query or mode parameter'}), 400

    safe_query = query.strip()
    results = []

    try:
        if mode == 'definition':
            # Get all matching words first
            matching_words = search_by_definition(safe_query)
            # Then get details for each unique word
            unique_words = list(set(matching_words))  # Remove duplicates
            for word in unique_words:
                word_data = lookup_word_details(word)
                if word_data:
                    results.extend(word_data)  # Extend instead of assigning
                    
        elif mode == 'word':
            word_data = lookup_word_details(safe_query)
            if word_data:
                results = word_data
        else:
            return jsonify({'error': 'Invalid mode'}), 400

        return jsonify(results)

    except Exception as e:
        print(f"Error in search: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

def search_by_definition(query):
    conn = get_db_connection()
    try:
        # More precise search with word boundaries
        data = conn.execute(
            "SELECT DISTINCT lemma_id FROM lemma_definitions WHERE short_def LIKE ?",
            (f"% {query} %",)  # Search for whole words
        ).fetchall()
        return [row['lemma_id'] for row in data]
    finally:
        conn.close()

def get_word(lemma_id):
    conn = get_db_connection()
    try:
        data = conn.execute(
            "SELECT lemma FROM lemma_data WHERE lemma_id = ?", 
            (lemma_id,)
        ).fetchone()  # Just get one result
        return [data['lemma']] if data else []
    finally:
        conn.close()

def lookup_word_details(word):
    word = clean_word(word)
    norm = strip_accents(word)

    conn = get_db_connection()
    data = conn.execute("""
        SELECT lemma_id, lemma, form, line_number, postag
        FROM lemma_data
        WHERE lemma = ?
        OR form = ?
        OR normalized LIKE ?
        OR norm_form LIKE ?
        OR full_eng LIKE ?
        OR eng_lemma LIKE ?
        OR form_eng LIKE ?
        OR norm_form_eng LIKE ?
        ORDER BY 
            CASE 
                WHEN lemma = ? THEN 1
                WHEN form = ? THEN 2
                WHEN normalized LIKE ? THEN 3
                WHEN norm_form LIKE ? THEN 4
                WHEN full_eng LIKE ? THEN 5
                WHEN eng_lemma LIKE ? THEN 6
                WHEN form_eng LIKE ? THEN 7
                WHEN norm_form_eng LIKE ? THEN 8
                ELSE 9
            END,
            LENGTH(lemma),
            LENGTH(form),
            line_number
    """, (
        word, word, norm + '%', norm + '%', f'%{word}%', f'%{word}%', f'%{word}%', f'%{word}%',
        word, word, norm + '%', norm + '%', f'%{word}%', f'%{word}%', f'%{word}%', f'%{word}%'
    )).fetchall()

    conn.close()

    if not data:
        return {}

    row_dict = []
    for row in data:
        lemma_id = row['lemma_id']
        lemma = row['lemma']
        form = row['form']
        line_number = row['line_number']
        postag = row['postag']
        speaker = get_speaker(line_number)
        case_list = parse_postag(postag)
        result_def = get_word_defs(lemma_id)

        this_row = []
        this_row.append({'lemma_id': lemma_id, 'lemma': lemma, 'form': form, 'line_number': line_number, 'postag': postag, 'speaker': speaker})
        this_row.append({'case': case_list})
        if result_def:
            this_row = add_defs(this_row, result_def)

        row_dict.append(this_row)

    return row_dict


# Search api needs to identify if input is grk or eng,
# If grk -> grk_to_eng() -> hash_word() to get lemma_id
# Use full_eng, normalized, and lemma_id as search conditions
# Or determine what the word is supposed to be and search with it
# Will need to build this as frontend implementation grows, start with simple search that
# Redirects to word-details then as it grows make it it's own page.

# This may be frontend, but need to have something like I did with CarInfo typing into search bar.

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
