import React from 'react'
import axios from 'axios'
import '../App.css'
import { useParams } from 'react-router-dom'

export function withRouter(Children) {
  return (props) => {
    const match = { params: useParams() }
    return <Children {...props} match={match} />
  }
}

function AddProductToBasket(productId) {
  if (!localStorage.getItem('userId')) {
    return;
  }
  axios
    .post('http://localhost:8081/api/baskets/create', {
      userId: localStorage.getItem('userId'),
      productId: productId,
    })
    .then((response) => {
      console.log(response)
    })
    .catch((error) => {
      console.log(error)
    })
  document.getElementById('Announcement').style.visibility = 'visible'
  // setTimeout(() => {
  //   document.getElementById('Announcement').style.visibility = 'hidden'
  // }, 2000)
}

class Home extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      id: 0,
      name: '',
      description: '',
      price: 0,
    }
  }

  componentDidMount() {
    axios
      .get('http://localhost:8080/api/products/get/' + this.props.match.params.id)
      .then((response) => {
        this.setState({
          id: response.data.id,
          name: response.data.name,
          description: response.data.description,
          price: response.data.price,
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  render() {
    return (
      <div className='Product-site'>
        <div className='Product-site-left'>
          <div className='Product-name'>
            {this.state.name}
          </div>
          <div className='Product-description'>
            {this.state.description}
          </div>
        </div>
        <div className='Product-site-right'>
          <div className='Product-price'>
            {this.state.price} zł
          </div>
          {
            localStorage.getItem('userId') ? (
              <div className='Product-button' onClick={() => AddProductToBasket(this.state.id)}>
                Add to basket
              </div>
            ) : (
              <div className='Product-button-disabled'>
                Add to basket
              </div>
            )
          }
          <div id='Announcement' style={{ visibility: 'hidden' }}>Product added to basket</div>
        </div>
      </div>
    )
  }
}

export default withRouter(Home)
