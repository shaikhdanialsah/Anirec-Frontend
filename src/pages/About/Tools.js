import Slider from "react-slick";
import { Container } from "react-bootstrap";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { SiMyanimelist, SiAnilist, SiKaggle, SiFlask } from "react-icons/si";
import { FaPython, FaReact } from "react-icons/fa";

const Tools = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 2500, // Increase speed for smoother transitions
    slidesToShow: 5,
    arrows: false,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0, // Set to 0 for continuous movement
    pauseOnHover: false, 
    cssEase: "linear", // Linear animation for smoothness
  };

  return (
    <Container fluid style={{ backgroundColor: "rgba(66, 66, 66, 0.171)", color: "#d0d0cd" }}>
      <Container>
        <Slider {...settings} style={{ margin: "auto" }}>
          <div>
            <h1 style={{ fontSize: "65px" }}>
              <SiMyanimelist />
            </h1>
          </div>
          <div>
            <h1 style={{ fontSize: "65px" }}>
              <SiAnilist />
            </h1>
          </div>
          <div>
            <h1 style={{ fontSize: "65px" }}>
              <SiKaggle />
            </h1>
          </div>
          <div>
            <h1 style={{ fontSize: "65px" }}>
              <FaPython />
            </h1>
          </div>
          <div>
            <h1 style={{ fontSize: "65px" }}>
              <FaReact />
            </h1>
          </div>
          <div>
            <h1 style={{ fontSize: "65px" }}>
              <SiFlask />
            </h1>
          </div>
        </Slider>
      </Container>
    </Container>
  );
};

export default Tools;
