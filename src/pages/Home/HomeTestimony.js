import React from "react";
import { Container, Row, Card} from "react-bootstrap";
import { motion } from "framer-motion";
import { Avatar } from "@mui/material";
import { AnimationControl, zoomIn, fadeIn } from "../../components/AnimationControl";
import Rating from '@mui/material/Rating';
import Slider from "react-slick";
import { FaQuoteLeft } from "react-icons/fa";
import { FaQuoteRight } from "react-icons/fa";
import { MdOutlineRateReview } from "react-icons/md";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function HomeTestimony() {

  // Settings for slider
  const settings = {
    dots: true,
    speed: 1900,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: false
  };
  
  const { ref, controls } = AnimationControl();

  return (
    <Container fluid style={{paddingTop:'30px', paddingBottom:'30px'}} >
      <Container ref={ref} style={{padding:'30px'}}>
        <Row>
          <motion.h2
            style={{ textAlign: "center", color: "white" }}
            initial="hidden"
            animate={controls}
            variants={zoomIn}
          >
            <MdOutlineRateReview /><strong><span className="font-color" > Testimony</span></strong>
          </motion.h2>

          <motion.p
            initial="hidden"
            animate={controls}
            variants={fadeIn}
            transition={{ delay: 0.2 }}
            style={{ paddingBottom: '10px', paddingTop: '20px', color: 'white' }}
          >
            <span className="grey">What our visitors have to say about</span> Ai<strong className="purple">Rec+</strong><br />
          </motion.p>
        </Row>

        {/* Slider for testimony cards */}
        <Slider {...settings}>
          <div>
          <Card style={{ backgroundColor: '#121317', color: '#FFF5EE', border: '#70cef0 1px solid', padding: '20px', maxWidth:'650px', margin:'auto' }}>
            <FaQuoteLeft style={{fontSize:'25px', color:'grey'}}/>
            <Avatar sx={{backgroundColor:'red', margin:'auto', color:'black'}}>SD</Avatar><br />
            <p><strong>Shaikh Danial</strong></p>
            <h6 className="grey">Ipoh, Perak</h6>
            <Rating name="read-only" value={5} readOnly style={{ color: "#70cef0", margin:'auto' }} /><br />
            <strong>This website is awesome</strong>
            <div style={{textAlign:'right'}}>
              <FaQuoteRight style={{fontSize:'25px', color:'grey'}}/>
            </div>
          </Card>
          </div>

          <div>
          <Card style={{ backgroundColor: '#121317', color: '#FFF5EE', border: '#70cef0 1px solid', padding: '20px', maxWidth:'650px', margin:'auto' }}>
          <FaQuoteLeft style={{fontSize:'25px', color:'grey'}}/>
          <Avatar sx={{backgroundColor:'#70cef0', margin:'auto', color:'black'}}>AA</Avatar><br />
            <p><strong>Armi Afiq</strong></p>
            <h6 className="grey">Teluk Intan, Perak</h6>
            <Rating name="read-only" value={5} readOnly style={{ color: "#70cef0", margin:'auto' }} /><br />
            <strong>Good Website</strong>
            <div style={{textAlign:'right'}}>
              <FaQuoteRight style={{fontSize:'25px', color:'grey'}}/>
            </div>
          </Card>
          </div>

          <div>
          <Card style={{ backgroundColor: '#121317', color: '#FFF5EE', border: '#70cef0 1px solid', padding: '20px', maxWidth:'650px', margin:'auto' }}>
          <FaQuoteLeft style={{fontSize:'25px', color:'grey'}}/>
          <Avatar sx={{backgroundColor:'#90ee90', margin:'auto', color:'black'}}>AN</Avatar><br />
            <p><strong>Azim Nasib</strong></p>
            <h6 className="grey">Parbun, Perak</h6>
            <Rating name="read-only" value={5} readOnly style={{ color: "#70cef0", margin:'auto' }} /><br />
            <strong>For real</strong>
            <div style={{textAlign:'right'}}>
              <FaQuoteRight style={{fontSize:'25px', color:'grey'}}/>
            </div>
          </Card>
          </div>
        </Slider>
      </Container>
    </Container>
    
  );
}

export default HomeTestimony;
