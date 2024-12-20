import React from "react";
import {Card, Row, Col} from "react-bootstrap";
import { motion } from "framer-motion";
import { AnimationControl, fadeIn } from "../../components/AnimationControl";
import anime_about from "../../assets/anime_dashboard.jpg";

function AboutDescription() {
  const { ref, controls } = AnimationControl();

  return (
    <Row style={{paddingRight:'10px', paddingLeft:'10px',margin:'auto', paddingTop:'100px', paddingBottom:'70px'}} ref={ref}>
      <Col lg={6} style={{overflow:'hidden'}}><img src={anime_about} style={{height:'120%', width:'90%', borderRadius:'10px'}}></img></Col>
        <Col lg={6} xs>
          <motion.h2 style={{color:'whitesmoke', paddingBottom:'20px', paddingTop:'20px'}}
                initial="hidden"
                animate={controls}
                variants={fadeIn}
                transition={{ delay: 0.2 }}>
                What is Anirec+?
          </motion.h2>
          <Card className="about-description">
            <Card.Body>
              <blockquote className="blockquote mb-0" >
                <motion.h5
                  style={{ textAlign: "justify"}}
                  initial="hidden"
                  animate={controls}
                  variants={fadeIn}
                  transition={{ delay: 0.2 }}
                  className="grey"
                >
                  <strong>Ani<span className="purple">Rec+ </span></strong>
                  is a web-based system combining both <span className="purple">dashboard and recommender system. </span>
                  The platform provides interactive data visualization that enable users to explore anime trends and gain insights into various data points. 
                  Additionally, the recommender system leverages content-based filtering to offer personalized anime suggestions, helping users discover shows that match their preferences.
                </motion.h5>
              </blockquote>
            </Card.Body>
          </Card>
        </Col>
    </Row>
    
  );
}

export default AboutDescription;
