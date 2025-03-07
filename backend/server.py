from flask import Flask, jsonify
import sqlite3

app = Flask(__name__)

# Database connection
def get_db_connection():
    conn = sqlite3.connect('/database/antigone.db')  # Update path to your DB
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/AntigoneApp/AntigoneApp/api/read/<lineNum>', methods=['GET'])
def get_data():
    conn = get_db_connection()
    data = conn.execute('SELECT * FROM your_table').fetchall()
    conn.close()
    return jsonify([dict(row) for row in data])

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)