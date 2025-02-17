import sqlite3
import pandas as pd

def create_database(db_name="antigone.db"):
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()

    # Drop tables if they exist
    cursor.execute('DROP TABLE IF EXISTS lemma_data')
    cursor.execute('DROP TABLE IF EXISTS lemma_definitions')
    cursor.execute('DROP TABLE IF EXISTS num_word')
    
    
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
            case_type TEXT,
            number TEXT,
            gender TEXT,
            voice TEXT,
            tense TEXT,
            mood TEXT,
            person TEXT,
            ppl_voice TEXT,
            ppl_tense TEXT,
            ppl_gender TEXT,
            ppl_case TEXT,
            prn_type TEXT,
            prn_case TEXT,
            prn_gender TEXT,
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
        )
    ''')
    
    # Create num_word table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS num_word (
            lemma_id INTEGER,
            headword TEXT,
            PRIMARY KEY (lemma_id),
            FOREIGN KEY (lemma_id) REFERENCES lemma_definitions(lemma_id)
        )
    ''')
    
    conn.commit()
    conn.close()

def insert_data(wordList_csv, vocabList_csv, defList_csv, db_name="antigone.db"):
    conn = sqlite3.connect(db_name)
    
    # Load CSVs into DataFrames
    lemma_data_df = pd.read_csv(wordList_csv)
    num_word_df = pd.read_csv(vocabList_csv)
    lemma_definitions_df = pd.read_csv(defList_csv)
    
    num_word_df.to_sql("num_word", conn, if_exists="append", index=False)
    
    lemma_data_df.to_sql("lemma_data", conn, if_exists="append", index=False)

    lemma_definitions_df.to_sql("lemma_definitions", conn, if_exists="append", index=False)
    
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
    insert_data("database/csv/wordList.csv", "database/csv/vocabList.csv", "database/csv/defList.csv")
    print("Data import complete.")