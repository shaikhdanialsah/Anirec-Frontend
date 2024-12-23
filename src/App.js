import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home/Home";
import Recommender from "./pages/Recommender/Recommender";
import About from "./pages/About/About";
import Dashboard from "./pages/Dashboard/Dashboard";
import Anicylopedia from "./pages/Anicyclopedia/Anicyclopedia";
import Single from "./pages/SingleAnimePage/Single";
import Multi from "./pages/MultiAnimePage/Multi";
import MultiGenre from "./pages/MultiGenrePage/MultiGenre";
import Recommended from "./pages/RecommendedPage/Recommended";
import Login from "./pages/Login";
import HomePrivate from "./private/Profile/Profile"
import Footer from "./components/Footer";
import CustomScrollToTop from "./components/CustomScrollToTop";
import Preloader from "./components/Pre"; 
import { LoadingProvider, useLoading } from "./components/LoadingContext"; // Import the LoadingProvider

// From private pages
import EditProfile from "./private/Profile/EditProfile";

import "./styles/style.css";
import "./styles/App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <LoadingProvider>
      <MainApp />
    </LoadingProvider>
  );
}

function MainApp() {
  const { loading, finishLoading } = useLoading();
  const [load, updateLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      finishLoading(); // Call finishLoading from context
      updateLoad(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [finishLoading]);

  return (
    <Router>
      <CustomScrollToTop />
      <Preloader load={loading} />
      <div className={`App ${load ? "no-scroll" : "scroll"}`}>
        <Navbar />
        {loading ? (
          <div>Loading...</div> // Placeholder while loading
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<HomePrivate />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/recommender" element={<Recommender />} />
            <Route path="/anicyclopedia" element={<Anicylopedia />} />
            <Route path="/anime/:anime_id" element={<Single />} />
            <Route path="/all" element={<Multi />} />
            <Route path="/anime-genre/:genre" element={<MultiGenre />} />
            <Route path="/recommended/:searchQuery" element={<Recommended />} />
            <Route path="/login" element={<Login />} />
            <Route path="/edit-profile" element={<EditProfile />} />
          </Routes>
        )}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
