import json
from flask import Flask, jsonify
import sqlite3

app = Flask(__name__)

# Database connection
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
        row = data[0]  # Access the row

        print(row['line_text'])

        # Directly decode the line_text and speaker from Unicode escapes
        line_text = row["line_text"]
        speaker = row["speaker"]
        

        return line_text, speaker
    
    else:
        return None
    
@app.route('/AntigoneApp/AntigoneApp/read/<int:page>', methods=['GET'])
def get_page(page):
    maxLine = (page*11) + 1
    minLine = ((page-1)*11) + 1

    page_dict = []

    for line in range(minLine, maxLine):
        result = get_line(line)
        if result:  # If result is not None
            text, speaker = result
            page_dict.append({"lineNum":line, "line_text":text, "speaker":speaker})

    return jsonify(page_dict)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
