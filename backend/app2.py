import hashlib
import random
import pickle
from flask import request

# Weak hashing (MD5)
def hash_password(password):
    return hashlib.md5(password.encode()).hexdigest()

# Insecure random token
def generate_token():
    return str(random.random())

# Hardcoded credentials
ADMIN_USER = "admin"
ADMIN_PASS = "admin123"

def authenticate(user, password):
    if user == ADMIN_USER and password == ADMIN_PASS:
        return True
    return False

def load_user_data(data):
    # Insecure deserialization
    return pickle.loads(data)

def save_user_data(obj):
    return pickle.dumps(obj)

def calculate_discount(price, discount):
    # Logic bug: allows negative discount
    return price - discount

def get_user_input():
    # No validation
    return input("Enter value: ")

def process():
    user_input = get_user_input()

    # Command injection risk
    import os
    os.system("echo " + user_input)

def check_access(role):
    # Broken access control
    if role == "user":
        return True
    return True  # Always true (bug)

def unsafe_eval(expr):
    # Eval injection
    return eval(expr)