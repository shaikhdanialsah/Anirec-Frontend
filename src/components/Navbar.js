import React, { useState, useEffect, useRef } from "react";
import { Button, Container, Nav, Navbar, Modal } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";

function NavBar() {
  const [expand, updateExpanded] = useState(false);
  const [navColour, updateNavbar] = useState(false);
  const location = useLocation();
  const navbarRef = useRef(null);
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // API name
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token); // Set login state based on token existence
  }, []);

  const handleLoginRedirect = () => {
    navigate("/login");
    updateExpanded(false);
  };

  const handleLogoutModalClose = () => setShowLogoutModal(false);
  const handleLogoutModalShow = () => setShowLogoutModal(true);

  function scrollHandler() {
    if (window.scrollY >= 20) {
      updateNavbar(true);
    } else {
      updateNavbar(false);
    }
  }

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

  const [paddingLeft, setPaddingLeft] = useState("0px");
  const [paddingTop, setPaddingTop] = useState("0px");

  useEffect(() => {
    const handleResize = () => {
      setPaddingLeft(window.innerWidth <= 990 ? "30px" : "0px");
      setPaddingTop(window.innerWidth <= 990 ? "7px" : "0px");
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogout = async () => {
    handleLogoutModalClose(); // Close the modal
  
    try {
      // Optionally notify backend to invalidate the token
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Clear all local storage items (if needed)
      localStorage.removeItem("access_token");
      localStorage.clear()
  
      // Update state and navigate to login page
      setIsLoggedIn(false);
      navigate("/login");
    }
  };
  

  return (
    <>
      <Navbar
        expanded={expand}
        fixed="top"
        expand="lg"
        className={navColour ? "sticky" : "navbar"}
        ref={navbarRef}
      >
        <Container>
          <div className="me-auto" style={{ paddingLeft, paddingTop }}>
            <Navbar.Brand href={isLoggedIn ? "/home" : "/"}>
              <strong>
                Ani<span style={{ color: "#86cee9" }}>Rec+</span>
              </strong>
            </Navbar.Brand>
          </div>

          <Navbar.Toggle
            aria-controls="offcanvasNavbar"
            onClick={() => updateExpanded(!expand)}
            className={expand ? "navbar-toggler-active" : ""}
            style={{ marginRight: "20px" }}
          >
            <span></span>
            <span></span>
            <span></span>
          </Navbar.Toggle>

          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav
              className="ms-auto"
              defaultActiveKey={location.pathname}
              style={{ margin: "auto" }}
            >
              <Nav.Item>
                <Nav.Link
                  as={Link}
                  to={isLoggedIn ? "/home" : "/"}
                  onClick={() => updateExpanded(false)}
                  className={location.pathname === "/" || location.pathname === "/home" ? "active" : ""}
                >
                  Home
                </Nav.Link>
              </Nav.Item>

              {!isLoggedIn && (
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
              )}

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

            {isLoggedIn ? (
              <Button
                onClick={handleLogoutModalShow}
                style={
                  window.innerWidth < 976
                    ? { marginRight: "10px", marginTop: "10px", zIndex: "1", width: "30%" }
                    : { zIndex: "1", width: "11%" }
                }
                className="search-button"
              >
                Logout <MdLogout className="view-icon" />
              </Button>
            ) : (
              <Button
                onClick={handleLoginRedirect}
                style={
                  window.innerWidth < 976
                    ? { marginRight: "10px", marginTop: "10px", zIndex: "1", width: "30%" }
                    : { zIndex: "1", width: "11%" }
                }
                className="search-button"
              >
                Login
              </Button>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Logout Confirmation Modal */}
      <Modal show={showLogoutModal} onHide={handleLogoutModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to log out?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleLogoutModalClose}>
            Cancel
          </Button>
          <Button variant="danger" style={{backgroundColor:'#8B0000'}} onClick={handleLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}


export default NavBar;
