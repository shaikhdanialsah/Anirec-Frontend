import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Placeholder, Button } from "react-bootstrap";
import SingleDetails from "./SingleDetails";
import { IoIosArrowBack } from "react-icons/io";
import axios from "axios";
import wallpaper6 from '../../assets/anime_dashboard.jpg';
import SimilarAnime from "./SimilarAnime";

function Single() {
  const { anime_id } = useParams(); // Get anime_id from URL parameters
  const [loading, setLoading] = useState(true);
  const [anime, setAnime] = useState(null); // State to hold fetched anime data
  const [error, setError] = useState(null); // State to hold error messages if any
  const [animeData, setAnimeData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFavourite, setIsFavourite] = useState(null); // Track whether anime is in favourites
  const [reviewsData, setReviews] = useState([]);
  const [user, setUser] = useState(null);

  // API name
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // Reset state on anime_id change
    setAnime(null);
    setIsFavourite(null);
    setError(null);
    setLoading(true);
  
    const fetchData = async () => {
      const token = localStorage.getItem("access_token");
      setIsLoggedIn(!!token);
  
      try {
        // Fetch anime details
        const animeResponse = await axios.get(`${API_URL}/anime/${anime_id}`);
        const animeDetails = animeResponse.data.anime;
        setAnime(animeDetails);
      
        if (token) {
          const profileResponse = await fetch(`${API_URL}/profile`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
      
          if (!profileResponse.ok) throw new Error("Failed to fetch profile");
          const profileData = await profileResponse.json();
          setUser(profileData);
      
          // Fetch user's favourites
          const favResponse = await fetch(`${API_URL}/favourites/${profileData.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
      
          if (!favResponse.ok) throw new Error("Failed to fetch user favourites");
          const favData = await favResponse.json();
      
          const isAnimeInFavourites = favData.favourites?.some(fav => fav.anime_id === animeDetails.anime_id);
          setIsFavourite(isAnimeInFavourites);
        }
      
        // Fetch anime recommendations
        if (animeDetails?.title) {
          const recResponse = await fetch(`${API_URL}/recommend?anime=${encodeURIComponent(animeDetails.title)}`);
          if (!recResponse.ok) throw new Error("Failed to fetch anime recommendations");
          const recData = await recResponse.json();
          setAnimeData(recData.recommended_animes || []);
        }
      
        // Fetch anime reviews
        const reviewsResponse = await fetch(`${API_URL}/reviews/${anime_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
      
        if (!reviewsResponse.ok) throw new Error("Failed to fetch anime reviews");
        const reviews = await reviewsResponse.json();
        setReviews(reviews.reviews || []);
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to fetch data.");
        setLoading(false);
      }
      
    };
  
    fetchData();
  }, [anime_id]); // Dependency on anime_id
  

  const backgroundImage = anime?.main_picture || wallpaper6;

  return (
    <section style={{ minHeight: "100vh" }}>
      <Container
        fluid
        className="single-section"
        style={{
          backgroundImage: `var(--image-gradient-single), url(${backgroundImage})`,
        }}
      >
        <Container style={{ backdropFilter: "blur(10px)" }}>
          <Row
            style={{
              justifyContent: "center",
              paddingBottom: "10px",
              padding: "10px",
              cursor: "pointer",
            }}
          >
            <div style={{ textAlign: "left", color: "aliceblue", paddingTop: "60px" }}>
              <h6>
                <a onClick={() => window.history.back()} className="back-home-link">
                  <IoIosArrowBack />
                  &nbsp; Return&nbsp;
                </a>
              </h6>
            </div>
          </Row>
          <Row style={{ justifyContent: "center" }}>
            {loading ? (
              <Placeholder className="foreground-image" animation="wave">
                <Placeholder style={{ width: "100%", height: "320px" }} />
              </Placeholder>
            ) : anime ? (
              <img
                src={anime["main_picture"]}
                alt="Anime Image"
                className="foreground-image"
              />
            ) : (
              <p>{error}</p>
            )}
          </Row>
        </Container>
      </Container>
      {loading ? (
        <Placeholder as="div" animation="wave" style={{marginTop:'30px', paddingBottom:'20px'}}>
          <Placeholder style={{ width: "85%", height: "200px", margin:'auto', borderRadius:'10px' }} />
        </Placeholder>
      ) : anime ? (
        <div>
          <SingleDetails anime={anime} isLoggedIn={isLoggedIn} user={user} isFavourites={isFavourite} reviewsData={reviewsData} />
          <SimilarAnime anime={anime} animeData={animeData} />
        </div>
      ) : (
        <p>{error}</p>
      )}
    </section>
  );
}

export default Single;
