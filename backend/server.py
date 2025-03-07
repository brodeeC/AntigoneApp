import json
from flask import Flask, jsonify
import sqlite3

app = Flask(__name__)

# Database connection
def get_db_connection():
    conn = sqlite3.connect('backend/database/antigone.db')  # Update path to your DB
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/AntigoneApp/AntigoneApp/read/<lineNum>', methods=['GET'])
def get_data(lineNum):
    conn = get_db_connection()
    query = f'SELECT line_text, speaker FROM full_text WHERE line_number={lineNum}'
    data = conn.execute(query).fetchall()
    conn.close()

    # Check if any rows are returned
    if data:
        row = data[0]  # Access the first row
        return json.dumps({
            "line_text": row["line_text"],
            "speaker": row["speaker"]
        })
    else:
        return jsonify({"error": "No data found"}), 404

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
