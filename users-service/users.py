from flask import Flask, jsonify, request
import json
import sqlite3

app = Flask(__name__)

DATABASE = 'users.db'


def create_user_table():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            money INTEGER NOT NULL
        )
    ''')
    conn.commit()
    conn.close()


def add_user(username, password):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('SELECT user_id FROM users WHERE username=?', (username,))
    user_id = cursor.fetchall()
    if user_id:
        conn.close()
        return False

    cursor.execute('SELECT user_id FROM users')
    user_ids = cursor.fetchall()
    all_ids = []
    for row in user_ids:
        all_ids.append(row[0])

    all_ids.sort()
    new_id = 1
    if len(all_ids) > 0:
        new_id = all_ids[-1] + 1

    cursor.execute('''
            INSERT INTO users (user_id, username, password, money)
            VALUES (?, ?, ?, 0)
    ''', (new_id, username, password))

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
        return jsonify({'message': 'Login successful', 'user_id': user_id})
    else:
        return jsonify({'message': 'Login failed'}), 401


@app.route('/add-money', methods=['POST'])
def add_money():
    username = request.json.get('username')
    amount = request.json.get('amount')

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute('SELECT money FROM users WHERE username=?', (username,))
    current_money = cursor.fetchone()

    if current_money is None:
        conn.close()
        return jsonify({'message': 'User not found'}), 404

    new_money = current_money[0] + amount

    cursor.execute('UPDATE users SET money=? WHERE username=?',
                   (new_money, username))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Money added successfully', 'new_money': new_money})

@app.route('/users-list')
def users_list():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('SELECT user_id, username, password FROM users')
    data = cursor.fetchall()
    
    return jsonify({'data' : data})

if __name__ == '__main__':
    create_user_table()
    
    app.run(host='0.0.0.0', port=4000)
