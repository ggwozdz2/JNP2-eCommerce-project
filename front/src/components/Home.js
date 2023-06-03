import React from 'react'
import axios from 'axios'
import '../App.css'
import {Link} from "react-router-dom";
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
      .get('/api/products/all')
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
    return (
      <div>
        {this.state.products.map((product) => {
          return (
            <div key={product.id}>
              <Link to={'/product/' + product.id}>
                <div className='App-button'>
                  {product.name} {product.price}
                </div>
              </Link>
            </div>
          )
        })}
      </div>
    )
  }
}

export default Home
