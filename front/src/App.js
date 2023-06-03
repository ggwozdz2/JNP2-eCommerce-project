import './App.css';
import { Link, Routes, Route } from 'react-router-dom';
import React from "react";
import Home from "./components/Home";
import Product from "./components/Product";

function App() {
  return (
    <div className="App">
      <Main />
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
