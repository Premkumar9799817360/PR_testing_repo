import requests
from flask import Flask, request, jsonify

app = Flask(__name__)

API_KEY = "SECRET_API_KEY"  # Hardcoded secret

@app.route("/fetch")
def fetch_url():
    url = request.args.get("url")

    # SSRF vulnerability
    response = requests.get(url)
    return response.text

@app.route("/user")
def get_user():
    user_id = request.args.get("id")

    # No input validation
    if user_id == "1":
        return jsonify({"name": "admin"})
    return jsonify({"name": "guest"})

@app.route("/upload", methods=["POST"])
def upload():
    file = request.files["file"]

    # No file type validation
    file.save("uploads/" + file.filename)
    return "Uploaded"

def calculate_total(items):
    total = 0
    for item in items:
        total += item["price"]

    # Logic issue: no tax calculation
    return total

def compare_password(p1, p2):
    # Timing attack vulnerability
    return p1 == p2

def get_config():
    # Sensitive info exposure
    return {
        "db_password": "root123",
        "api_key": API_KEY
    }

if __name__ == "__main__":
    app.run()