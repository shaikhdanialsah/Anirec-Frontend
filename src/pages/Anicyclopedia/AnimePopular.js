import React, { useState, useEffect } from "react";
import { Row, Col, Placeholder, Alert } from "react-bootstrap";
import { IoIosArrowForward } from "react-icons/io";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
// import { CiBookmark } from "react-icons/ci";
import { Tooltip } from "react-tooltip";
import { Link } from "react-router-dom";
import { FaFire } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { responsive, getAnimeDescription } from './animeFunction';
import { getDeviceType } from '../../components/deviceCheck';

function AnimePopular() {
  const [screenWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(true);
  const [animeData, setAnimeData] = useState([]);
  const [error, setError] = useState(null);

  const deviceType = getDeviceType();

  // API name
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // Fetch data from Flask API
    fetch(`${API_URL}/anime/top100`)  // Update the URL to match your backend route
      .then(response => response.json())
      .then(data => {
        setAnimeData(data.top_100_anime || []);  // Ensure we always have an array, even if data is empty
        setLoading(false);  // Set loading to false when data is loaded
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setError('Failed to load anime data');
        setLoading(false);
      });
  }, []);
  
  const formatNumber = (num) => {
    if (num >= 10000 && num < 1000000) {
      return (num / 1000).toFixed(1) + 'k';
    } else if (num >=1000000)
    {
      return (num / 1000000).toFixed(1) + 'M';
    }
    return num.toString();
  };

  return (
    <div style={{ paddingBottom: '10px' }}>
      <Row className="font-color" style={{ paddingTop: '40px' }}>
        <Col md={12} className="d-flex justify-content-between" style={{ paddingBottom: '25px' }}>
          <h5 style={{ borderLeft: '4px solid', paddingLeft: '10px' }} className="purple">
            <strong className="font-color"><FaFire style={{ color: 'orangered' }} /> Most Popular Anime</strong>
          </h5>
          <Link to='/all' className="view-all-link" id="view-more-popular">
            <h7 style={{ cursor: 'pointer', padding:'10px' }}><strong>{deviceType === "Desktop" && (<span>More{" "}</span>)}<IoIosArrowForward /></strong></h7>
            <Tooltip anchorId="view-more-popular" content="Click to view more" style={{ fontSize: '15px', backgroundColor: '#70cef0', color:'black', fontWeight:'bold' }} />
          </Link>
        </Col>
      </Row>
      

      {error && <Alert variant='danger'>{error}</Alert>}

      <Carousel responsive={responsive} className="font-color">
        {(loading ? [...Array(10)] : animeData.slice(0, 10)).map((anime, i) => (
          <div key={i}>
            {loading ? (
              // Render placeholders while loading
              <div className="anime-item" style={{ textAlign: 'left', padding: '0 10px', position: 'relative', marginRight: '8px' }}>
                <Placeholder as="div" animation="glow">
                  <Placeholder style={{ width: '100%', height: '250px' }} />
                </Placeholder>
                <Placeholder as="h6" animation="glow">
                  <Placeholder xs={8} />
                </Placeholder>
                <Placeholder as="span" animation="glow">
                  <Placeholder xs={6} />
                </Placeholder>
              </div>
            ) : (
              // Render anime details when not loading
              anime && anime.anime_id ? (
                <Link to={`/anime/${anime.anime_id}`} className="anime-link">
                  <div className="anime-item" style={{ textAlign: 'left', padding: '0 10px', position: 'relative', marginRight: '8px' }}>
                    <img src={anime["main_picture"]} alt={anime.title} className="anime-image" style={{ width: '100%', height: 'auto', maxHeight: '340px' }} />

                    {deviceType === "Desktop" && (
                      <div className="anime-overlay">
                        <Row>
                          <h6 className="anime-description-title">
                            <span style={{ fontSize: '13px', color: 'grey' }}>Title:</span><br />
                            {anime.title}
                          </h6>
                          <h6 className="anime-description">
                            <span style={{ fontSize: '13px', color: 'grey' }}>Rating:</span><br />
                            <span style={{ color: '#70cef' }}>{(Math.round(anime.score * 100) / 100).toFixed(2)} <FaStar /> ({formatNumber(anime.scored_by)} ratings)</span>
                          </h6>
                          <h6 className="anime-description-body">
                            <span style={{ fontSize: '13px', color: 'grey' }}>Genre:</span><br />
                            {anime.genres}
                          </h6>
                          <h6 className="anime-description-body">
                            <span style={{ fontSize: '13px', color: 'grey' }}>Description:</span><br />
                            {getAnimeDescription(anime.description, screenWidth)}
                          </h6>

                          {/* Bookmark Button */}
                          {/* <CiBookmark style={{ bottom: '10px', position: 'absolute', fontSize: '25px' }} id={`book-mark${i}`} className="purple" />
                          <Tooltip anchorId={`book-mark${i}`} content="Bookmark" style={{ fontSize: '15px', backgroundColor: '#70cef0', color:'black', fontWeight:'bold' }} /> */}
                        </Row>
                      </div>
                    )}

                    <Row style={{ paddingTop: '10px', textAlign: 'left' }}>
                      <Col>
                        <span className="category category1">
                          {deviceType == 'Desktop' && anime.type === "TV" ? ("TV Shows") : anime.type}
                        </span>
                        <span className="category category2">
                          {deviceType !='Desktop' && anime.genres.split(",")[0].trim() === 'Award Winning' ? ('Award') : anime.genres.split(",")[0].trim()}
                        </span>
                      </Col>
                    </Row>
                    <h6 style={{ paddingTop: '20px', textAlign: 'left' }}>{anime.title}</h6>
                  </div>
                </Link>
              ) : (
                // Handle missing or invalid anime data case (optional)
                <Placeholder as="div" animation="glow">
                  <Placeholder style={{ height: '250px' }} />
                </Placeholder>
              )
            )}
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default AnimePopular;
