import React from "react";
import { Container, Row, Col} from "react-bootstrap";
import { IoHome } from "react-icons/io5";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AnimationControl, zoomIn, fadeIn} from "../../components/AnimationControl";
import { ImStatsBars } from "react-icons/im";
import { getDeviceType } from '../../components/deviceCheck';
import DashboardDetails from "./DashboardDetails";
import { FaArrowRight } from "react-icons/fa";


function Dashboard() {

  const { ref, controls } = AnimationControl();

  const deviceType = getDeviceType();

  return (
    <section style={{minHeight:'100vh'}}>
    <Container fluid className="dashboard-section" ref={ref}>
      <Container>
        <Row style={{ justifyContent: "center", padding:'10px'}}>
        <div style={{ textAlign: "left", color:'aliceblue' }}>
              <Link to="/" className="back-home-link"><IoHome />{deviceType==="Desktop"&&(<span>&nbsp;&nbsp; Home&nbsp;</span>)}</Link>
              &nbsp;&gt;<span className="grey"> &nbsp;Dashboard</span>
        </div>
        <Col
            md={9}
            style={{
              justifyContent: "center",
              paddingTop: "10px",
              paddingBottom:'40px'
            }}
          >
            <motion.h2 style={{ paddingTop: "15px"}}
            initial="hidden"
            animate={controls}
            variants={zoomIn}
            >
              <strong><span className="font-color"><ImStatsBars /> Dashboard</span></strong>
            </motion.h2>

            {/* <h5 style={{color:'white'}}>You are browsing on a {deviceType}</h5> */}
          </Col>
        </Row>
      </Container>
    </Container>
      <Container style={{marginTop:'40px', marginBottom:'30px'}}>
      {/* <Row style={{marginBottom:'20px'}}>
          <Col md={12}>
          <motion.h5
            initial="hidden"
            animate={controls}
            variants={fadeIn}
            transition={{ delay: 0.2 }}
          >
          <a href="https://app.powerbi.com/view?r=eyJrIjoiNmYzNmFjNTAtODRjZi00N2ZmLTk1OTctZDY5ZWMxZWQ5ZTkyIiwidCI6ImNkY2JiMGUyLTlmZWEtNGY1NC04NjcwLTY3MjcwNzc5N2FkYSIsImMiOjEwfQ%3D%3D" className="dashboard-link" rel="noopener noreferrer">Open in new tab<FaArrowRight className="arrow-icon" target="_blank"/></a>
          </motion.h5>
          </Col>
        </Row>  */}
         <DashboardDetails  />
      </Container>
    </section>
  );
}

export default Dashboard;
