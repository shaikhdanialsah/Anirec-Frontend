import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import AboutDescription from "./AboutDescription";
import HomeContact from "./HomeContact";
import Count from "./Count";
import Tools from "./Tools";
import { Link } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { motion } from "framer-motion";
import { AnimationControl, zoomIn } from "../../components/AnimationControl";
import { MdPeopleAlt } from "react-icons/md";
import { getDeviceType } from '../../components/deviceCheck';

function About() {
  
  const { ref, controls } = AnimationControl();
  const deviceType = getDeviceType();

  return (
    <section style={{minHeight:'100vh'}}>
      <Container fluid className="about-section">
      <Container >
        <Row style={{ justifyContent: "center", padding: "10px" }} ref={ref}>
        <div style={{ textAlign: "left" }}>
              <Link to="/" className="back-home-link"><IoHome />{deviceType==="Desktop"&&(<span>&nbsp;&nbsp; Home&nbsp;</span>)}</Link>
              &nbsp;&gt;<span className="grey"> &nbsp;About</span>
        </div>
          <Col
            md={9}
            style={{
              justifyContent: "center",
              paddingTop: "10px",
              paddingBottom: "60px",
            }}
          >
            <motion.h2 style={{paddingTop: "15px" }}
            initial="hidden"
            animate={controls}
            variants={zoomIn}>
             <strong><span className="font-color"><MdPeopleAlt /> About Us</span> </strong> 
            </motion.h2>
          </Col>
          
        </Row>
      </Container>
    </Container>
    <AboutDescription />
    <Tools />
    <Count />
    <HomeContact />
    </section>
  );
}

export default About;
