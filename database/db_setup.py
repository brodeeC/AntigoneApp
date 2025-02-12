import sqlite3
import pandas as pd

def create_database(db_name="antigone.db"):
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()
    
    # Create first table with composite primary key and foreign key
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
            PRIMARY KEY (lemma_id, line_number),
            FOREIGN KEY (lemma_id) REFERENCES lemma_definitions(lemma_id)
        )
    ''')
    
    # Create second table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS num_word (
            lemma_id INTEGER,
            headword TEXT,
            PRIMARY KEY (lemma_id)
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS lemma_definitions (
            lemma_id INTEGER,
            def_number INTEGER,
            short_definition TEXT,
            FOREIGN KEY (lemma_id) REFERENCES lemma_data(lemma_id),
            PRIMARY KEY (lemma_id, def_number)
            
        )
    ''')
    
    conn.commit()
    conn.close()

def insert_data(lemma_data_csv, lemma_definitions_csv, def_csv, db_name="antigone.db"):
    conn = sqlite3.connect(db_name)
    
    # Load CSVs into DataFrames
    lemma_data_df = pd.read_csv(lemma_data_csv)
    lemma_definitions_df = pd.read_csv(lemma_definitions_csv)
    def_df = pd.read_csv(def_csv)
    
    # Insert into lemma_definitions first (since lemma_data references it)
    lemma_definitions_df.to_sql("lemma_definitions", conn, if_exists="append", index=False)
    
    # Insert into lemma_data
    lemma_data_df.to_sql("lemma_data", conn, if_exists="append", index=False)

    # Insert into def_list
    def_df.to_sql("def_list", conn, if_exists="append", index=False)
    
    conn.commit()
    conn.close()

if __name__ == "__main__":
    create_database()
    insert_data("database/csv/wordList.csv", "database/csv/vocabList.csv", "database/csv/defList.csv")
    print("Data import complete.")