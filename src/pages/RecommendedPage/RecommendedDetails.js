import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spinner, Container, Row, Col, Modal, Button } from "react-bootstrap";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import {getDeviceType} from "../../components/deviceCheck"

const getItemNumbers = (screenWidth) => {
    if (screenWidth > 1400) {
      return 10;
    }
    else if (screenWidth > 990) {
      return 8;
    } 
    else if (screenWidth > 760) {
      return 6;
    } else {
      return 4;
    }
};

const deviceType = getDeviceType();
const RecommendedDetails = () => {
    const { searchQuery } = useParams(); // Get searchQuery from the URL
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [visibleItems, setVisibleItems] = useState(getItemNumbers(window.innerWidth));
    const [showModal, setShowModal] = useState(false);
    const [selectedAnime, setSelectedAnime] = useState(null);

    // API name
  const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchRecommendations = async () => {
            setLoading(true);
            setError(""); // Reset any previous errors
            try {
                const response = await fetch(`${API_URL}/recommend?anime=${encodeURIComponent(searchQuery)}`); // Fetch anime recommendations
                if (!response.ok) {
                    throw new Error("Failed to fetch recommendations.");
                }
                const data = await response.json();
                setRecommendations(data.recommended_animes || []);
            } catch (err) {
                setError(err.message || "An error occurred.");
                console.error("Error fetching recommendations:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [searchQuery]); // Re-fetch when searchQuery changes

    // Adjust the number of visible anime based on screen size (browser inner width)
    useEffect(() => {
        const handleResize = () => {
          const baseItems = getItemNumbers(window.innerWidth);
          // Only update if visibleItems is less than the base number
          if (visibleItems < baseItems) {
            setVisibleItems(baseItems);
          }
        };
      
        window.addEventListener('resize', handleResize);
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, [visibleItems]);
      
      const loadMore = () => {
        // Increment visibleItems without recalculating from scratch
        const increment = getItemNumbers(window.innerWidth);
        setVisibleItems((prevVisibleItems) => prevVisibleItems + increment);
      };

    // Function for when user click the 'Load More' button
    const handleClick = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            loadMore();
        }, 800);
    };

    // Function to shorten the anime description so that it will no exceed overlay layout
    const getAnimeDescription = (animeDescription) => {
        if (animeDescription.length > 80) {
            return animeDescription.substring(0, 80) + '...';
        } else {
            return animeDescription;
        }
    };

    const formatNumber = (num) => {
        if (num >= 10000 && num < 1000000) {
          return (num / 1000).toFixed(1) + 'k';
        } else if (num >=1000000)
        {
          return (num / 1000000).toFixed(1) + 'M';
        }
        return num.toString();
      };

      const handleShowModal = (anime) => {
        setSelectedAnime(anime);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedAnime(null);
    };


    return (
        <Container fluid className="home-contact"> 
            <span style={{ fontSize: '18px', color: '#70cef0', backgroundColor: '#242651ca', padding: '8px', borderRadius: '5px' }}>
                 {recommendations.length} Anime(s) found
            </span>
            <br></br> <br></br> <br></br>
            <Container className="font-color">
                <Row>
                    {recommendations.slice(0, visibleItems).map((anime, i) => (
                        <Col key={i} lg={3} md={4} sm={6} xs={6} className="custom-col" style={{ paddingBottom: '30px' }}>
                            <Row style={{ paddingTop: '10px', textAlign: 'center', paddingBottom:'15px' }}>
                                        <Col>
                                            <Button className="search-button" style={{width:'100%', borderRadius:'30px'}} onClick={() => handleShowModal(anime)}><IoMdInformationCircleOutline style={{ fontSize: '20px', marginRight:'10px' }} />{(anime.similarity * 100).toFixed(1)}% similar</Button>
                                        </Col>
                                    </Row>
                            <Link to={`/anime/${anime.anime_id}`} className="anime-link">
                                <div className="anime-item" style={{ textAlign: 'left', padding: '0 10px', position: 'relative' }}>
                                    <img src={anime.main_picture} alt="anime-image" className="anime-image" />
                                    <div className={deviceType === "Desktop" ? "anime-overlay" : "anime-overlay-mobile"}>
                                        {deviceType != "Mobile" && ( <Row>
                                            <h6 className="anime-description-title">
                                                <span style={{ fontSize: '13px', color: 'grey' }}>Title:</span><br />
                                                {anime.title}
                                            </h6>
                                            <h6 className="anime-description">
                                                <span style={{ fontSize: '13px', color: 'grey' }}>Rating:</span><br />
                                                <strong style={{ color: '#70cef0' }}>{(Math.round(anime.score * 100) / 100).toFixed(2)} <FaStar /> ({formatNumber(anime.scored_by)} ratings)</strong>
                                            </h6>
                                            <h6 className="anime-description-body">
                                                <span style={{ fontSize: '13px', color: 'grey' }}>Genre:</span><br />
                                                {anime.genres}
                                            </h6>
                                            <h6 className="anime-description-body">
                                                <span style={{ fontSize: '13px', color: 'grey' }}>Description:</span><br />
                                                {getAnimeDescription(anime.description)}
                                            </h6>
                                        </Row>)}
                                       
                                    </div>
                                    <Row style={{ paddingTop: '10px', textAlign: 'left' }}>
                                        <Col>
                                            <span className="category category1">{anime.type === "TV" ? "TV Shows" : anime.type}</span>
                                            <span className="category category2">{anime.genres.split(",")[0].trim()}</span>
                                        </Col>
                                    </Row>
                                    <h6 style={{ paddingTop: '20px', textAlign: 'left' }}>{anime.title}</h6>
                                </div>
                            </Link>
                        </Col>
                    ))}
                </Row>

                {visibleItems < recommendations.length && (
                    <div style={{ textAlign: 'center', marginTop: '15px' }}>
                        {loading ? (
                            <Spinner animation="border" role="status" style={{ color: '#70cef0' }}>
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        ) : (
                            <button onClick={handleClick} className="multi-view-more">
                                <span style={{ padding: '10px' }}>
                                    Show more <IoIosArrowDown />
                                </span>
                            </button>
                        )}
                    </div>
                )}
            </Container>
            {/* Add modal to display anime similarity index */}
                {selectedAnime && (
                    <Modal show={showModal} onHide={handleCloseModal}>
                         <Modal.Header closeButton closeVariant='white' style={{backgroundColor:'#121317',borderBottom:'black'}}>
                            <Modal.Title style={{color:'whitesmoke'}}>Anime Similarity Index</Modal.Title>
                        </Modal.Header>
                       <Modal.Body style={{backgroundColor:'#121317e4', textAlign:'center',color:'whitesmoke'}}>
                            <p className="purple">{selectedAnime.title}</p>
                            <p style={{color:'grey'}}><FaArrowRightArrowLeft /></p>
                            <p>{searchQuery}</p>
                            <Row>
                            <Col lg={4} md={4} sm={4} xs={4}>
                                <span className="similarity title-badge">Title Similarity</span><br />
                                {(selectedAnime.title_similarity * 100).toFixed(1)}%
                            </Col>
                            <Col lg={4} md={4} sm={4} xs={4}>
                            <span className="similarity description-badge">Synopsis Similarity</span><br />
                                {(selectedAnime.description_similarity * 100).toFixed(1)}%
                            </Col>
                            <Col lg={4} md={4} sm={4} xs={4}>
                            <span className="similarity genre-badge">Genre Similarity</span><br />
                                {(selectedAnime.genre_similarity * 100).toFixed(1)}%
                            </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer style={{backgroundColor:'#121317',borderTop:'black'}}>
                            <Button className="search-button" onClick={handleCloseModal}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}
        </Container>
    );
};

export default RecommendedDetails;
