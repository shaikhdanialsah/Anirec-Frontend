import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaWhatsapp,FaEnvelope } from 'react-icons/fa';
import { FaLocationDot } from "react-icons/fa6";
import { motion } from "framer-motion";
import { AnimationControl, zoomIn, fadeIn } from "../../components/AnimationControl";
import { FiPhoneCall } from "react-icons/fi";

function HomeContact() {
  
  const { ref, controls } = AnimationControl();

  return (
    <Container fluid className="home-contact" id="about" style={{backgroundColor:'rgba(66, 66, 66, 0.171)'}}>
      <Container>
        <Row>
          <Col className="home-about-description" ref={ref}>
            <motion.h2
              style={{ textAlign: "center" }}
              initial="hidden"
              animate={controls}
              variants={zoomIn}
            >
              <strong><span className="font-color"><FiPhoneCall /> Contact</span></strong>
            </motion.h2>
            <motion.p
              initial="hidden"
              animate={controls}
              variants={fadeIn}
              transition={{ delay: 0.2 }}
              style={{paddingTop:'20px'}}
            >
              Feel free <strong className="purple">to let us know</strong> your valuable feedback
            </motion.p> 
          </Col>
        </Row>
        <Row>
          <Col>
          <motion.p
              className="home-about-body"
              initial="hidden"
              animate={controls}
              variants={fadeIn}
              transition={{ delay: 0.2 }}
              style={{width:'340px', margin:'auto', paddingLeft:'50px'}}
            >
              <div style={{paddingBottom:'7px'}}>
                <a href='mailto:shaikhdanial02@gmail.com'><FaEnvelope style={{marginRight:'10px'}}/> shaikhdanial02@gmail.com<br /></a>
              </div>
              <div style={{paddingBottom:'7px'}}>
                <a href='https://wa.me/+60193409508'><FaWhatsapp style={{marginRight:'10px'}}/> +60 19-340 9508<br /></a>
              </div>
              <a href="https://www.google.com/maps/place/Universiti+Teknologi+MARA+Perlis+(UiTM+Perlis)/@6.4617746,100.2794541,15z">
                <FaLocationDot style={{marginRight:'10px'}}/> UiTM Perlis
              </a>
            </motion.p>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
export default HomeContact;
