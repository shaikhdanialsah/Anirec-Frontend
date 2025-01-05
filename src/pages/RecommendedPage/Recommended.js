import React from "react";
import { Container, Row} from "react-bootstrap";
import RecommendedDetails from "./RecommendedDetails";
import { AnimationControl} from "../../components/AnimationControl";
import { IoIosArrowBack } from "react-icons/io";
import { useParams } from "react-router-dom";


function Recommended() {
const { searchQuery } = useParams(); // Get searchQuery from the URL

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
        <h2><strong><span className="font-color">Top 20 animes similar to <span className="purple">{searchQuery}</span></span></strong></h2>
        <p style={{color:'grey'}}><span className='purple'>Info:</span> Click on the similarity button to view similarity percentage in detail</p>
        </Row>
      </Container>
    </Container>
    <div>
        <RecommendedDetails />
    </div>

    </section>
  );
}

export default Recommended;
