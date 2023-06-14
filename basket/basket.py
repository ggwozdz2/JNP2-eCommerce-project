from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import sqlite3
import pika
import requests
import os
import time

app = Flask(__name__)
CORS(app)

DATABASE = 'baskets.db'

RABBIT = os.environ['RABBIT']
WAREHOUSE = 'http://' + os.environ['WAREHOUSE']
PRODUCTS = 'http://' + os.environ['PRODUCTS']
USERS = "http://" + os.environ['USERS']

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

    data = {
        "product_id": product_id,
        "quantity": 1
    }
    response = requests.post(
        WAREHOUSE + '/api/warehouse/take', json=data)

    if response.status_code == 400:
        responseJSON = response.json()
        return jsonify({'message': responseJSON['error']})

    response = requests.get(
        PRODUCTS + '/api/products/get/' + str(product_id))
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

    # user_ids = cursor.fetchone()

    conn.commit()
    conn.close()

    return jsonify({'message': 'Product added successfully'})

def connect_to_rabbitmq():
    connection = None
    attempts = 0

    while attempts < 100:
        try:
            connection = pika.BlockingConnection(pika.ConnectionParameters(RABBIT))
            break
        except pika.exceptions.AMQPConnectionError:
            time.sleep(1)
            attempts += 1

    return connection

def send_message_to_queue(product_id, quantity):
    connection = connect_to_rabbitmq()
    channel = connection.channel()
    channel.queue_declare(queue='warehouse_queue')
    message = {'product_id': product_id, 'quantity': quantity}
    channel.basic_publish(
        exchange='',
        routing_key='warehouse_queue',
        body=json.dumps(message)
    )
    connection.close()


@app.route('/api/baskets/delete/<int:basket_id>', methods=['GET'])
def delete_basket(basket_id):
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute('SELECT productId FROM baskets WHERE id = ?', (basket_id,))

    product = cursor.fetchone()

    if product is not None:
        product_id = product[0]
        send_message_to_queue(product_id, 1)

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
        response = requests.post(
            USERS + '/add-money', json={'userId': user_id, 'amount': -total})
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
