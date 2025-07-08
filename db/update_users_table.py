import mysql.connector
from mysql.connector import Error

DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Swami@2006',
    'database': 'hackorbit_'
}

REQUIRED_COLUMNS = {
    "email": "VARCHAR(100) UNIQUE",
    "full_name": "VARCHAR(100)",
    "role": "ENUM('admin', 'doctor', 'patient') DEFAULT 'patient'",
    "created_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
    "updated_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
}

def get_existing_columns(cursor):
    cursor.execute("SHOW COLUMNS FROM users;")
    return {col[0] for col in cursor.fetchall()}

def add_missing_columns(cursor, existing_columns):
    for col_name, col_def in REQUIRED_COLUMNS.items():
        if col_name not in existing_columns:
            alter_query = f"ALTER TABLE users ADD COLUMN {col_name} {col_def};"
            print(f"➕ Adding missing column: {col_name}")
            cursor.execute(alter_query)
        else:
            print(f"✅ Column '{col_name}' already exists.")

def main():
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            print("✅ Connected to MySQL")
            cursor = connection.cursor()
            
            existing_columns = get_existing_columns(cursor)
            add_missing_columns(cursor, existing_columns)

            connection.commit()
            print("\n✅ All required columns are present now.")

            cursor.close()
            connection.close()
            print("✅ Connection closed.")

    except Error as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
