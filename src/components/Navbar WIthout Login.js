import React, { useState, useEffect, useRef } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdLogin } from "react-icons/md";


function NavBar() {
  const [expand, updateExpanded] = useState(false);
  const [navColour, updateNavbar] = useState(false);
  const location = useLocation();
  const navbarRef = useRef(null);
  const navigate = useNavigate();

  const closeNavAndRedirect = () => {
    closeNav(); // Ensure closeNav is defined and functional
    navigate("/login"); // Redirect to the login page
  };

  function scrollHandler() {
    if (window.scrollY >= 20) {
      updateNavbar(true);
    } else {
      updateNavbar(false);
    }
  }
  

  // Handle scroll events
  useEffect(() => {
    window.addEventListener("scroll", scrollHandler);
    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        updateExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navbarRef]);

  // Close the off-canvas menu on link click
  const closeNav = () => updateExpanded(false);
  const [paddingLeft, setPaddingLeft] = useState('0px');
  const [paddingTop, setPaddingTop] = useState('0px');

  useEffect(() => {
    const handleResize = () => {
      setPaddingLeft(window.innerWidth <= 990 ? '30px' : '0px');
      setPaddingTop(window.innerWidth <= 990 ? '7px' : '0px');
    };

    // Set initial padding
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Navbar
      expanded={expand}
      fixed="top"
      expand="lg"
      className={navColour ? "sticky" : "navbar"}
      ref={navbarRef}
    >
      <Container>
        
        {/* Hamburger Menu */}
        <div className="me-auto" style={{ paddingLeft, paddingTop }}>
          <Navbar.Brand href="/">
            <strong>Ani<span style={{color:"#86cee9"}}>Rec+</span></strong>
          </Navbar.Brand>
        </div>

        <Navbar.Toggle
          aria-controls="offcanvasNavbar"
          onClick={() => updateExpanded(!expand)}
          className={expand ? "navbar-toggler-active" : ""}
          style={{marginRight:'20px'}}
        >
          <span></span>
          <span></span>
          <span></span>
        </Navbar.Toggle>

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto" defaultActiveKey={location.pathname} style={{margin:'auto'}}>
            <Nav.Item>
              <Nav.Link
                as={Link}
                to="/"
                onClick={() => updateExpanded(false)}
                className={location.pathname === "/" ? "active" : ""}
              >
               Home
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                as={Link}
                to="/about"
                onClick={() => updateExpanded(false)}
                className={location.pathname === "/about" ? "active" : ""}
              >
              About
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                as={Link}
                to="/dashboard"
                onClick={() => updateExpanded(false)}
                className={location.pathname === "/dashboard" ? "active" : ""}
              >
                Dashboard
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                as={Link}
                to="/recommender"
                onClick={() => updateExpanded(false)}
                className={location.pathname === "/recommender" ? "active" : ""}
              >
                Recommender
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                as={Link}
                to="/anicyclopedia"
                onClick={() => updateExpanded(false)}
                className={location.pathname === "/anicyclopedia" ? "active" : ""}
              >
                Browse
              </Nav.Link>
            </Nav.Item>
          </Nav>

         <Button  onClick={closeNavAndRedirect} style={window.innerWidth < 976 ? { marginRight: '10px', marginTop:'10px',  zIndex:'1', width:'30%' } : { zIndex:'1', width:'11%'}} className="search-button">
            Login <MdLogin className="view-icon" />
          </Button> 

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;

