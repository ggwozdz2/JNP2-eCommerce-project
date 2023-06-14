import React, { useState } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const NewProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  localStorage.setItem('message', '');

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const handleSubmit = async (e) => {
    console.log('Submit new product');

    e.preventDefault();

    const response = await fetch('http://localhost:8080/api/products/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description, price }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Product added:', data);

      if (data.message === 'Product created successfully') {
        navigate('/warehouse');
        window.location.reload();
      }
      else {
        setError('Error adding product');
      }
    } else {
      const errorData = await response.json();
      console.error('Error adding product:', errorData.message);
      setError('Error adding product');
    }
  };

  return (
    <div className="App-content">
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column', alignItems: 'center', gap: '10px'
      }}>
        <div className='Form-row'>
          <label htmlFor="name">Name: </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            style={{ width: '300px' }}
            required
          />
        </div>
        <div className='Form-row'>
          <label htmlFor="description">Description: </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            style={{ width: '300px' }}
          />
        </div>
        <div className='Form-row'>
          <label htmlFor="price">Price: </label>
          <input
            type="number"
            id="price"
            step={0.01}
            value={price}
            onChange={handlePriceChange}
            style={{ width: '300px' }}
            required
          />
        </div>
        <button type="submit" className="Product-button" style={{ width: '150px' }}>
          Create Product
        </button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default NewProduct;
