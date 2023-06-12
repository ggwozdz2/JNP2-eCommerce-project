// Adding to warehouse, only if your are admin

import React, { useState } from 'react'
import axios from 'axios'
import '../App.css'

const Warehouse = () => {

    const [productID, setProductID] = useState('');
    const [quantity, setQuantity] = useState('');
    const [message, setMessage] = useState('');

    const handleAddProduct = () => {
        const productData = {
            product_id: productID,
            quantity: quantity
        };

        axios
            .post('http://localhost:8082/api/warehouse/add', productData)
            .then(response => {
                console.log('Product added successfully');
                setMessage('Product added successfully');
                // Add any additional handling or state updates here
            })
            .catch(error => {
                console.error('Error adding product:', error);
                setMessage('Error adding product');
                // Handle error condition here if needed
            });
    };

    return (
        <div>
            <h2>Add Product to Warehouse</h2>
            <form>
                <div>
                    <label>Product ID</label><br></br>
                    <input
                        type="number"
                        value={productID}
                        onChange={e => setProductID(e.target.value)}
                    />
                </div>
                <div>
                    <label>Quantity</label><br></br>
                    <input
                        type="number"
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                    />
                </div>
                <br></br>
                <button type="button" onClick={handleAddProduct}>
                    Add Product
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Warehouse
