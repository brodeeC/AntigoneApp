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


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
