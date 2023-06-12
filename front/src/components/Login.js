import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  localStorage.setItem('message', '');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    localStorage.setItem('message', '');

    const response = await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Login successful:', data);

      if (data.userId === -1) {
        setMessage('Login failed, try again');
      }
      else {
        localStorage.setItem('userId', data.userId);
        navigate('/');
        window.location.reload();
      }
      // Handle successful login, e.g., store user session, redirect to dashboard, etc.
    } else {
      const errorData = await response.json();
      console.error('Login failed:', errorData.message);
      // Handle failed login, e.g., show error message to the user.
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column', alignItems: 'center', gap: '10px'
      }}>
        <div>
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit" className='Product-button'>Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
