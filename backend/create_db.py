import sys
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def create_database():
    username = "postgres"
    password = "nithil"
    host = "localhost"
    port = "5432"
    dbname = "hotel_db"

    print(f"Connecting to PostgreSQL server at {host}:{port} as user '{username}'...")
    try:
        # Connect to the default 'postgres' database to check/create the target database
        conn = psycopg2.connect(
            user=username,
            password=password,
            host=host,
            port=port,
            database="postgres"
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Check if database already exists
        cursor.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{dbname}';")
        exists = cursor.fetchone()
        
        if not exists:
            print(f"Database '{dbname}' does not exist. Creating...")
            cursor.execute(f"CREATE DATABASE {dbname};")
            print(f"Database '{dbname}' created successfully.")
        else:
            print(f"Database '{dbname}' already exists.")
            
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"\n[ERROR] Failed to connect to PostgreSQL server: {e}", file=sys.stderr)
        print("\nPlease make sure that:", file=sys.stderr)
        print("1. Your local PostgreSQL server is running.", file=sys.stderr)
        print(f"2. The credentials (username: '{username}', password: '{password}') are correct.", file=sys.stderr)
        print("3. pgAdmin/PostgreSQL is listening on port 5432.", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    create_database()
