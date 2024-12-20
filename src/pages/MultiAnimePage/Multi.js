import React from "react";
import { Container, Row} from "react-bootstrap";
import MultiDetails from "./MultiDetails";
import { AnimationControl} from "../../components/AnimationControl";
import { IoIosArrowBack } from "react-icons/io";
import { FaFire } from "react-icons/fa";


function Multi() {

  const { ref } = AnimationControl();

  return (
    <section style={{minHeight:'100vh'}}>
      <Container fluid className="multi-section" ref={ref}>
      <Container>
        <Row style={{ justifyContent: "center", paddingBottom: "30px",paddingTop:'10px',paddingLeft:'10px' }}>
        <div style={{ textAlign: "left", color:'aliceblue',cursor:'pointer' }}>
          <h6><a onClick={() => window.history.back()} className="back-home-link"><IoIosArrowBack />&nbsp; Return&nbsp;</a></h6>
        </div>
        </Row>
        <Row>
        <h2><strong><span className="font-color"><FaFire style={{color:'orangered'}}/> Most Popular Anime</span></strong></h2>
        </Row>
      </Container>
    </Container>
    <div>
        <MultiDetails />
    </div>

    </section>
  );
}

export default Multi;
