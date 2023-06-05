from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import sqlite3

app = Flask(__name__)
CORS(app)

DATABASE = 'products.db'

def create_products_table():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT CHECK(length(name) <= 100) NOT NULL,
            description TEXT,
            price REAL NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/api/products/create', methods=['POST'])
def create_product():
    name = request.json.get('name')
    description = request.json.get('description')
    price = request.json.get('price')

    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute(
        '''
        INSERT INTO products (name, description, price)
         VALUES(?, ?, ?)
        ''', (name, description, price))
    
    #user_ids = cursor.fetchone()
    
    conn.commit()
    conn.close()

    return jsonify({'message': 'Product created successfully'})

@app.route('/api/products/delete/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute('DELETE FROM products WHERE id = ?', (product_id,))

    conn.commit()
    conn.close()

    return jsonify({'message': 'Product deleted successfully'})

@app.route('/api/products/get/<int:product_id>', methods=['GET'])
def get_product(product_id):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM products WHERE id = ?', (product_id,))
    product = cursor.fetchone()

    conn.close()

    if product is None:
        return jsonify({'message': 'Product not found'}), 404

    product_dict = {
        'id': product[0],
        'name': product[1],
        'description': product[2],
        'price': product[3]
    }

    return jsonify(product_dict)

@app.route('/api/products/all', methods=['GET'])
def get_all_products():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM products')
    products = cursor.fetchall()
    
    dataJSON = []

    for product in products:
        productJSON = {
            "id": product[0],
            "name": product[1],
            "description": product[2],
            "price": product[3]
        }
        dataJSON.append(productJSON)

    return jsonify(dataJSON)

if __name__ == '__main__':
    create_products_table()
    app.run(host='0.0.0.0', port=8080)
