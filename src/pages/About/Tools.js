import Slider from "react-slick";
import { Container } from "react-bootstrap";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { SiMyanimelist, SiAnilist, SiKaggle, SiFlask } from "react-icons/si";
import { FaPython, FaReact } from "react-icons/fa";
import { getDeviceType } from '../../components/deviceCheck';

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

  const deviceType = getDeviceType();

  return (
    <Container fluid style={{ backgroundColor: "rgba(66, 66, 66, 0.171)", color: "#d0d0cd" }}>
      <Container>
        <Slider {...settings} style={{ margin: "auto" }}>
          <div>
            <h1 style={deviceType == 'Desktop' ? { fontSize: "65px" } : { fontSize: "45px" } }>
              <SiMyanimelist />
            </h1>
          </div>
          <div>
            <h1 style={deviceType == 'Desktop' ? { fontSize: "65px" } : { fontSize: "45px" } }>
              <SiAnilist />
            </h1>
          </div>
          <div>
            <h1 style={deviceType == 'Desktop' ? { fontSize: "65px" } : { fontSize: "45px" } }>
              <SiKaggle />
            </h1>
          </div>
          <div>
            <h1 style={deviceType == 'Desktop' ? { fontSize: "65px" } : { fontSize: "45px" } }>
              <FaPython />
            </h1>
          </div>
          <div>
            <h1 style={deviceType == 'Desktop' ? { fontSize: "65px" } : { fontSize: "45px" } }>
              <FaReact />
            </h1>
          </div>
          <div>
            <h1 style={deviceType == 'Desktop' ? { fontSize: "65px" } : { fontSize: "45px" } }>
              <SiFlask />
            </h1>
          </div>
        </Slider>
      </Container>
    </Container>
  );
};

export default Tools;
