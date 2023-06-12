import React, { useState } from 'react'
import axios from 'axios'
import '../App.css'
import { useNavigate } from 'react-router-dom';

function AddMoneyToAccount() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(0);
  const userId = localStorage.getItem('userId');

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  // const handleSubmit = () => {
  //   console.log(amount);

  //   axios
  //     .post('http://localhost:4000/add-money', {
  //       userId: localStorage.getItem('userId'),
  //       amount: amount,
  //     })
  //     .then((response) => {
  //       console.log(response)
  //     })
  //     .catch((error) => {
  //       console.log(error)
  //     })

  //   navigate('/user');
  //   window.location.reload();
  // };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const response = await fetch('http://localhost:4000/add-money', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, amount }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Add money successful:', data);

      navigate('/user');
      window.location.reload();
    } else {
      const errorData = await response.json();
      console.error('Add money failed:', errorData.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', 
        flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <input type="number" step="0.01" id="amount" value={amount} onChange={handleAmountChange} />
          <button type="submit" className="Product-button" style={{ width: '130px' }}>Add money</button>
    </form>
  );
}

class User extends React.Component {
  constructor(props) {
    super(props)

    localStorage.setItem('message', '');

    this.state = {
      username: '',
      money: 0,
    }
  }

  async componentDidMount() {
    await axios
      .get('http://localhost:4000/user-data/' + localStorage.getItem('userId'))
      .then((response) => {
        this.setState({
          username: response.data.username,
          money: response.data.money,
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  render() {
    return (
      <div className='App-content'>
        <div className='Card' style={{ width: '500px' }}>
          <div className='Card-info'>
            <div className='Container-with-description'>
              <p>Your username: </p>
              <div className='Card-name'>
                {this.state.username}
              </div>
            </div>
            <div className='Container-with-description'>
              <p>Your moneybag: </p>
              <div className='Card-price'>
                {this.state.money} zł
              </div>
            </div>
          </div>
          <div className='Card-actions'>
            <AddMoneyToAccount />
          </div>
        </div>
      </div>
    )
  }
}

export default User
