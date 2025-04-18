import sqlite3
import pandas as pd

def create_database(db_name='backend/database/antigone.db'):
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    # Drop tables if they exist
    cursor.execute('DROP TABLE IF EXISTS lemma_data')
    cursor.execute('DROP TABLE IF EXISTS lemma_definitions')
    cursor.execute('DROP TABLE IF EXISTS full_text')
    
    
    # Create lemma_data table with composite primary key and foreign key
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS lemma_data (
            lemma_id INTEGER,
            line_number INTEGER,
            lemma TEXT,
            full_eng TEXT,
            urn TEXT,
            normalized TEXT,
            eng_lemma TEXT,
            form TEXT,
            norm_form TEXT,
            postag TEXT,
            form_eng TEXT,
            norm_form_eng TEXT,
            PRIMARY KEY (lemma_id, line_number)
        )
    ''')

    # Create lemma_definitions table first
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS lemma_definitions (
            lemma_id INTEGER,
            def_num INTEGER,
            short_definition TEXT,
            queries TEXT,
            PRIMARY KEY (lemma_id, def_num)
            FOREIGN KEY (lemma_id) REFERENCES lemma_data(lemma_id)
        )
    ''')

    # Create db for full text
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS full_text (
            line_number INTEGER,
            line_text TEXT,
            speaker TEXT,
            norm_speaker TEXT,
            eng_speaker TEXT,
            PRIMARY KEY (line_number)
        )           

    ''')

    conn.commit()
    conn.close()

def insert_data(wordList_csv, defList_csv, lines_csv, db_name='backend/database/antigone.db'):
    conn = sqlite3.connect(db_name)
    
    # Load CSVs into DataFrames
    lemma_data_df = pd.read_csv(wordList_csv)
    lemma_definitions_df = pd.read_csv(defList_csv)
    full_text_df = pd.read_csv(lines_csv)

    full_text_df["line_number"] = pd.to_numeric(full_text_df["line_number"], errors="coerce") 
    full_text_df = full_text_df.dropna(subset=["line_number"])  
    full_text_df["line_number"] = full_text_df["line_number"].astype(int)
        
    lemma_data_df.to_sql("lemma_data", conn, if_exists="append", index=False)

    lemma_definitions_df.to_sql("lemma_definitions", conn, if_exists="append", index=False)

    full_text_df.to_sql("full_text", conn, if_exists="append", index=False)
    
    conn.commit()
    conn.close()

def check_duplicates(file_path):
    # Load the CSV file into a DataFrame
    df = pd.read_csv(file_path)
    
    # Check for duplicate combinations of lemma_id and short_definition
    duplicates = df[df.duplicated(subset=['lemma_id', 'def_num'], keep=False)]
    
    if not duplicates.empty:
        print("Duplicate combinations of lemma_id and short_definition found:")
        print(duplicates)
    else:
        print("No duplicates found.")


if __name__ == "__main__":
    create_database()
    insert_data("backend/database/csv/wordList.csv", "backend/database/csv/defList.csv", "backend/database/csv/lines.csv")
    print("Data import complete.")