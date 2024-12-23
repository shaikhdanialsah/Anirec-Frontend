import React from "react";
import { Container, Row } from "react-bootstrap";
import MultiDetails from "./MultiDetails";
import { AnimationControl } from "../../components/AnimationControl";
import { IoIosArrowBack } from "react-icons/io";
import { FaMapMarkedAlt, FaLaugh, FaHeart, FaRocket, FaCoffee, FaRunning, FaUtensils } from "react-icons/fa";
import { GiSwordClash, GiFairyWand, GiGhost, GiMagnifyingGlass, GiDramaMasks, GiTrophy, GiHourglass } from "react-icons/gi";
import { useParams } from "react-router-dom"; // Import useParams to get the genre from the URL

function MultiGenre() {
  const { ref } = AnimationControl();
  const { genre } = useParams(); // Capture genre from URL params

  // Function to return the correct icon based on genre
  const getGenreIcon = (genre) => {
    switch (genre) {
      case "Action":
        return <GiSwordClash style={{ color: "orangered" }} />;
      case "Adventure":
        return <FaMapMarkedAlt style={{ color: "green" }} />;
      case "Award Winning":
        return <GiTrophy style={{ color: "gold" }} />;
      case "Comedy":
        return <FaLaugh style={{ color: "yellow" }} />;
      case "Drama":
        return <GiDramaMasks style={{ color: "purple" }} />;
      case "Fantasy":
        return <GiFairyWand style={{ color: "blueviolet" }} />;
      case "Gourmet":
        return <FaUtensils style={{ color: "brown" }} />;
      case "Mystery":
        return <GiMagnifyingGlass style={{ color: "darkblue" }} />;
      case "Romance":
        return <FaHeart style={{ color: "pink" }} />;
      case "Sci-Fi":
        return <FaRocket style={{ color: "lightblue" }} />;
      case "Slice of Life":
        return <FaCoffee style={{ color: "chocolate" }} />;
      case "Sports":
        return <FaRunning style={{ color: "limegreen" }} />;
      case "Supernatural":
        return <GiGhost style={{ color: "ghostwhite" }} />;
      case "Suspense":
        return <GiHourglass style={{ color: "darkred" }} />;
      default:
        return <GiHourglass style={{ color: "darkred" }} />;
    }
  };

  return (
    <section style={{ minHeight: "100vh" }}>
      <Container fluid className="multi-section" ref={ref}>
        <Container>
          <Row style={{ justifyContent: "center", paddingBottom: "30px", paddingTop: "10px", paddingLeft: "10px" }}>
            <div style={{ textAlign: "left", color: "aliceblue", cursor: "pointer" }}>
              <h6>
                <a onClick={() => window.history.back()} className="back-home-link">
                  <IoIosArrowBack />
                  &nbsp; Return&nbsp;
                </a>
              </h6>
            </div>
          </Row>
          <Row>
            <h2>
              <strong>
                <span className="font-color">
                  {getGenreIcon(genre)} {genre}
                </span>
              </strong>
            </h2>
          </Row>
        </Container>
      </Container>
      <div>
        {/* Pass the captured genre to MultiDetails */}
        <MultiDetails genre={genre} />
      </div>
    </section>
  );
}

export default MultiGenre;
