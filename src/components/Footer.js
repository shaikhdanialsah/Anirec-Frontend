import React, {useEffect, useState}from "react";
import { Container, Row, Col } from "react-bootstrap";
import {AiFillGithub,} from "react-icons/ai";
import { FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import { BsBarChartFill } from "react-icons/bs";
import { TbAntennaBarsOff } from "react-icons/tb";

function Footer() {

  let date = new Date();
  let year = date.getFullYear();
  const [statusMessage, setStatusMessage] = useState('Checking status...');

  // API name
  const API_URL = process.env.REACT_APP_API_URL;

  // Backend status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/status`);
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();
        setStatusMessage(data.message || 'No message received');
      } catch (error) {
        setStatusMessage('Failed to connect');
      }
    };

    checkStatus();
  }, []);


  return (
    <Container fluid className="footer">
      <Row>
        <Col md="3" className="footer-copywright" style={{}}> 
          <h3>© {year} AniRec+</h3>
        </Col>
        <Col md="6" className="footer-body">
          <ul className="footer-icons">
          <li className="social-icons">
              <a
                href="https://wa.me/+60193409508"
                style={{ color: "black"}}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <div className="circle-container">
                  <FaWhatsapp style={{fontSize:'23px'}}/>
                </div>
                
              </a>
            </li>
            <li className="social-icons">
              <a
                href="mailto:shaikhdanial02@gmail.com"
                style={{ color: "black" }}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <div className="circle-container">
                  <FaEnvelope style={{fontSize:'23px'}}/>
                </div>
              </a>
            </li>
            
            <li className="social-icons">
              <a
                href="https://github.com/shaikhdanialsah"
                style={{ color: "black" }}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <div className="circle-container">
                  <AiFillGithub style={{fontSize:'23px'}} />
                </div>
              </a>
            </li>
          </ul>
        </Col>
        <Col md="3" className="footer-copywright" style={statusMessage==='online'?{color:'#90ee90'}:{color:'#EE4B2B'}}>
        {
        statusMessage==='online' ? <h6><BsBarChartFill  style={{marginRight:'10px'}}/>Server is online</h6> 
        : 
        <h6><TbAntennaBarsOff style={{marginRight:'10px'}}/>Server is offline</h6>
        }
        
        </Col>
      </Row>
    </Container>
  );
}

export default Footer;
