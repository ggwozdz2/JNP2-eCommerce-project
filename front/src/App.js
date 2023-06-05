import './App.css';
import { Link, Routes, Route } from 'react-router-dom';
import React from "react";
import Home from "./components/Home";
import Product from "./components/Product";
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
          <div className="Menu-bar-button">
                    {
                          userId ? (
                                <LogoutButton />
                           ) : (
                                <Link to={'/login'}>
                                            Login
                                            </Link>
                          )
                    }

          </div>
          <div className="Menu-bar-button">
            Basket
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
    </Routes>
  );
}

export default App;
