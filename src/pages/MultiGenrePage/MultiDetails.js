import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner, Dropdown } from "react-bootstrap";
// import { CiBookmark } from "react-icons/ci";
import { Link } from "react-router-dom";
// import { Tooltip } from "react-tooltip";
import { BiSort } from "react-icons/bi";
import { IoFilter } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { getDeviceType } from '../../components/deviceCheck';
import { FaStar } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import { VscError } from "react-icons/vsc";
import { IoMdInformationCircleOutline } from "react-icons/io";


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

function MultiDetails({ genre }) {
  const [visibleItems, setVisibleItems] = useState(getItemNumbers(window.innerWidth));
  const [screenWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(false);
  const [loading_2, setLoading_2] = useState(false);
  const [sortBy, setSortBy] = useState('Popularity');
  const [filterBy, setFilterBy] = useState('All');
  const deviceType = getDeviceType();
  const [error, setError] = useState(null);
  const [animeData, setAnimeData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // API name
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    setLoading(true); // Start loading state before fetching

    // Fetch data from the Flask API based on the selected genre
    fetch(`${API_URL}/anime-genre/${genre}`)
      .then((response) => response.json())
      .then((data) => {
        const animeList = data.anime_list || [];
        setAnimeData(animeList); // Ensure we always have an array, even if data is empty
        setLoading(false); // Set loading to false when data is loaded
        setFilteredData(animeList); // Set filtered data initially
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Failed to load anime data");
        setLoading(false);
      });
  }, [genre]); // Trigger the effect whenever the genre changes

  useEffect(() => {
    const handleResize = () => {
      setVisibleItems(getItemNumbers(window.innerWidth));
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (animeData.length > 0) {
      applyFiltersAndSort();
    }
  }, [sortBy, filterBy, animeData]);  // Apply filters only when data has been loaded

  const applyFiltersAndSort = () => {
    let filtered = [...animeData];  // Clone the array to avoid mutation

    // Filter
    if (filterBy !== 'All') {
      filtered = filtered.filter(anime => anime.type === filterBy);
    }

    // Sort
    if (sortBy === 'Popularity') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'Alphabetical') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'Newest') {
      filtered.sort((a, b) => parseInt(b.year) - parseInt(a.year));
    }

    setFilteredData(filtered);
    setVisibleItems(getItemNumbers(window.innerWidth)); // Reset visible items
  };

  const loadMore = () => {
    setVisibleItems(prevVisibleItems => prevVisibleItems + getItemNumbers(window.innerWidth));
  };

  const handleClick = () => {
    setLoading_2(true);
    setTimeout(() => {
      setLoading_2(false);
      loadMore();
    }, 800);
  };

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
      {loading && !error ? (
        <Spinner animation="border" role="status" style={{ color: '#70cef0' }}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : error ? (
        <div style={{ paddingTop: '90px' }}>
          <VscError style={{ fontSize: '90px', color: '#c51e3a' }} />
          <br />
          <br />
          Ooops.. {error}
        </div>
      ) : (
        <>
          <span style={{ fontSize: '18px', color: '#70cef0',backgroundColor:'#242651ca',padding:'8px', borderRadius:'5px' }}><IoMdInformationCircleOutline style={{fontSize:'22px'}}/> {filteredData.length} Anime(s) found</span>
          <Container className="font-color">
            <Row className="multi-function">
              <Col>
                <div className="d-flex justify-content-end">
                  <Dropdown onSelect={(eventKey) => setSortBy(eventKey)}>
                    <Dropdown.Toggle variant="success" id="dropdown-basic" className="multi-function-button">
                      <BiSort style={{ marginRight: '5px' }} />: {sortBy}
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{ backgroundColor: '#1f1f20' }}>
                      <Dropdown.Item eventKey="Popularity" style={{ color: 'white' }} className={sortBy === "Popularity" ? "genre-item-selector-active" : "genre-item-selector"}>
                        Popular{sortBy === "Popularity" && <FaCheck />}
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="Alphabetical" style={{ color: 'white' }} className={sortBy === "Alphabetical" ? "genre-item-selector-active" : "genre-item-selector"}>
                        Alphabetical{sortBy === "Alphabetical" && <FaCheck />}
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="Newest" style={{ color: 'white' }} className={sortBy === "Newest" ? "genre-item-selector-active" : "genre-item-selector"}>
                        Newest{sortBy === "Newest" && <FaCheck />}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>

                  <Dropdown onSelect={(eventKey) => setFilterBy(eventKey)}>
                    <Dropdown.Toggle variant="success" id="dropdown-basic" className="multi-function-button">
                      <IoFilter style={{ marginRight: '5px' }} />{filterBy}
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{ backgroundColor: '#1f1f20' }}>
                      <Dropdown.Item eventKey="All" style={{ color: 'white' }} className={filterBy === "All" ? "genre-item-selector-active" : "genre-item-selector"}>
                        All{filterBy === "All" && <FaCheck />}
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="TV" style={{ color: 'white' }} className={filterBy === "TV" ? "genre-item-selector-active" : "genre-item-selector"}>
                        TV Shows{filterBy === "TV" && <FaCheck />}
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="Movie" style={{ color: 'white' }} className={filterBy === "Movie" ? "genre-item-selector-active" : "genre-item-selector"}>
                        Movies{filterBy === "Movie" && <FaCheck />}
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="OVA" style={{ color: 'white' }} className={filterBy === "OVA" ? "genre-item-selector-active" : "genre-item-selector"}>
                        OVA{filterBy === "OVA" && <FaCheck />}
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="Special" style={{ color: 'white' }} className={filterBy === "Special" ? "genre-item-selector-active" : "genre-item-selector"}>
                        Special{filterBy === "Special" && <FaCheck />}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </Col>
            </Row>

            {filteredData.length > 0 ? (
              <div>
                <Row>
                  {filteredData.slice(0, visibleItems).map((anime, i) => (
                   <Col key={i} lg={3} md={4} sm={6} xs={6} className="custom-col" style={{ paddingBottom: '30px' }}>
                      <Link to={`/anime/${anime.anime_id}`} className="anime-link">
                        <div className="anime-item" style={{ textAlign: 'left', padding: '0 10px', position: 'relative' }}>
                          <img src={anime["main_picture"]} alt="anime-image" className="anime-image" />
                          {deviceType === "Desktop" && !loading ? (
                            <div className="anime-overlay">
                              <Row>
                                <h6 className="anime-description-title">
                                  <span style={{ fontSize: '13px', color: 'grey' }}>Title:</span><br />
                                  {anime.title}
                                </h6>
                                <h6 className="anime-description">
                                  <span style={{ fontSize: '13px', color: 'grey' }}>Rating:</span><br />
                                  <strong style={{ color: '#70cef' }}>{(Math.round(anime.score * 100) / 100).toFixed(2)} <FaStar /> ({formatNumber(anime.scored_by)} ratings)</strong>
                                </h6>
                                <h6 className="anime-description-body">
                                  <span style={{ fontSize: '13px', color: 'grey' }}>Genre:</span><br />
                                  {anime.genres}
                                </h6>
                                {/* <h6 className="anime-description-body">
                                  <span style={{ fontSize: '13px', color: 'grey' }}>Released year:</span><br />
                                  {anime.aired}
                                </h6> */}
                                <h6 className="anime-description-body">
                                  <span style={{ fontSize: '13px', color: 'grey' }}>Description:</span><br />
                                  {getAnimeDescription(anime.description, screenWidth)}
                                </h6>
                                {/* <CiBookmark style={{ bottom: '10px', position: 'absolute', fontSize: '25px' }} id={`book-mark${i}`} className="purple" />
                                <Tooltip anchorId={`book-mark${i}`} content="Bookmark" style={{ fontSize: '15px', backgroundColor: '#70cef0', color:'black',fontWeight:'bold' }} /> */}
                              </Row>
                            </div>
                          ) : (
                            <div className="anime-overlay-mobile"></div>
                          )}

                          <Row style={{ paddingTop: '10px', textAlign: 'left' }}>
                            <Col>
                              <span className="category category1">{deviceType == 'Desktop' && anime.type === "TV" ? ("TV Shows") : anime.type}</span>
                              <span className="category category2">{deviceType !='Desktop' && anime.genres.split(",")[0].trim() === 'Award Winning' ? ('Award') : anime.genres.split(",")[0].trim()}</span>
                            </Col>
                          </Row>
                          <h6 style={{ paddingTop: '20px', textAlign: 'left' }}>{anime.title}</h6>
                        </div>
                      </Link>
                    </Col>
                  ))}
                </Row>

                {visibleItems < filteredData.length && (
                  <div style={{ textAlign: 'center', marginTop: '15px' }}>
                    {loading_2 ? (
                      <Spinner animation="border" role="status" style={{ color: '#70cef0' }}>
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    ) : (
                      <button onClick={handleClick} className={`multi-view-more ${loading ? 'loading' : ''}`}>
                        <span style={{ padding: '10px' }}>
                          Show more <IoIosArrowDown />
                        </span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ paddingTop: '90px' }}>
                <VscError style={{ fontSize: '90px', color: '#c51e3a' }} />
                <br />
                <br />
                Ooops.. No anime found
              </div>
            )}
          </Container>
        </>
      )}
    </Container>
  );
}

export default MultiDetails;
