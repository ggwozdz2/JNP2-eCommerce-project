from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import sqlite3
import requests

app = Flask(__name__)
CORS(app)

DATABASE = 'baskets.db'

def create_baskets_table():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS baskets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            productId INTEGER NOT NULL,
            name TEXT NOT NULL,
            price REAL NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/api/baskets/create', methods=['POST'])
def create_basket():
    user_id = request.json.get('userId')
    product_id = request.json.get('productId')
    
    response = requests.get('http://localhost:8080/api/products/get/' + str(product_id))
    productJSON = response.json()
    name = productJSON['name']
    price = productJSON['price']

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute(
        '''
        INSERT INTO baskets (userId, productId, name, price)
         VALUES(?, ?, ?, ?)
        ''', (user_id, product_id, name, price))
    
    #user_ids = cursor.fetchone()
    
    conn.commit()
    conn.close()

    return jsonify({'message': 'Basket created successfully'})

@app.route('/api/baskets/delete/<int:basket_id>', methods=['GET'])
def delete_basket(basket_id):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute('DELETE FROM baskets WHERE id = ?', (basket_id,))

    conn.commit()
    conn.close()

    return jsonify({'message': 'Basket deleted successfully'})

@app.route('/api/baskets/all', methods=['GET'])
def get_all_baskets():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM baskets')

    baskets = cursor.fetchall()

    conn.close()

    dataJSON = []
    for basket in baskets:
        basketJSON = {
            'id': basket[0],
            'userId': basket[1],
            'productId': basket[2],
            'name': basket[3],
            'price': basket[4]
        }
        dataJSON.append(basketJSON)

    return jsonify(dataJSON)

def user_basket_json(user_id):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM baskets WHERE userId = ?', (user_id,))

    baskets = cursor.fetchall()

    conn.close()

    dataJSON = []
    for basket in baskets:
        basketJSON = {
            'id': basket[0],
            'productId': basket[2],
            'name': basket[3],
            'price': basket[4]
        }
        dataJSON.append(basketJSON)

    return dataJSON

@app.route('/api/baskets/user-basket/<int:user_id>', methods=['GET'])
def get_user_basket(user_id):
    dataJSON = user_basket_json(user_id)
    return jsonify(dataJSON)

@app.route('/api/baskets/submit-order/<int:user_id>', methods=['GET'])
def submit_order(user_id):
    dataJSON = user_basket_json(user_id)
    total = 0
    for basket in dataJSON:
        total += basket['price']
    if total > 0:
        response = requests.post('http://localhost:4000/add-money', json={'userId': user_id, 'amount': -total})
        if response.json()['message'] == 'Money added successfully':
            conn = sqlite3.connect(DATABASE)
            cursor = conn.cursor()
            cursor.execute('DELETE FROM baskets WHERE userId = ?', (user_id,))
            conn.commit()
            conn.close()
            return jsonify({'message': 'Order submitted successfully'})
        else:
            return jsonify({'message': 'Error, not enough money'})
    else:
        return jsonify({'message': 'Error, no products in basket'})

if __name__ == '__main__':
    create_baskets_table()
    app.run(host='0.0.0.0', port=8081)
