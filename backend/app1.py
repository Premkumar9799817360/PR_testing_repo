import sqlite3
import os
from flask import Flask, request

app = Flask(__name__)

DB = "users.db"

def get_db():
    return sqlite3.connect(DB)

# Hardcoded secret (security issue)
SECRET_KEY = "123456"

@app.route("/login", methods=["POST"])
def login():
    username = request.form.get("username")
    password = request.form.get("password")

    conn = get_db()
    cursor = conn.cursor()

    # SQL Injection vulnerability
    query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
    cursor.execute(query)

    user = cursor.fetchone()

    if user:
        return "Login Success"
    else:
        return "Invalid"

@app.route("/read_file")
def read_file():
    filename = request.args.get("file")

    # Path traversal vulnerability
    with open(filename, "r") as f:
        return f.read()

@app.route("/exec")
def exec_code():
    code = request.args.get("code")

    # Remote Code Execution vulnerability
    exec(code)
    return "Executed"

def divide(a, b):
    # Logic issue: no zero check
    return a / b

if __name__ == "__main__":
    app.run(debug=True)  # Debug enabled in production