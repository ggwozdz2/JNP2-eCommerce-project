import './App.css';
import { Link, Routes, Route } from 'react-router-dom';
import React from "react";
import Home from "./components/Home";
import Product from "./components/Product";
import amazing_logo from "./amazing_logo.png";

function App() {
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
            Login
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
    </Routes>
  );
}

export default App;
