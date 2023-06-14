import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const Warehouse = () => {
    const [productID, setProductID] = useState('');
    const [quantity, setQuantity] = useState('');
    const [message, setMessage] = useState('');
    const [productList, setProductList] = useState([]);

    const handleAddProduct = () => {
        const productData = {
            product_id: productID,
            quantity: quantity,
        };

        axios
            .post('http://localhost:8082/api/warehouse/add', productData)
            .then((response) => {
                const message = response.data.message;
                console.log(message);
                setMessage(message);
            })
            .catch((error) => {
                console.error('Error adding product:', error);
                setMessage('Error adding product');
            });
    };

    const getAllProductsList = () => {
        axios
            .get('http://localhost:8080/api/products/all')
            .then((response) => {
                const jsonData = response.data;
                const dataArray = Object.values(jsonData);
                setProductList(dataArray);
                console.log('Success');
                console.log(dataArray);
            })
            .catch((error) => {
                console.error('Error fetching list', error);
                setProductList([]);
            });
    };

    useEffect(() => {
        getAllProductsList();
    }, []);

    return (
        <div>
            <h2>Add Product to Warehouse</h2>
            <form>
                <div>
                    <label>Product ID</label>
                    <br />
                    <input
                        type="number"
                        value={productID}
                        onChange={(e) => setProductID(e.target.value)}
                    />
                </div>
                <div>
                    <label>Quantity</label>
                    <br />
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                </div>
                <br />
                <button type="button" onClick={handleAddProduct}>
                    Add Product
                </button>
            </form>
            {message && <p>{message}</p>}

            <div>
                <h3>Product List</h3>
                <ul>
                    {productList.map((product) => (
                        <li class="" key={product.id}>{product.id} {product.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Warehouse;
