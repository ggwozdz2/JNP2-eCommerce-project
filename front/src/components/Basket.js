import React from 'react'
import axios from 'axios'
import '../App.css'
import { Link, useNavigate } from "react-router-dom";

function DeleteFromBasket(basketId) {
  const navigate = useNavigate();

  const handleDeleteFromBasket = () => {
    axios
      .get('http://localhost:8081/api/baskets/delete/' + basketId.basketId)
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.log(error)
      })

    navigate('/basket');
    window.location.reload();
  };

  return (
    <div className="Card-button" onClick={handleDeleteFromBasket}>Remove</div>
  );
}

class Basket extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      products: [],
    }
  }

  componentDidMount() {
    if (!localStorage.getItem('userId')) {
      return;
    }
    axios
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
    //const userId = localStorage.getItem('userId');

    return (
      <div className="App-content">
        <div className="Products-list">
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
