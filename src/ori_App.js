import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import logo from './logo.svg';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch data from Flask API
    fetch('http://localhost:5000/api')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
   <div className="App">
      {/* Navigation Header */}
      <nav className="App-nav">
        <img src={logo} className="App-logo-small" alt="logo" />
        <ul className="App-nav-links">
          <li><a href="#home">Home</a></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact"> Contact</a></li>
        </ul>
      </nav>

      <header className="App-header" id="home">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Enhance your watching experience with us!</h1>
        <p>
          Flask says: {message}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          MyAnime
        </a>
      </header>
      
      <section className="hero-section" id="about">
        <h2>Your One-Stop Solution</h2>
        <p>Explore the amazing features of this app.</p>
        <button className="cta-button">Get Started</button>
      </section>

      {/* Footer */}
      <footer className="App-footer" id="contact">
        <p>&copy; 2024 Shaikh Danial. All rights reserved.</p>
        <a href="https://yourwebsite.com" target="_blank" rel="noopener noreferrer">Visit our website</a>
      </footer>
    </div>
  );
}

export default App;