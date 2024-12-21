import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
// import { CiBookmark } from "react-icons/ci";
import { Link } from "react-router-dom";
// import { Tooltip } from "react-tooltip";
import { FaStar } from "react-icons/fa6";
import { VscError } from "react-icons/vsc";
import { getDeviceType } from "../../components/deviceCheck";

const getItemNumbers = (screenWidth) => {
  if (screenWidth > 1400) {
    return 5;
  } else if (screenWidth > 990) {
    return 4;
  } else if (screenWidth > 760) {
    return 3;
  } else {
    return 2;
  }
};

function SimilarAnime({ anime, animeData }) {
  const [visibleItems, setVisibleItems] = useState(getItemNumbers(window.innerWidth));
  const deviceType = getDeviceType();

  useEffect(() => {
    const handleResize = () => {
      setVisibleItems(getItemNumbers(window.innerWidth));
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getAnimeDescription = (description) =>
    description.length > 50 ? `${description.substring(0, 50)}...` : description;

  const formatNumber = (num) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 10_000) return `${(num / 1_000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <Container fluid className="home-contact">
        <>
          <Container className="font-color">
            {animeData.length > 0 ? (
              <Row>
                <h5 style={{textAlign:'left', color:'white'}}>More anime like {" "}<span className="purple">{anime.title}</span></h5><br /><br />
                {animeData.slice(0, visibleItems).map((anime, i) => (
                  <Col key={i} lg={3} md={4} sm={6} xs={6} className="custom-col" style={{ paddingBottom: "30px" }}>
                    {/* <h4 className="category category1" style={{fontSize:'17px', backgroundColor:'#106787',}}>{(anime.similarity * 100).toFixed(1)}% similar</h4> */}
                    <Link to={`/anime/${encodeURIComponent(anime.anime_id)}`} className="anime-link">
                      <div
                        className="anime-item"
                        style={{ textAlign: "left", padding: "0 10px", position: "relative" }}
                      >
                        <img
                          src={anime.main_picture}
                          alt="anime"
                          className="anime-image"
                        />
                        {anime.title}
                        {deviceType === "Desktop" && (
                          <div className="anime-overlay">
                            <Row>
                              <h6 className="anime-description-title">
                                <span style={{ fontSize: "13px", color: "grey" }}>Title:</span>
                                <br />
                                {anime.title}
                              </h6>
                              <h6 className="anime-description">
                                <span style={{ fontSize: "13px", color: "grey" }}>Rating:</span>
                                <br />
                                <strong style={{ color: "#70cef0" }}>
                                  {(Math.round(anime.score * 100) / 100).toFixed(2)} <FaStar /> (
                                  {formatNumber(anime.scored_by)} ratings)
                                </strong>
                              </h6>
                              {/* <h6 className="anime-description-body">
                                <span style={{ fontSize: "13px", color: "grey" }}>Genre:</span>
                                <br />
                                {anime.genres}
                              </h6> */}
                              <h6 className="anime-description-body">
                                <span style={{ fontSize: "13px", color: "grey" }}>Description:</span>
                                <br />
                                {getAnimeDescription(anime.description)}
                              </h6>
                              {/* <CiBookmark
                                style={{ bottom: "10px", position: "absolute", fontSize: "25px" }}
                                id={`bookmark-${i}`}
                                className="purple"
                              />
                              <Tooltip
                                anchorId={`bookmark-${i}`}
                                content="Bookmark"
                                style={{
                                  fontSize: "15px",
                                  backgroundColor: "#70cef0",
                                  color: "black",
                                  fontWeight: "bold",
                                }}
                              /> */}
                            </Row>
                          </div>
                        )}
                      </div>
                    </Link>
                  </Col>
                ))}
              </Row>
            ) : (
              <div style={{ paddingTop: "90px" }}>
                <VscError style={{ fontSize: "90px", color: "#c51e3a" }} />
                <br />
                <br />
                Oops... No anime found
              </div>
            )}
          </Container>
        </>
    </Container>
  );
}

export default SimilarAnime;
