import pika, json
import sqlite3

DATABASE = ('warehouse.db')

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
            (products[1] + quantity, product_id)
        )

    conn.commit()
    conn.close()

    # Acknowledge the message
    channel.basic_ack(delivery_tag=method.delivery_tag)

def start_consumer():
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()
    channel.queue_declare(queue='warehouse_queue')
    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue='warehouse_queue', on_message_callback=process_message)

    print('Consumer started. Waiting for messages...')
    channel.start_consuming()

if __name__ == '__main__':
    start_consumer()
