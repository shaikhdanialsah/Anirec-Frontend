import React from "react";
import { Container, Row, Col,Card } from "react-bootstrap";
import { HiUsers } from "react-icons/hi";
import { BiWorld } from "react-icons/bi";
import { GrMultimedia } from "react-icons/gr";
import { FaRankingStar } from "react-icons/fa6";
import { FaTheaterMasks } from "react-icons/fa";
import CountUp from 'react-countup';

function Count() {

  return (
    <Container fluid className="home-contact" id="about" >
      <Container style={{paddingTop:'70px'}}>

        {/* Title */}
        <Row>
            <h2 style={{color:'white'}}><strong>Our Data Consist of</strong></h2>
        </Row>

        {/* Stats Cards 1st row */}
        <Row style={{paddingTop:'30px', width:'90%', margin:'auto'}}>
            <Col lg={4}>
                <Card style={{margin:'30px',backgroundColor:'#121317', color:'whitesmoke', borderBottom:'#70cef0 10px solid'}}>
                    <GrMultimedia style={{margin:'auto',padding:'10px',fontSize:'70px', color:'#70cef0'}}/>
                    <span style={{fontSize:'30px'}}><strong><CountUp end={6000} />+</strong></span>
                    <span style={{paddingBottom:'20px'}} className="grey">Number of animes</span>
                </Card>
            </Col>

            <Col lg={4}>
                <Card style={{margin:'30px',backgroundColor:'#121317', color:'whitesmoke', borderBottom:'#70cef0 10px solid'}}>
                    <FaRankingStar style={{margin:'auto',padding:'10px',fontSize:'70px', color:'#70cef0'}}/>
                    <span style={{fontSize:'30px'}}><strong><CountUp end={6800000} />+</strong></span>
                    <span style={{paddingBottom:'20px'}} className="grey">Total Ratings</span>
                </Card>
            </Col>

            <Col lg={4}>
                <Card style={{margin:'30px',backgroundColor:'#121317', color:'whitesmoke', borderBottom:'#70cef0 10px solid'}}>
                    <FaTheaterMasks style={{margin:'auto',padding:'10px',fontSize:'70px', color:'#70cef0'}}/>
                    <span style={{fontSize:'30px'}}><strong><CountUp end={13} /></strong></span>
                    <span style={{paddingBottom:'20px'}} className="grey">Genre</span>
                </Card>
            </Col>
            
        </Row>

         {/* Stats Cards 2nd row */}
         <Row style={{paddingTop:'30px', width:'90%', margin:'auto'}}>
             <Col lg={4}>
                <Card style={{margin:'30px',backgroundColor:'#121317', color:'whitesmoke', borderBottom:'#70cef0 10px solid'}}>
                    <HiUsers style={{margin:'auto',padding:'10px',fontSize:'70px', color:'#70cef0'}}/>
                    <span style={{fontSize:'30px'}}><strong><CountUp end={7000} />+</strong></span>
                    <span style={{paddingBottom:'20px'}} className="grey">Users</span>
                </Card>
            </Col>

            <Col lg={4}>
                <Card style={{margin:'30px',backgroundColor:'#121317', color:'whitesmoke', borderBottom:'#70cef0 10px solid'}}>
                    <BiWorld style={{margin:'auto',padding:'10px',fontSize:'70px', color:'#70cef0'}}/>
                    <span style={{fontSize:'30px'}}><strong><CountUp end={120} />+</strong></span>
                    <span style={{paddingBottom:'20px'}} className="grey">Countries</span>
                </Card>
            </Col>
        </Row>

      </Container>
    </Container>
  );
}
export default Count;
