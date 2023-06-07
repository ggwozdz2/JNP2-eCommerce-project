from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import sqlite3

app = Flask(__name__)
CORS(app)

DATABASE = 'users.db'


def create_user_table():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            money REAL NOT NULL
        )
    ''')
    conn.commit()
    conn.close()


def add_user(username, password):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('SELECT user_id FROM users WHERE username=?', (username,))
    user_id = cursor.fetchone()
    if user_id:
        conn.close()
        return False

    cursor.execute('''
        INSERT INTO users (username, password, money)
        VALUES (?, ?, 0)
    ''', (username, password))

    conn.commit()
    conn.close()
    return True


@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute(
        'SELECT user_id FROM users WHERE username=? AND password=?', (username, password))
    user_ids = cursor.fetchone()
    conn.close()

    if user_ids:
        user_id = user_ids[0]
        return jsonify({'message': 'Login successful', 'userId': user_id})
    else:
        return jsonify({'message': 'Login failed', 'userId' : -1})


@app.route('/add-money', methods=['POST'])
def add_money():
    user_id = request.json.get('userId')
    amount = request.json.get('amount')
    amount = float(amount)

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute('SELECT money FROM users WHERE user_id=?', (user_id,))
    current_money = cursor.fetchone()

    if current_money is None:
        conn.close()
        return jsonify({'message': 'User not found'}), 404

    new_money = current_money[0] + amount
    new_money = round(new_money, 2)
    if new_money < 0:
        conn.close()
        return jsonify({'message' : 'Adding money error', 'new_money' : current_money[0]})

    cursor.execute('UPDATE users SET money=? WHERE user_id=?',
                   (new_money, user_id))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Money added successfully', 'new_money': new_money})


@app.route('/user-data/<int:id>')
def get_user_info(id):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute('SELECT username, money, user_id FROM users WHERE user_id=?', (id,))
    data = cursor.fetchone()

    conn.close()

    if data is None:
        return jsonify({'message': 'User not found'}), 404

    username, money, user_id = data
    money = round(money, 2)
    return jsonify({'username': username, 'money': money, 'userId': user_id})


@app.route('/users-list')
def users_list():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('SELECT user_id, username, password FROM users')
    data = cursor.fetchall()

    conn.close()

    return jsonify({'data': data})


if __name__ == '__main__':
    create_user_table()
    add_user("admin", "admin")
    add_user("Wojtek", "Woj")
    add_user("Greg", "Gre")
    app.run(host='0.0.0.0', port=4000)
