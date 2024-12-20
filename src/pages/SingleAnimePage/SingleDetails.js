import React, { useEffect, useState } from "react";
import { Container, Row, Popover, Button, Modal, Col, ProgressBar, Alert as BootstrapAlert, Form} from "react-bootstrap";
import {Snackbar, Alert, Tab, Tabs} from '@mui/material';
import { IoIosInformationCircleOutline, } from "react-icons/io";
import {  FaVideo, FaTags } from "react-icons/fa";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { AiFillCaretDown } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { PiSmileyFill, PiSmileyMehFill, PiSmileyNervousFill } from "react-icons/pi";
import { FaUserCircle } from 'react-icons/fa';
import { GoDotFill } from "react-icons/go";
import { FaArrowUp } from "react-icons/fa";
import { getDeviceType } from '../../components/deviceCheck';


function SingleDetails({ anime, isLoggedIn, user, isFavourites, reviewsData }) {
  const { title, genres, description } = anime;
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isFavourite, setIsFavourite] = useState(null);
  const [isDataReady, setIsDataReady] = useState(false); // Track data readiness
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  // const [reviews, setReviews] = useState(reviewsData); // State to store reviews
  const [newReview, setNewReview] = useState(''); // State for the input review
  const [formattedReviews, setFormattedReviews] = useState([]);
  const deviceType = getDeviceType();

  // API name
  const API_URL = process.env.REACT_APP_API_URL;

  console.log(anime.title);
  console.log(isFavourites);
  console.log(isFavourite);

  useEffect(() => {
    if (isLoggedIn) {
      if (user && typeof isFavourites != null) {
        setIsFavourite(isFavourites); // Update state when isFavourites or user data is available
        setIsDataReady(true);
      }
    } else {
      setTimeout(() => {
        setIsDataReady(true);
      }, 100);
    }
  }, [user, isFavourites]); // This will run when user or isFavourites changes

  useEffect(() => {
    const formatted = reviewsData.map(review => ({
      ...review,
      timeAgo: timeAgo(review.created_at),
    }));
    setFormattedReviews(formatted);
  }, [reviewsData]);
  

  const handleAddRemoveFromFavourites = async () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      const userId = user?.id;
      const animeId = anime?.anime_id;

      if (!userId || !animeId) {
        setSnackbarMessage("Error: Missing user or anime data.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      setIsLoading(true); // Set loading to true when operation begins
      try {
        const url = `${API_URL}/${isFavourite ? "remove-favourites" : "add-favourites"}/${userId}/${animeId}`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        if (response.ok) {
          setIsFavourite(!isFavourite);
          setSnackbarMessage(isFavourite ? "Anime removed from favourites" : "Anime added to favourites!");
          setSnackbarSeverity("success");
        } else {
          setSnackbarMessage("Failed to update favourites");
          setSnackbarSeverity("error");
        }
      } catch (error) {
        console.error("Error updating favourites:", error);
        setSnackbarMessage("An error occurred while updating favourites.");
        setSnackbarSeverity("error");
      } finally {
        setIsLoading(false); // Reset loading state
        setSnackbarOpen(true);
      }
    }
  };

  
  
  
  //Snackbar alert
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [selectedTab, setSelectedTab] = useState(0);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const formatNumber = (num) => {
    if (num >= 10000 && num < 1000000) {
      return (num / 1000).toFixed(1) + "k";
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    return num.toString();
  };

  const timeAgo = (dateString) => {
    const now = new Date();
    const createdDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - createdDate) / 1000);
  
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }
  
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    }
  
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    }
  
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    }
  
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `${diffInWeeks} weeks ago`;
    }
  
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} months ago`;
    }
  
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} years ago`;
  };  

  if (!isDataReady) {
    return (
      <Container fluid className="home-contact" id="about">
        <Container>
          
        </Container>
      </Container>
    );
  }

  const handleAddReview = async (e) => {
    e.preventDefault(); // Prevent default form submission
  
    if (!newReview.trim()) {
      setSnackbarMessage("Review cannot be empty.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
  
    // Ensure required data is available
    if (!user?.id || !anime?.anime_id) {
      console.error("Missing required data for adding a review.");
      return;
    }
  
    try {
      const response = await fetch(`${API_URL}/add-review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          anime_id: anime.anime_id,
          comment: newReview.trim(),
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to add review.");
      }
  
      const result = await response.json();
      console.log("Review added successfully:", result);
  
      // Clear the text area and refresh the reviews
      setNewReview("");
      setSnackbarMessage("Review added successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
  
      // Create the new review data
      const now = new Date(); // Get the current date and time
      const newReviewData = {
        anime_id: anime.anime_id,
        name: user.username,
        comment: newReview.trim(),
        timeAgo: 'Just now', // Use a human-readable text for now
        profile_picture: user.profile_picture,
        created_at: now.toUTCString(), // Format as "Thu 11 Dec 2024 10:50:20 GMT"
        title: anime.title, // Ensure title is also included
      };
  
      // Retrieve the current reviews from localStorage
      const cachedReviews = localStorage.getItem(`reviews_${user.id}`);
      const currentReviews = cachedReviews ? JSON.parse(cachedReviews) : [];
  
      // Add the new review to the existing list and update state
      const updatedReviews = [...currentReviews, newReviewData];
  
      // Store the updated reviews list in localStorage for the user
      localStorage.setItem(`reviews_${user.id}`, JSON.stringify(updatedReviews));
  
      // Update the reviews in state
      setFormattedReviews((prevReviews) => [...prevReviews, newReviewData]);
    } catch (err) {
      console.error("Error adding review:", err);
      setSnackbarMessage("Failed to add review.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };
  
  
    

  return (
    <Container fluid className="home-contact" id="about">
      <Container>
        <Row style={{ paddingTop: "50px", paddingLeft: "20px", textAlign: "left" }} className="font-color">
          <Col lg={8}>
            <h2 style={{ paddingBottom: "10px" }}>{title}</h2>

            {/* Genre / genres of the anime */}
            <div>
              {genres.split(", ").map((genre, index) => (
                <Link to={`/anime-genre/${genre}`} key={index}>
                  <button className="button-view-genres" style={{ width: "auto" }}>
                    {genre.trim()}
                  </button>
                </Link>
              ))}
            </div>

            <h6>
              <span style={{ color: "white" }}>Rating:</span>
              {anime.score > 7 ? (
                <PiSmileyFill style={{ marginRight: '5px', fontSize: '24px', color: '#52B640' }} />
              ) : anime.score >= 5 ? (
                <PiSmileyMehFill style={{ marginRight: '5px', fontSize: '24px', color: 'orange' }} />
              ) : (
                <PiSmileyNervousFill style={{ marginRight: '5px', fontSize: '24px', color: '#FF4433' }} />
              )}
              <span
                style={{ color: anime.score > 7 ? '#52B640' : anime.score >= 5 ? 'orange' : '#FF4433', fontWeight: 'bold' }} >
                {(Math.round(anime.score * 100) / 100).toFixed(2)}
              </span> / 10 | ({formatNumber(anime.scored_by)} ratings)&nbsp;

              {/* Score distribution */}
              <OverlayTrigger
                trigger="click"
                placement="bottom"
                overlay={
                  <Popover
                    id={`popover-positioned-bottom`}
                    style={{
                      backgroundColor: "black",
                      borderColor: "white",
                      color: "grey",
                      zIndex: 1,
                    }}
                  >
                    <Popover.Header
                      as="h3"
                      style={{
                        backgroundColor: "black",
                        color: "white",
                        borderColor: "white",
                        fontFamily: "Quicksand, sans-serif",
                      }}
                    >
                      {`Score distribution from 1 - 10`}
                    </Popover.Header>
                    <Popover.Body style={{ color: "whitesmoke", fontFamily: "Quicksand, sans-serif" }}>
                      {Array.from({ length: 5 }, (_, i) => {
                        const scoreIndexTop = 10 - i;
                        const scoreIndexBottom = 5 - i;
                        const scoreValueTop = anime[`score_${scoreIndexTop}`] || 0;
                        const scoreValueBottom = anime[`score_${scoreIndexBottom}`] || 0;
                        const scoredBy = anime.scored_by || 1;

                        const scorePercentageTop = (scoreValueTop / scoredBy) * 100;
                        const scorePercentageBottom = (scoreValueBottom / scoredBy) * 100;

                        return (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "8px",
                            }}
                          >
                            <strong style={{ marginRight: "10px" }}>{scoreIndexTop}</strong>
                            <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                              <ProgressBar now={scorePercentageTop} style={{ flex: 1 }} />
                              <span style={{ marginLeft: "8px" }}>{`${scorePercentageTop.toFixed(0)}%`}</span>
                            </div>
                            &nbsp; &nbsp;
                            <strong style={{ marginRight: "10px" }}>{scoreIndexBottom}</strong>
                            <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                              <ProgressBar now={scorePercentageBottom} style={{ flex: 1 }} />
                              <span style={{ marginLeft: "8px" }}>{`${scorePercentageBottom.toFixed(0)}%`}</span>
                            </div>
                          </div>
                        );
                      })}
                    </Popover.Body>
                  </Popover>
                }
              >
                <Button variant="dark" style={{ fontSize: "12px", padding: "7px", marginRight:'20px' }}>
                  <AiFillCaretDown />
                </Button>
              </OverlayTrigger>

              {/* Favourite Button */}
              <Button
                onClick={handleAddRemoveFromFavourites}
                className={`${isFavourite ? "search-button" : "favourites_button "}`}
                disabled={isLoading} // Disable button while loading
              >
                {isLoading ? (
                  <span>
                    <div className="spinner-border spinner-border-sm" role="status" style={{fontSize:"15px", marginRight: "10px" }}></div>
                    {isFavourite ? "Removing..." : "Adding..."}
                  </span>
                ) : (
                  <>
                   {!isFavourite ? ( <FaRegStar style={{ fontSize: "25px", marginRight: deviceType === "Desktop" ? "10px" : "0px",}} /> ) : (<FaStar style={{ fontSize: "25px", marginRight: deviceType === "Desktop" ? "10px" : "0px", }} className="star_color" />)  }
                   {deviceType === "Desktop" ? (isFavourite ? "Remove from Favourites" : "Add to Favourites") : ""}
                  </>
                )}
              </Button>
            </h6>

            {/* Description */}
            <div style={{ textAlign: "justify", paddingTop:'20px' }}>
              <h5>Description: </h5>
              <p className="grey">{description}</p>
              <br />
            </div>
          </Col>

          {/* Trailer Section */}
          <Col lg={4} style={{ paddingBottom: "30px" }}>
            <div>
              <h5 style={{ color: "white", cursor: "pointer" }} onClick={() => setShowModal(true)}>
                Anime Trailer
              </h5>
              {anime?.trailer !== "Not Available" ? (
                <>
                  <Button onClick={() => setShowModal(true)} style={{ width: "100%" }} className="search-button">
                    <FaVideo style={{ marginRight: '10px' }} /> Watch Trailer
                  </Button>
                  <Modal show={showModal} onHide={() => setShowModal(false)} fullscreen  >
                    <Modal.Header closeButton style={{backgroundColor:'rgba(0, 0, 0, 0.96)', border:'none'}} closeVariant='white'>
                      <Modal.Title className="purple">Anime Trailer</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{backgroundColor:'rgba(0, 0, 0, 0.96)'}}>
                      <iframe
                        width="100%"
                        height="100%"
                        src={anime.trailer.replace("watch?v=", "embed/")}
                        title="Anime Trailer"
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </Modal.Body>
                  </Modal>
                </>
              ) : (
                <BootstrapAlert variant="info">
                  <IoIosInformationCircleOutline fontSize={"25px"} /> Trailer is not available
                </BootstrapAlert>
              )}
            </div>
          </Col>
        </Row>

        {/* Other Details */}
        <Tabs value={selectedTab} onChange={handleTabChange} aria-label="profile tabs"
          sx={{
            '& .MuiTab-root': {
              borderRadius: '10px',  // Make it pill shaped
              textTransform: 'none',
              marginLeft:'20px',
              fontSize: '17px',
              fontFamily: 'Quicksand, sans-serif',
              color: 'rgb(219, 217, 217)',
              backgroundColor: 'transparent',  // Background color for the tabs
              '&.Mui-selected': {
                color: '#70cef0',  // Darker color when selected
                fontWeight:'bold'
              },
            },
          }}>
            
            <Tab label="Other Details" />
            <Tab label={`Reviews (${formattedReviews.length})`} />
          </Tabs>
         
            {selectedTab === 0 && (
              <>
               <Row style={{ paddingLeft: "20px", textAlign: "left", paddingBottom: "10px", color: "white", paddingTop:'20px' }}>
                  {/* Studio Name */}
                  <Col lg={8} className="d-flex justify-content-between">
                    <h6><FaTags style={{marginRight:'8px'}} className="purple"/>Studio</h6>
                    <h6 className="grey" style={{ textAlign: "right" }}><span>{anime.studios}</span></h6>
                  </Col>
                  <Col lg={8}><hr /></Col>

                  {/* Anime Type */}
                  <Col lg={8} className="d-flex justify-content-between">
                    <h6><FaTags style={{marginRight:'8px'}} className="purple"/>Anime Type</h6>
                    <h6 className="grey" style={{ textAlign: "right" }}>{anime.type}</h6>
                  </Col>
                  <Col lg={8}><hr /></Col>

                  {/* Source of Anime */}
                  <Col lg={8} className="d-flex justify-content-between">
                    <h6><FaTags style={{marginRight:'8px'}} className="purple"/>Sources</h6>
                    <h6 className="grey" style={{ textAlign: "right" }}>{anime.source}</h6>
                  </Col>
                  <Col lg={8}><hr /></Col>

                  {/* Year Released */}
                  <Col lg={8} className="d-flex justify-content-between">
                    <h6><FaTags style={{marginRight:'8px'}} className="purple"/>Year Released</h6>
                    <h6 className="grey" style={{ textAlign: "right" }}>{anime.year}</h6>
                  </Col>
                </Row>
              </>
            )}

            {selectedTab === 1 && (
              <Row style={{ paddingLeft: '20px', textAlign: 'left', paddingBottom: '10px', color: 'white', paddingTop: '20px' }}>
              {/* Section to display reviews */}
              <Col lg={8} style={{ marginBottom: '20px', paddingLeft:'20px', maxHeight:'250px', overflow:'hidden', overflowY:'auto' }}>
                {formattedReviews.length > 0 ? (
                  formattedReviews.map((review) => (
                    <Row key={review.id} className="mb-3" style={{paddingBottom:'15px'}}>
                      <Col lg={1} xs={2} className="d-flex justify-content-center align-items-center">
                        {review.profile_picture ? (
                          <img
                            src={review.profile_picture}
                            alt={`${review.name}'s profile`}
                            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                          />
                        ) : (
                          <FaUserCircle size={50} color="rgb(219, 217, 217)" />
                        )}
                      </Col>
                      <Col lg={11} xs={10}>
                        <h6 style={{ margin: 0, color: '#70cef0' }}>{review.name}<GoDotFill style={{fontSize:'8px', marginLeft:'3px', marginRight:'3px'}}/>{review.timeAgo}</h6>
                        <p style={{ margin: 0, color: 'rgb(219, 217, 217)' }}>{review.comment}</p>
                        <p style={{ margin: 0, color: 'grey' }}>{review.created_at.slice(4,16)}</p>
                      </Col>
                    </Row>
                  ))
                ) : (
                  <p style={{ color: 'rgb(219, 217, 217)' }}>No reviews yet. Be the first to add one!</p>
                )}
              </Col>
        
              {/* Section to add a new review */}
              {isLoggedIn ? (
                 <Col lg={8}>
                   <Form onSubmit={handleAddReview}>
                     <Form.Group style={{ position: 'relative' }}>
                       <Form.Control
                         as="textarea"
                         rows={2}
                         placeholder="Add a review..."
                         value={newReview}
                         onChange={(e) => setNewReview(e.target.value)}
                         style={{
                           backgroundColor: 'transparent',
                           color: 'white',
                           borderColor: '#70cef0',
                           paddingRight: '100px', // Space for the button
                         }}
                       />
                       <Button
                         className="search-button"
                         type="submit"
                         disabled={!newReview.trim()} // Disable if newReview is empty or only whitespace
                         style={{
                           position: 'absolute',
                           right: '10px',
                           bottom: '10px',
                           backgroundColor: '#70cef0',
                           borderColor: '#70cef0',
                           padding: '5px 10px',
                           cursor: !newReview.trim() ? 'not-allowed' : 'pointer', // Optional visual feedback
                         }}
                       >
                         <FaArrowUp />
                       </Button>
                     </Form.Group>
                   </Form>
                  </Col>
              ) : (
                <Col lg={8} >
                  <Button onClick={handleLogin} className="search-button" >Login to add a review</Button>
                </Col>
                
              )}
             
            </Row>
            )}
        
      </Container>

      {/* Login Modal */}
      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Login Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please log in to add this anime to your favourites.</p>
          <Button onClick={handleLogin} className="search-button" style={{ margin: 'auto' }}>Proceed to Log In</Button>
        </Modal.Body>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          variant="filled"
          severity={snackbarSeverity}
          sx={snackbarSeverity === 'success' ? { width: "100%", color: 'black', fontFamily: 'Quicksand, sans-serif', bgcolor:'#70cef0' } : { width: '100%', backgroundColor: '#8B0000', }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      

    </Container>

    
  );
}

export default SingleDetails;
