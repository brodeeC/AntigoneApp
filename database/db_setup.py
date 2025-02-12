import sqlite3

# Connect to SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect('antigone.db')
cursor = conn.cursor()

# Create table for storing words
cursor.execute('''
CREATE TABLE IF NOT EXISTS words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word TEXT UNIQUE
);
''')

# Insert words into database


# Commit and close
conn.commit()
conn.close()

print("Database setup complete!")







