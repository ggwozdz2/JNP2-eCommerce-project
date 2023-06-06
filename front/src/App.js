import './App.css';
import { Link, Routes, Route } from 'react-router-dom';
import React from "react";
import Home from "./components/Home";
import Product from "./components/Product";
import Basket from "./components/Basket";
import Login from "./components/Login";
import amazing_logo from "./amazing_logo.png";
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/');
    window.location.reload();
  };

  return (
    <div onClick={handleLogout}>Logout</div>
  );
}

function App() {

  const userId = localStorage.getItem('userId');
  return (
    <div className="App">
      <div className="App-header">
        <div className="Menu-bar">
          <div className="Logo-button">
            <Link to={'/'}>
              <img src={amazing_logo} alt="Amazing logo" className="App-logo" height="30px" />
            </Link>
          </div>
        </div>
        <div className="Menu-bar">
          {
            userId ? (<p>Logged in user ID: {userId}</p>)
                   : (<p>User ID not found</p>)
          }
          <div className="Menu-bar-button">
            {
              userId ? (<LogoutButton />) 
                     : (<Link to={'/login'}>Login</Link>)
            }
          </div>
          <div className="Menu-bar-button">
            <Link to={'/basket'}>
                Basket
            </Link>
          </div>
        </div>
      </div>
      <div className="App-content">
        <Main />
      </div>
    </div>
  );
}

function Main() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<Product />} />
      <Route path="/login" element={<Login />} />
      <Route path="/basket" element={<Basket />} />
    </Routes>
  );
}

export default App;
