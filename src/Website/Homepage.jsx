import React from 'react';
import Navbar from './components/Navbar.jsx';
import Home from './Home.jsx';
import './index.css';

const Homepage = () => {
  return (
    <div className="website-homepage-scope font-sans antialiased text-gray-900 bg-white">
      <Navbar />
      <Home />
    </div>
  );
}

export default Homepage;