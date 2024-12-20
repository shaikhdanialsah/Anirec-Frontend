import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { motion } from "framer-motion";
import { TiMediaPlay } from "react-icons/ti";
import Type from "./Type";
import { AnimationControl, zoomIn,fadeIn } from "../../components/AnimationControl";
import HomeFeatures from "./HomeFeatures";
import HomeTestimony from "./HomeTestimony";
import AnimeCount from "./AnimeCount";
import { Link as ScrollLink } from "react-scroll";

function Home() {
  const { ref, controls } = AnimationControl();

  // State to manage scroll duration
  const [scrollDuration, setScrollDuration] = useState(1000);

  useEffect(() => {
    // Check screen size on initial render and adjust scroll duration
    const handleResize = () => {
      if (window.innerWidth < 750) {
        setScrollDuration(0);
      } else {
        setScrollDuration(470); // Default duration for larger screens
      }
    };

    handleResize(); // Set duration based on the initial screen size
    window.addEventListener("resize", handleResize); // Update duration on resize

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section>
      <Container fluid className="home-section">
        <Container className="home-content">
          <Row ref={ref}>
            <motion.h1
              style={{ paddingBottom: 15 }}
              className="heading"
              initial="hidden"
              animate={controls}
              variants={zoomIn}
            >
              Hey there, anime lovers!
            </motion.h1>

            <motion.h1
              initial="hidden"
              animate={controls}
              variants={zoomIn}
              style={{paddingBottom:'10px'}}
            >
              Welcome to
              Ani<strong className="main-name">Rec+</strong>
            </motion.h1>

            <motion.h3
              className="title"
              initial="hidden"
              animate={controls}
              variants={fadeIn}
              transition={{ delay: 1.0 }}
            >
            Graphical Visualization for Understanding Japanese Animation Consumption with Recommender System
            </motion.h3>
          </Row>

          <Row>
            <div style={{ paddingTop: "40px" }}>
              <Type />
            </div>
          </Row>

          <Row>
            <div style={{ paddingTop: "60px" }}>
              <ScrollLink
                to="home-features-section"
                smooth
                duration={scrollDuration} // Use state to dynamically set duration
                offset={-50}
              >
                  <button className="get-started-button"style={{ borderRadius: "30px" }}>
                   <strong style={{ fontSize: "22px" }}>Explore Now</strong>
                   <TiMediaPlay style={{
                      fontSize: "22px",
                      marginLeft:'10px',
                      marginBottom:'5px'
                    }}/>
                </button>
              </ScrollLink>
            </div>
          </Row>
        </Container>
      </Container>
      <div id="home-features-section">
        <HomeFeatures />
        <AnimeCount />
        <HomeTestimony />
      </div>
    </section>
  );
}

export default Home;
