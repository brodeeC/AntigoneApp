import sqlite3

def test_database_integrity(db_name="antigone.db"):
    conn = sqlite3.connect(db_name)
    cursor = conn.cursor()
    
    queries = {
        "Total rows in lemma_definitions": "SELECT COUNT(*) FROM lemma_definitions;",
        "Total rows in lemma_data": "SELECT COUNT(*) FROM lemma_data;",
        "Check for duplicate lemma_id in lemma_definitions": """
            SELECT lemma_id, COUNT(*) 
            FROM lemma_definitions 
            GROUP BY lemma_id 
            HAVING COUNT(*) > 1;
        """,
        "Check for orphaned lemma_id in lemma_data": """
            SELECT DISTINCT lemma_id 
            FROM lemma_data 
            WHERE lemma_id NOT IN (SELECT lemma_id FROM lemma_definitions);
        """,
        "Sample data from lemma_definitions": "SELECT * FROM lemma_definitions LIMIT 10;",
        "Sample data from lemma_data": "SELECT * FROM lemma_data LIMIT 10;",
        "Find all records for lemma_id = 0": "SELECT * FROM lemma_data WHERE lemma_id = 0;",
        "Check for missing values in lemma_data": """
            SELECT * FROM lemma_data WHERE lemma IS NULL OR full_eng IS NULL;
        """,
        
        "Find def of lemma_id = 120373959": """
            SELECT short_definition FROM lemma_definitions WHERE lemma_id = 120373959;
        """
    }
## Use LIKE in a query
    for description, query in queries.items():
        print(f"\n--- {description} ---")
        cursor.execute(query)
        results = cursor.fetchall()
        
        if results:
            for row in results:
                print(row)
        else:
            print("No issues found.")

    conn.close()

if __name__ == "__main__":
    test_database_integrity()
