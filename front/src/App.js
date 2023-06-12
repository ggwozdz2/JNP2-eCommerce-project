import './App.css';
import { Link, Routes, Route } from 'react-router-dom';
import React from "react";
import Home from "./components/Home";
import Product from "./components/Product";
import Basket from "./components/Basket";
import Login from "./components/Login";
import User from "./components/User";
import Warehouse from './components/Warehouse';
import NewProduct from './components/NewProduct';
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
    <div className="Menu-bar-button" onClick={handleLogout}>Logout</div>
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
            userId === "1" && (
              <Link to={'/add-warehouse'}>
                <div className="Menu-bar-button">
                  Warehouse
                </div>
              </Link>
            ) 
          }

          {
            userId ? (
              <Link to={'/user'}>
                <div className="Menu-bar-button">
                  My account
                </div>
              </Link>
            ) : (
              <div className="Menu-bar-button-disabled">
                My account
              </div>
            )
          }
          {
            userId ? (<LogoutButton />)
              : (<Link to={'/login'}>
                <div className="Menu-bar-button">
                  Login
                </div>
              </Link>)
          }
          {
            userId ? (
              <Link to={'/basket'}>
                <div className="Menu-bar-button">Basket</div>
              </Link>
            ) : (
              <div className="Menu-bar-button-disabled">
                Basket
              </div>
            )
          }
        </div>
      </div>
      <div className="App-content">
        <Main />
      </div>
    </div >
  );
}

function Main() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<Product />} />
      <Route path="/login" element={<Login />} />
      <Route path="/basket" element={<Basket />} />
      <Route path="/user" element={<User />} />
      <Route path="/add-warehouse" element={<Warehouse />} />
      <Route path="/add-product" element={<NewProduct />} />
    </Routes>
  );
}

export default App;
