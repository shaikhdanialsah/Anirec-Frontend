import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import { AnimationControl, zoomIn, fadeIn } from "../../components/AnimationControl";
import axios from "axios";
import { MdDateRange } from "react-icons/md";

function AnimeCount() {
  const { ref, controls } = AnimationControl();
  const [animeCountdowns, setAnimeCountdowns] = useState([]);
  const [fontSize, setFontSize] = useState("2rem");

  useEffect(() => {
    let timer;

    // Adjust font size based on screen width
    const handleResize = () => {
      if (window.innerWidth <= 1400 && window.innerWidth >=1200) {
        setFontSize("0.75rem");  
      } else {
        setFontSize("0.98rem");
      }
    };

    // Listen to window resize event
    window.addEventListener("resize", handleResize);

    // Call resize handler initially to set font size
    handleResize();

    // Fetch anime schedule data from AniList
    const fetchAnimeData = async () => {
      try {
        const response = await axios.post(
          "https://graphql.anilist.co",
          {
            query: `
              query {
                Page(perPage: 10) {
                  media(status: RELEASING, type: ANIME, sort: POPULARITY_DESC) {
                    title {
                      romaji
                      english
                    }
                    nextAiringEpisode {
                      airingAt
                      episode
                    }
                    siteUrl
                    streamingEpisodes {
                      site
                    }
                    coverImage {
                      large
                    }
                  }
                }
              }
            `
          }
        );

        const animeData = response.data.data.Page.media
          .filter((anime) => anime.nextAiringEpisode) // Remove anime with no upcoming episodes
          .map((anime) => {
            const offsetInSeconds = 2 * 60 * 60; // Example offset of 2 hours
            const subRelease = anime.nextAiringEpisode.airingAt + offsetInSeconds;

            return {
              title: anime.title.english || anime.title.romaji,
              episode: anime.nextAiringEpisode.episode,
              countdown: subRelease - Math.floor(Date.now() / 1000),
              image: anime.coverImage.large,
            };
          });
        setAnimeCountdowns(animeData);
      } catch (error) {
        console.error("Failed to fetch anime data", error);
      }
    };

    fetchAnimeData();

    // Start real-time countdown
    timer = setInterval(() => {
      setAnimeCountdowns((prevCountdowns) =>
        prevCountdowns
          .map((anime) =>
            anime.countdown > 0
              ? { ...anime, countdown: anime.countdown - 1 }
              : null
          )
          .filter(Boolean) // Remove anime with expired countdown
      );
    }, 1000);

    return () => {
      clearInterval(timer); // Cleanup interval on unmount
      window.removeEventListener("resize", handleResize); // Cleanup resize event listener
    };
  }, []);

  // Helper to format countdown as Days:HH:MM:SS
  const formatCountdown = (seconds) => {
    if (seconds <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }; // Countdown expired
  
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
  
    return {
      days,
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: secs.toString().padStart(2, "0"),
    };
  };

  return (
    <Container fluid className="home-features" style={{ backgroundColor: "rgba(66, 66, 66, 0.171)" }}>
      <Container ref={ref}>
        <Row>
          <Col className="home-about-description">
            <motion.h2
              style={{ textAlign: "center" }}
              initial="hidden"
              animate={controls}
              variants={zoomIn}
            >
              <strong>
                <span className="font-color" ><MdDateRange style={{marginRight:'10px'}}/>Anime Countdown</span>
              </strong>
            </motion.h2>
            <motion.p
              initial="hidden"
              animate={controls}
              variants={fadeIn}
              transition={{ delay: 0.2 }}
              style={{ paddingBottom: "10px", paddingTop: "20px" }}
            >
              <span className="grey">Upcoming Anime Releases <span className="purple">(Source: AniList )</span></span><br/>
            </motion.p>
            {animeCountdowns.length > 0 ? (
              <Row>
                {animeCountdowns.slice(0, 6).map((anime, index) => {
                  const countdown = formatCountdown(anime.countdown);
                  return (
                    <Col lg={4} md={6} sm={6} xs={12} key={index} style={{marginBottom:"20px"}}>
                      <Card style={{backgroundColor: "rgba(83, 80, 80, 0.311)", height: "100%" }}>
                        <Card.Body>
                          <Row>
                            <Col md={4} xs={4}>
                              {anime.image && (
                                <img
                                  src={anime.image}
                                  alt={anime.title}
                                  style={{ width: "100%", borderRadius: "10px", marginBottom: "15px" }}
                                />
                              )}
                            </Col>
                            <Col md={8} xs={8} style={{ textAlign: "left", color: "white" }}>
                              <div style={{ maxHeight: "90px" }}>
                                <p style={{color:'white'}}>{anime.title}</p>
                                <br />
                              </div>
                              <h6 className="grey">Episode {anime.episode}</h6>
                              <br />
                              <Row style={{ textAlign: 'center' }} className="grey">
                                <Col xl={3} md={6} xs={6}>
                                  <Row>
                                    <Col md={12}><h5 style={{color:'whitesmoke'}}><strong>{countdown.days}</strong></h5></Col> 
                                    <Col md={12}><h6 style={{ fontSize }}>Days</h6></Col>   
                                  </Row>
                                </Col>
                                <Col xl={3} md={6} xs={6}>
                                  <Col md={12}><h5 style={{color:'whitesmoke'}}><strong>{countdown.hours}</strong></h5></Col> 
                                  <Col md={12}><h6 style={{ fontSize }}>Hours</h6></Col>
                                </Col>
                                <Col xl={3} md={6} xs={6}>
                                  <Col md={12}><h5 style={{color:'whitesmoke'}}><strong>{countdown.minutes}</strong></h5></Col> 
                                  <Col md={12}><h6 style={{ fontSize }}>Mins</h6></Col>
                                </Col>
                                <Col xl={3} md={6} xs={6}>
                                  <motion.div
                                    key={countdown.seconds} // Adding a key to trigger the animation every second change
                                    animate={{ scale: [1, 1.2, 1] }} // Scale up and then back down
                                    transition={{ duration: 0.3 }}
                                  >
                                    <Col md={12}><h5 className="purple"><strong>{countdown.seconds}</strong></h5></Col> 
                                  </motion.div>
                                  <Col md={12}><h6 style={{ fontSize }}>Secs</h6></Col>
                                </Col>
                              </Row>
                              <br />
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            ) : (
              <><Spinner style={{fontSize:'10px'}}/><p>Loading countdowns...</p></>
            )}
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default AnimeCount;
