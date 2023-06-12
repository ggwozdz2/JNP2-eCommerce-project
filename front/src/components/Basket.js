import React, { useState, useEffect } from 'react';
import axios from 'axios'
import '../App.css'
import { Link, useNavigate } from "react-router-dom";

function DeleteFromBasket(basketId) {
  const navigate = useNavigate();

  const handleDeleteFromBasket = async () => {
    await axios
      .get('http://localhost:8081/api/baskets/delete/' + basketId.basketId)
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.log(error)
      })

    localStorage.setItem('message', 'Product removed from basket');
    navigate('/basket');
    window.location.reload();
  };

  return (
    <div className="Card-button" onClick={handleDeleteFromBasket}>Remove</div>
  );
}

function SubmitOrder() {
  const navigate = useNavigate();

  const handleOrder = async () => {
    await axios
      .get('http://localhost:8081/api/baskets/submit-order/' + localStorage.getItem('userId'))
      .then((response) => {
        console.log(response);
        console.log(response.data.message);
        localStorage.setItem('message', response.data.message);
      })
      .catch((error) => {
        console.log(error);
        console.log("Zle");
      })

    navigate('/basket');
    window.location.reload();
  };

  return (
    <div className="Product-button" onClick={handleOrder}>Buy now</div>
  );
}

class Basket extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      products: [],
    }
  }

  async componentDidMount() {
    if (!localStorage.getItem('userId')) {
      return;
    }
    await axios
      .get('http://localhost:8081/api/baskets/user-basket/' + localStorage.getItem('userId'))
      .then((response) => {
        this.setState({
          products: response.data,
        })
        console.log(this.state.products)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  render() {

    const userId = localStorage.getItem('userId');
    const message = localStorage.getItem('message');
    if (message === null) {
      localStorage.setItem('message', '');
    }

    var totalPrice = this.state.products.reduce((total, product) => total + product.price, 0);
    totalPrice = Math.round(totalPrice * 100) / 100;

    return (
      <div className="App-content">
        <div className="Products-list">
          <div className='Card'>
            <div className='Card-info'>
              <div className='Card-info' style={{ flexDirection: 'row', alignItems: 'center' }}>
                <div className='Card-name'>Total cost: </div>
                <div className='Card-price'>{totalPrice} zł</div>
              </div>
              <div className='Announcement' id='Message'>{message}</div>
            </div>
            <div className='Card-actions'>
              <SubmitOrder />
            </div>
          </div>
          {
            this.state.products.length > 0 ? (
              this.state.products.map((product) => {
                return (
                  <div className='Card' key={product.id}>
                    <div className='Card-info'>
                      <div className='Card-name'>
                        {product.name}
                      </div>
                      <div className='Card-price'>
                        {product.price} zł
                      </div>
                    </div>
                    <div className='Card-actions'>
                      <Link to={'/product/' + product.productId}>
                        <div className='Card-button'>
                          Details
                        </div>
                      </Link>
                      <DeleteFromBasket basketId={product.id} />
                    </div>
                  </div>
                )
              })
            ) : (<p>You have no products in your basket</p>)
          }
        </div>
      </div>
    )
  }
}

export default Basket
