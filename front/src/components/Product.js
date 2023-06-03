import React from 'react'
import axios from 'axios'
import '../App.css'
import BackToHome from "./BackToHome"
import {Link, useParams} from 'react-router-dom'

export function withRouter(Children) {
  return (props) => {
    const match = {params: useParams()}
    return <Children {...props} match={match}/>
  }
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
      .get('/api/products/get/' + this.props.match.params.id)
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
      <div>
        <p>
          Id: {this.state.id} <br/>
          Name: {this.state.name} <br/>
          Description: {this.state.description} <br/>
          Price: {this.state.price}
        </p>
        <BackToHome />
      </div>
    )
  }
}

export default withRouter(Home)