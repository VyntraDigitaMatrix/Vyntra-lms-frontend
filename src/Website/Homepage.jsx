import React, { useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Home from './Home.jsx';
import './index.css';

const Homepage = () => {
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);
  return (
    <div className="website-homepage-scope font-sans antialiased text-gray-900 bg-white">
      <Navbar />
      <Home />
    </div>
  );
}

export default Homepage;