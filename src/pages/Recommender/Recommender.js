import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { IoHome } from "react-icons/io5";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AnimationControl, zoomIn } from "../../components/AnimationControl";
import Random from "./Random";
import Recommend from "./Recommend";
import { getDeviceType } from '../../components/deviceCheck';
import { Tabs, Tab } from '@mui/material';  // Import MUI Tabs and Tab components
import { GiCardRandom } from "react-icons/gi";


function RecommenderDetails() {
  const [view, setView] = useState("Recommender"); 
  const deviceType = getDeviceType();
  const { ref, controls } = AnimationControl();

  // Handler for tab change
  const handleTabChange = (event, newValue) => {
    setView(newValue);
  };

  return (
    <section style={{minHeight:'100vh', paddingBottom:'20px'}}>
      <Container fluid className="recommender-section">
        <Container>
          <Row style={{ justifyContent: "center", padding: "10px" }} ref={ref}>
            <div style={{ textAlign: "left" }}>
              <Link to="/" className="back-home-link">
                <IoHome />
                {deviceType === "Desktop" && (<span>&nbsp;&nbsp; Home&nbsp;</span>)}
              </Link>
              &nbsp;&gt;<span className="grey"> &nbsp;Recommender</span>
            </div>

            <Col
            md={9}
            style={{
              justifyContent: "center",
              paddingTop: "10px",
            }}
          >
            <motion.h2 style={{ paddingTop: "15px"}}
            initial="hidden"
            animate={controls}
            variants={zoomIn}
            >
              <strong><span className="font-color"><GiCardRandom /> Recommender</span></strong>
            </motion.h2>
          </Col>
          </Row>
        </Container>
        <Row style={{paddingBottom:'20px'}}>
            {/* MUI Tabs for switching between Anime Recommender and Random Picker */}
            <div style={{ width:'auto', margin:'auto', padding:'4px', borderRadius:'15px', backgroundColor:'rgba(20, 20, 20, 0.464)', backdropFilter:'blur(15px)'}}>
            <Tabs 
              value={view}
              onChange={handleTabChange}
              centered 
              textColor="primary" 
              indicatorColor="primary"
              TabIndicatorProps={{
                style: {
                  display: "none",  // Remove default indicator
                },
              }}
              sx={{
                '& .MuiTab-root': {
                  borderRadius: '10px',  // Make it pill shaped
                  textTransform: 'none',
                  fontSize: '17px',
                  fontFamily: 'Quicksand, sans-serif',
                  color: 'rgb(219, 217, 217)',
                  backgroundColor: 'transparent',  // Background color for the tabs
                  '&.Mui-selected': {
                    backgroundColor: '#70cef0',  // Darker color when selected
                    color:'black',
                    fontWeight:'bold'
                  },
                },
              }}
              
            >
              <Tab 
                label="Recommender"
                value="Recommender" 
              />
              <Tab 
                label="Random" 
                value="Random" 
              />
            </Tabs>
            </div>
            
          </Row>
      </Container>

      <Container >
          <Row>
            <Col>
              {view === "Recommender" && (
                <div>
                  <Recommend />
                </div>
              )}

              {view === "Random" && (
                <div>
                  <Random />
                </div>
              )}
            </Col>
          </Row>
        </Container>
    </section>
  );
}

export default RecommenderDetails;
