import mysql.connector
from mysql.connector import Error
import bcrypt

# Update this with your database connection info
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Swami@2006',
    'database': 'hackorbit_'
}

def add_user(username, password, email=None, full_name=None, role='patient'):
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            print("✅ Connected to MySQL")

            cursor = connection.cursor()

            # Hash the password
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode()

            # Insert user query
            query = """
            INSERT INTO users (username, password_hash, email, full_name, role)
            VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(query, (username, hashed_password, email, full_name, role))
            connection.commit()

            print(f"✅ User '{username}' added successfully.")

            cursor.close()
            connection.close()
            print("✅ Connection closed.")
    except Error as e:
        print(f"❌ Error: {e}")

def list_users():
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            cursor = connection.cursor()
            cursor.execute("SELECT id, username, email, full_name, role FROM users")
            users = cursor.fetchall()

            print("\n📋 Users in database:")
            print("ID | Username | Email | Full Name | Role")
            print("-" * 60)
            for user in users:
                print(f"{user[0]} | {user[1]} | {user[2] or 'N/A'} | {user[3] or 'N/A'} | {user[4]}")

            cursor.close()
            connection.close()
    except Error as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    # 👇 You can change these values to add new test users
    add_user("testuser", "testpass123", "testuser@example.com", "Test User", "patient")
    list_users()
