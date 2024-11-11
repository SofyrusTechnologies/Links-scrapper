import sqlite3
import csv

# Define the CSV and SQLite file paths
csv_file_path = 'cleaned_data.csv'  # Replace with your actual CSV file path
sqlite_db_path = 'updated_data.db'  # Replace with your SQLite database file path

try:
    # Connect to the SQLite database (or create it if it doesn't exist)
    conn = sqlite3.connect(sqlite_db_path)
    cursor = conn.cursor()

    # # Create a table with all columns set to TEXT type
    create_table_query = '''
    CREATE TABLE data_table (
    copyright_claimant TEXT,
    application_title_statement TEXT,
    email TEXT,
    registration_number TEXT,
    registration_date TEXT,
    year_of_creation INT,
    record_status TEXT,
    physical_description TEXT,
    personal_authors TEXT,
    corporate_authors TEXT,
    rights_note TEXT,
    author_statement TEXT,
    authorship TEXT
    );
    '''
    cursor.execute(create_table_query)
    print("Table created successfully!")

    # Check for existing tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    print("Existing tables:", tables)

    # Open and read the CSV file, then insert each row into the database
    with open(csv_file_path, 'r', encoding='utf-8') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        row_count = 0
        
        for row in csv_reader:
         cursor.execute(''' 
            INSERT OR IGNORE INTO data_table (
                copyright_claimant, 
                application_title_statement, 
                email, 
                registration_number, 
                registration_date, 
                year_of_creation, 
                record_status, 
                physical_description, 
                personal_authors, 
                corporate_authors, 
                rights_note, 
                author_statement, 
                authorship
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ''', (
            row['Copyright Claimant'],
            row['Application Title Statement'],
            row['Email'],
            row['Registration Number'],
            row['Registration Date'],
            row['Year of Creation'],
            row['Record Status'],
            row['Physical Description'],
            row['Personal Authors'],
            row['Corporate Authors'],
            row['Rights Note'],
            row['Author Statement'],
            row['Authorship']
              ))
        row_count += 1

    # Commit changes
    conn.commit()
    print(f"{row_count} rows imported successfully!")

except sqlite3.Error as e:
    print(f"An error occurred: {e}")
finally:
    # Ensure the connection is closed
    if conn:
        conn.close()
