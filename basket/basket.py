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
            productId INTEGER NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/api/baskets/create', methods=['POST'])
def create_basket():
    userId = request.json.get('userId')
    productId = request.json.get('productId')

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute(
        '''
        INSERT INTO baskets (userId, productId)
         VALUES(?, ?)
        ''', (userId, productId))
    
    #user_ids = cursor.fetchone()
    
    conn.commit()
    conn.close()

    return jsonify({'message': 'Basket created successfully'})

@app.route('/api/baskets/delete/<int:basket_id>', methods=['DELETE'])
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
            'productId': basket[2]
        }
        dataJSON.append(basketJSON)

    return jsonify(dataJSON)

@app.route('/api/baskets/user-basket/<int:user_id>', methods=['GET'])
def get_user_basket(user_id):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM baskets WHERE userId = ?', (user_id,))

    baskets = cursor.fetchall()

    conn.close()

    dataJSON = []
    for basket in baskets:
        product_id = basket[2]
        response = requests.get('http://localhost:8080/api/products/get/' + str(product_id))
        productJSON = response.json()
        dataJSON.append(productJSON)

    return jsonify(dataJSON)

if __name__ == '__main__':
    create_baskets_table()
    app.run(host='0.0.0.0', port=8081)
