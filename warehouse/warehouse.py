from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import pika
import json
import threading
import os
import time

app = Flask(__name__)
CORS(app)

DATABASE = 'warehouse.db'

RABBIT = os.environ['RABBIT']


def create_warehouse_table():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS warehouse (
            product_id INTEGER UNIQUE,
            quantity INTEGER NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/api/warehouse/get-all', methods=['GET'])
def get_all():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute(
        'SELECT product_id, quantity FROM warehouse')
    products = cursor.fetchall()
    
    conn.close()
    
    dataJSON = []

    for product in products:
        productJSON = {
            "id": product[0],
            "quantity": product[1]
        }
        dataJSON.append(productJSON)

    return jsonify(dataJSON)


@app.route('/api/warehouse/take', methods=['POST'])
def take_warehouse_products():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    product_id = request.json.get('product_id')
    quantity = request.json.get('quantity')

    cursor.execute(
        'SELECT product_id, quantity FROM warehouse WHERE product_id = ?', (product_id, ))
    products = cursor.fetchone()

    if not products:
        conn.close()
        return jsonify({'error': 'Error, no products found with this id'}), 400

    current_quantity = products[1]

    if current_quantity < quantity:
        conn.close()
        return jsonify({'error': 'Error, quantity is not enough'}), 400

    productJSON = {
        "id": products[0],
        "quantity": quantity
    }

    cursor.execute('UPDATE warehouse SET quantity=? WHERE product_id=?',
                   (current_quantity - quantity, product_id))
    conn.commit()
    conn.close()

    response = {
        'message': 'Got products successfully',
        'product': productJSON
    }
    return jsonify(response)

def send_message_to_queue(product_id, quantity):
    connection = pika.BlockingConnection(pika.ConnectionParameters(RABBIT))
    channel = connection.channel()
    channel.queue_declare(queue='warehouse_queue')
    message = {'product_id': product_id, 'quantity': quantity}
    channel.basic_publish(
        exchange='',
        routing_key='warehouse_queue',
        body=json.dumps(message)
    )
    connection.close()


# this uses RabbitMQ
@app.route('/api/warehouse/add', methods=['POST'])
def add_product_to_warehouse():
    try:
        product_id = int(request.json.get('product_id'))
        quantity = int(request.json.get('quantity'))
    except:
        return jsonify({'message': "Couldn't add product to database"})

    if (product_id is None or quantity is None or not 
        isinstance(product_id, int) or not isinstance(quantity, int)):
        return jsonify({'message': "Couldn't add product to database"})

    
    send_message_to_queue(product_id, quantity)

    return jsonify({'message': 'Product added to warehouse'})

def process_message(channel, method, properties, body):
    # Parse the message data
    message = json.loads(body)
    product_id = message['product_id']
    quantity = message['quantity']

    # Perform the database operation
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute(
        'SELECT product_id, quantity FROM warehouse WHERE product_id = ?',
        (product_id,)
    )
    products = cursor.fetchone()

    if not products:
        cursor.execute(
            'INSERT INTO warehouse (product_id, quantity) VALUES (?, ?)',
            (product_id, quantity)
        )
    else:
        cursor.execute(
            'UPDATE warehouse SET quantity = ? WHERE product_id = ?',
            (products[1] + int(quantity), product_id)
        )

    conn.commit()
    conn.close()

    # Acknowledge the message
    channel.basic_ack(delivery_tag=method.delivery_tag)

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

def start_consumer():
    connection = connect_to_rabbitmq()
    channel = connection.channel()
    channel.queue_declare(queue='warehouse_queue')
    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue='warehouse_queue', on_message_callback=process_message)

    print('Consumer started. Waiting for messages...')
    channel.start_consuming()

if __name__ == '__main__':
    print(RABBIT)
    create_warehouse_table()
    # Create a thread
    thread = threading.Thread(target=start_consumer)
    # Start the thread
    thread.start()
    app.run(host='0.0.0.0', port=8082)
