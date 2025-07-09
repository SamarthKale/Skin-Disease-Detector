"""
Database Setup Script for VedaralaAI
This script creates the complete database schema and initial data for the healthcare application.
"""

import mysql.connector
from mysql.connector import Error
import bcrypt

def setup_database():
    """Create database and all tables with proper schema"""
    try:
        # Connect to MySQL without specifying database
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='Kunal@123'
        )

        if connection.is_connected():
            print("✅ Connected to MySQL")
            cursor = connection.cursor()
            
            # Create database
            cursor.execute("CREATE DATABASE IF NOT EXISTS hackorbit_db")
            print("✅ Database 'hackorbit_db' created/verified")
            
            # Use the database
            cursor.execute("USE hackorbit_db")
            
            # Create users table with enhanced schema
            create_users_table = """
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                email VARCHAR(100) UNIQUE,
                full_name VARCHAR(100),
                role ENUM('admin', 'doctor', 'patient') DEFAULT 'patient',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
            """
            cursor.execute(create_users_table)
            print("✅ Users table created/verified")
            
            # Create patient_records table
            create_patient_records_table = """
            CREATE TABLE IF NOT EXISTS patient_records (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                date_of_birth DATE,
                gender ENUM('male', 'female', 'other'),
                phone VARCHAR(20),
                address TEXT,
                medical_history TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
            """
            cursor.execute(create_patient_records_table)
            print("✅ Patient records table created/verified")
            
            # Create skin_analysis table
            create_skin_analysis_table = """
            CREATE TABLE IF NOT EXISTS skin_analysis (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                image_path VARCHAR(255),
                prediction VARCHAR(100),
                confidence DECIMAL(5,2),
                analysis_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                notes TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
            """
            cursor.execute(create_skin_analysis_table)
            print("✅ Skin analysis table created/verified")
            
            # Insert default admin user
            admin_password = "admin123"
            hashed_password = bcrypt.hashpw(admin_password.encode('utf-8'), bcrypt.gensalt()).decode()
            
            insert_admin_query = """
            INSERT INTO users (username, password_hash, email, full_name, role) 
            VALUES ('admin', %s, 'admin@vedaralaai.com', 'System Administrator', 'admin')
            ON DUPLICATE KEY UPDATE username=username
            """
            cursor.execute(insert_admin_query, (hashed_password,))
            print("✅ Default admin user created/verified")
            
            # Insert test user
            test_password = "test123"
            test_hashed_password = bcrypt.hashpw(test_password.encode('utf-8'), bcrypt.gensalt()).decode()
            
            insert_test_query = """
            INSERT INTO users (username, password_hash, email, full_name, role) 
            VALUES ('testuser', %s, 'test@vedaralaai.com', 'Test User', 'patient')
            ON DUPLICATE KEY UPDATE username=username
            """
            cursor.execute(insert_test_query, (test_hashed_password,))
            print("✅ Test user created/verified")
            
            connection.commit()
            cursor.close()
            connection.close()
            print("✅ Database setup completed successfully")
            print("\n📋 Default Credentials:")
            print("   Admin: username='admin', password='admin123'")
            print("   Test:  username='testuser', password='test123'")

    except Error as e:
        print(f"❌ Database Error: {e}")
    except Exception as e:
        print(f"❌ General Error: {e}")

if __name__ == "__main__":
    setup_database() 