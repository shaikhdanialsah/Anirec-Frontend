import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spinner, Container, Row, Col } from "react-bootstrap";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
// import { CiBookmark } from "react-icons/ci";
// import { Tooltip } from "react-tooltip";
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
    const [screenWidth] = useState(window.innerWidth);

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
            setVisibleItems(getItemNumbers(window.innerWidth));
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Load More Function
    const loadMore = () => {
        setVisibleItems((prevVisibleItems) => prevVisibleItems + getItemNumbers(window.innerWidth));
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

    return (
        <Container fluid className="home-contact">
            <br></br> 
            <span style={{ fontSize: '18px', color: '#70cef0', backgroundColor: '#242651ca', padding: '8px', borderRadius: '5px' }}>
                <IoMdInformationCircleOutline style={{ fontSize: '22px' }} /> {recommendations.length} Anime(s) found
            </span>
            <br></br> <br></br> <br></br>
            <Container className="font-color">
                <Row>
                    {recommendations.slice(0, visibleItems).map((anime, i) => (
                        <Col key={i} lg={3} md={4} sm={6} xs={6} className="custom-col" style={{ paddingBottom: '30px' }}>
                            <Row style={{ paddingTop: '10px', textAlign: 'center', paddingBottom:'15px' }}>
                                        <Col>
                                            <h4 className="category" style={{fontSize:'17px', backgroundColor:'#106787',}}>{(anime.similarity * 100).toFixed(1)}% similar</h4>
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

                                            {/* Bookmark button */}
                                            {/* <CiBookmark style={{ bottom: '10px', position: 'absolute', fontSize: '25px' }} id={`book-mark${i}`} className="purple" />
                                            <Tooltip anchorId={`book-mark${i}`} content="Bookmark" style={{ fontSize: '15px', backgroundColor: '#70cef0', color:'black',fontWeight:'bold' }} /> */}
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
        </Container>
    );
};

export default RecommendedDetails;
