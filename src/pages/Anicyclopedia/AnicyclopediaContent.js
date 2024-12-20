import React, { useState, useEffect } from "react";
import { Container, Row, Col, Badge, Placeholder } from "react-bootstrap";
import 'react-multi-carousel/lib/styles.css';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import AnimePopular from "./AnimePopular";
import { Link } from 'react-router-dom';
import axios from "axios";

function AnicyclopediaContent() {
  const [showMore, setShowMore] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [genresData, setGenresData] = useState({}); // State to store genres and their counts
  const [loading, setLoading] = useState(true);

  // API name
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Fetch the genre data from the API
    const fetchGenresData = async () => {
      try {
        const response = await axios.get(`${API_URL}/genres`);
        setGenresData(response.data.genre_count);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching genre data:", error);
      }
    };

    fetchGenresData();
  }, []);

  const getVisibleGenres = () => {
    const genresArray = Object.entries(genresData); // Convert object to array of [genre, count]

    if (screenWidth < 540) {
      return showMore ? genresArray : genresArray.slice(0, 3); // Show 3 initially on small screens
    } else if (screenWidth < 768) {
      return showMore ? genresArray : genresArray.slice(0, 4); // Show 4 initially on medium screens
    }
    return genresArray;
  };

  return (
    <Container fluid className="home-features">
      <Container>
        <Row className="font-color" style={{ paddingTop: '10px' }}>
          <strong style={{ fontSize: '18px', textAlign: 'left' }}>Browse by Genre :</strong>
        </Row>

        {loading ? (
          <Row>
            <Col style={{textAlign:'left', paddingTop:'20px'}}>
              <Placeholder.Button variant="primary" style={{width:'100px', borderRadius:'30px', marginRight:'20px'}}/>
              <Placeholder.Button variant="primary" style={{width:'100px', borderRadius:'30px', marginRight:'20px'}}/>
              <Placeholder.Button variant="primary" style={{width:'100px', borderRadius:'30px', marginRight:'20px'}}/>
            </Col>
          </Row>

        ) : (
          <div style={{ paddingTop: '20px' }}>
            <Row className="font-color">
              <Col md={12} style={{ textAlign: 'left' }}>
                {getVisibleGenres().map(([genre, count], index) => (
                  <Link key={index} to={`/anime-genre/${genre}`}>
                    <button
                      className="button-view-genres"
                      style={{ padding: '7px' }}
                    >
                      {genre}
                      <span style={{ padding: '2px' }}>
                        <Badge bg="light" style={{ borderRadius: '50px', color: 'black' }}>{count}</Badge>
                      </span>
                    </button>
                  </Link>
                ))}
                {screenWidth < 768 && (
                  <div>
                    <p
                      onClick={() => setShowMore(!showMore)}
                      style={{
                        width: 'auto',
                        cursor: 'pointer',
                        paddingLeft: '5px',
                      }}
                      className="view-all-link"
                    >
                      {showMore ? "View Less Genre" : "View More Genre"} {showMore ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </p>
                  </div>
                )}
              </Col>
            </Row>
          </div>
        )}

        <AnimePopular />
        <hr style={{ color: 'white' }} />
      </Container>
    </Container>
  );
}

export default AnicyclopediaContent;
