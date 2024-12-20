import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import logo from './logo.svg';
import Dashboard from './pages/Dashboard'; // Updated import path

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
    <Router>
      <div className="App">
        {/* Navigation Header */}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <header className="App-header" id="home">
                  <img src={logo} className="App-logo" alt="logo" />
                  <h1>Enhance your watching experience with us!</h1>
                  <p>Flask says: {message}</p>
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
              </>
            }
          />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>

        {/* Footer - Visible on every page */}
        <footer className="App-footer" id="contact">
          <p>&copy; 2024 Shaikh Danial. All rights reserved.</p>
          <a
            href="https://yourwebsite.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit our website
          </a>
        </footer>
      </div>
    </Router>
  );
}

export default App;
