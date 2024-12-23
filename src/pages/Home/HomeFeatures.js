import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import { ImStatsBars } from "react-icons/im";
import { AnimationControl, zoomIn, fadeIn } from "../../components/AnimationControl";
import { Link } from "react-router-dom";
import { CgBrowse } from "react-icons/cg";
import { FaArrowRight} from "react-icons/fa";
import { GiCardRandom } from "react-icons/gi";
import { BiSolidMagicWand } from "react-icons/bi";
import { Tooltip } from "react-tooltip";


function HomeFeatures() {
  
  const { ref, controls } = AnimationControl();

  return (
    <Container fluid className="home-features" > 
      <Container ref={ref}>
        <Row>
          <Col className="home-about-description" >
            <motion.h2
              style={{ textAlign: "center" }}
              initial="hidden"
              animate={controls}
              variants={zoomIn}
            >
              <strong><span className="font-color"><BiSolidMagicWand /> Features</span></strong>
            </motion.h2>
            <motion.p
              initial="hidden"
              animate={controls}
              variants={fadeIn}
              transition={{ delay: 0.2 }}
              style={{paddingBottom:'10px',paddingTop:'20px'}}
            >
              <span className="grey">Explore the available features on</span> Ai<strong className="purple">Rec+</strong><br/>
              <Link to='/about' className="dashboard-link" id="learn-more">
                <span>Learn more<FaArrowRight className="arrow-icon"/></span>
              </Link>
              <Tooltip anchorId="learn-more" content="Click to read more about AniRect+" style={{ fontSize: '15px', backgroundColor: '#70cef0', color:'black', fontWeight:'bold' }} />
            </motion.p>
            
          </Col>
        </Row>

        <Row style={{margin:'0 auto'}}>
          
          <Col>        
          <motion.div
          initial="hidden"
          animate={controls}
          variants={zoomIn}>            
            <Card className="home-features-card" >
            <Link style={{textDecoration:'none'}} to="/dashboard">
                <Card.Body className="features-link">
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', paddingBottom:'10px' }}>
                    <div className="home-features-icon">
                      <ImStatsBars style={{fontSize:'45px'}} />
                    </div>
                  </div>
                  <Card.Title style={{ textAlign: 'center', marginBottom: '10px' }}><strong>Dashboard</strong></Card.Title>
                  <Card.Text style={{ textAlign: 'center', fontSize: '1rem' }}>
                    <span className="grey">Explore trends and info about anime with interactive dashboard</span>
                  </Card.Text>
                  <div className="d-flex justify-content-center">
                    <Button variant="link" className="home-features-try">
                      <strong>Try Now</strong>
                    </Button>
                  </div>
                </Card.Body>
                </Link>
              </Card>             
          </motion.div>
            
               
          </Col>

          <Col>
          <motion.div
            initial="hidden"
            animate={controls}
            variants={zoomIn}>
            <Card className="home-features-card">
            <Link style={{textDecoration:'none'}} to="/recommender">
                <Card.Body className="features-link">
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', paddingBottom:'10px' }}>
                    <div className="home-features-icon">
                      <GiCardRandom style={{fontSize:'45px'}} />
                    </div>
                  </div>
                  <Card.Title style={{ textAlign: 'center', marginBottom: '10px' }}><strong>Anime Recommender</strong></Card.Title>
                  <Card.Text style={{ textAlign: 'center', fontSize: '1rem' }}>
                  <span className="grey">Discover new and similar contents to your favourite anime</span>
                  </Card.Text>
                  <div className="d-flex justify-content-center">
                    <Button variant="link" className="home-features-try">
                      <strong>Try Now</strong>
                    </Button>
                  </div>
                </Card.Body>
                </Link> 
            </Card>
          </motion.div>
          </Col>

          <Col>
          <motion.div
            initial="hidden"
            animate={controls}
            variants={zoomIn}>
            <Card className="home-features-card">
            <Link style={{textDecoration:'none'}} to="/anicyclopedia">
                <Card.Body className="features-link">
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', paddingBottom:'10px' }}>
                    <div className="home-features-icon">
                      <CgBrowse style={{fontSize:'45px'}} />
                    </div>
                  </div>
                  <Card.Title style={{ textAlign: 'center', marginBottom: '10px' }}><strong>Browse</strong></Card.Title>
                  <Card.Text style={{ textAlign: 'center', fontSize: '1rem' }}>
                  <span className="grey">Browse through thousand list of animes and genres</span>
                  </Card.Text>
                  <div className="d-flex justify-content-center">
                    <Button variant="link" className="home-features-try">
                      <strong>Try Now</strong>
                    </Button>
                  </div>
                </Card.Body>
                </Link> 
            </Card>
          </motion.div>
          </Col>

        </Row>
      </Container>
    </Container>
  );
}
export default HomeFeatures;
