import json
from flask import Flask, jsonify
import sqlite3

app = Flask(__name__)

# Database connection
def get_db_connection():
    conn = sqlite3.connect('backend/database/antigone.db')  # Update path to your DB
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/AntigoneApp/AntigoneApp/oneLine/<lineNum>', methods=['GET'])
def get_line(lineNum):
    conn = get_db_connection()
    query = f'SELECT line_text, speaker FROM full_text WHERE line_number={lineNum}'
    data = conn.execute(query).fetchall()
    conn.close()

    # Check if any rows are returned
    if data:
        row = data[0]  # Access the row

        line_text = json.loads(f'"{row["line_text"]}"')
        speaker = json.loads(f'"{row["speaker"]}"')
        return json.dumps({
            "line_text": line_text,
            "speaker": speaker
        })
    else:
        return jsonify({"error": "No data found"}), 404
    
@app.route('/AntigoneApp/AntigoneApp/read/<page>', methods=['GET'])
def get_page(page):
    maxLine = page*11
    minLine = ((page-1)*11) + 1

    page_dict = []
    page_dict.append(page)
    # for line in range(minLine, maxLine):
    #     data = get_line(line)
    #     row = data[0]
    #     line_text = json.loads(f'"{row["line_text"]}"')
    #     speaker = json.loads(f'"{row["speaker"]}"')

    #     page_dict.append({"lineNum":line, "line_text":line_text, "speaker":speaker})

    return page_dict



if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
