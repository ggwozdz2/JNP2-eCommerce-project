import React from 'react'
import axios from 'axios'
import '../App.css'
import { Link } from "react-router-dom";
// import BackToHome from "./BackToHome";

class Home extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      products: [],
    }
  }

  componentDidMount() {
    axios
      .get('http://localhost:8080/api/products/all')
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

    return (
      <div className="App-content">
        <div className="Products-list">
          {this.state.products.map((product) => {
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
                  <Link to={'/product/' + product.id}>
                    <div className='Card-button'>
                      Details
                    </div>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default Home
