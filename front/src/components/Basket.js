import React from 'react'
import axios from 'axios'
import '../App.css'
import {Link} from "react-router-dom";

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
        const userId = localStorage.getItem('userId');
    
        return (
        <div className="App-content">
            {
                userId ? (
                        <p>Logged in user ID: {userId}</p>
                 ) : (
                        <p>User ID not found</p>
                )
            }
            {this.state.products.map((product) => {
            return (
                <div key={product.id}>
                <Link to={'/product/' + product.id}>
                    <div className='Product-card'>
                    <div className='Product-card-name'>
                        {product.name}
                    </div>
                    <div className='Product-card-price'>
                        {product.price} zł
                    </div>
                    </div>
                </Link>
                </div>
            )
            })}
        </div>
        )
    }
}

export default Basket
