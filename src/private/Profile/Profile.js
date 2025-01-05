import React, { useState, useEffect } from "react";
import { Container, Button, Card, Dropdown, Col, Row, Alert as BootstrapAlert} from "react-bootstrap";
import { Avatar, Tabs, Tab, Box, Skeleton, Snackbar, Alert,} from "@mui/material";
import { FaRegCalendarAlt, FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MdOutlineLiveTv } from "react-icons/md";
import { FaPlay } from "react-icons/fa";
import wallpaper_1 from "../../assets/wallpaper_1.jpg";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { MdWifiTetheringError } from "react-icons/md";
import { GrView } from "react-icons/gr";
import { IoIosArrowDown } from "react-icons/io";
import { getDeviceType } from '../../components/deviceCheck';

function Profile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isFetchingFavorites, setIsFetchingFavorites] = useState(false);
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(3);
  const [visibleReviewCount, setVisibleReviewCount] = useState(3);
  const deviceType = getDeviceType();


  // API name
  const API_URL = process.env.REACT_APP_API_URL;

  //Snackbar messages
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const clickReview = (reviewId,animeId) => {
    // Redirect to the other page with the review ID in the URL
    navigate(`/anime/${animeId}#${reviewId}`);
  };

  const fetchAnimeDetailsWithLocalStorage = async (animeTitle) => {
    // Check localStorage
    const cachedData = localStorage.getItem(animeTitle);
    if (cachedData) {
      console.log("Using cached data from localStorage for:", animeTitle);
      return JSON.parse(cachedData);
    }
  
    // Fetch from API
    const query = `
      query ($search: String) {
        Media(search: $search, type: ANIME) {
          id
          title {
            romaji
            english
            native
          }
          status
          nextAiringEpisode {
            airingAt
            episode
          }
        }
      }
    `;
    const variables = { search: animeTitle };
  
    try {
      const response = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, variables }),
      });
  
      const data = await response.json();
      const animeData = data?.data?.Media;
  
      if (animeData) {
        // Store in localStorage
        localStorage.setItem(animeTitle, JSON.stringify(animeData));
      }
  
      return animeData;
    } catch (error) {
      console.error("Error fetching data from Anilist:", error);
      return null;
    }
  };
  

  useEffect(() => {
     const fetchProfileAndFavorites = async () => {
       const token = localStorage.getItem("access_token");
       if (!token) {
         setError("No token found. Please log in.");
         navigate("/login");
         setIsLoading(false);
         return;
       }
   
       try {
         // Check if the profile is stored in localStorage
         const cachedProfile = localStorage.getItem("user_profile");
         if (cachedProfile) {
           console.log("Using data from local storage for profile");
           const profileData = JSON.parse(cachedProfile);
           setUser(profileData);
   
           // Fetch user's favourites based on the cached profile data
           const favouritesResponse = await fetch(`${API_URL}/favourites/${profileData.id}`, {
             method: "GET",
             headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
             },
           });
   
           if (!favouritesResponse.ok) {
             throw new Error("Failed to fetch favourites");
           }
   
           const favouritesData = await favouritesResponse.json();
   
           // Fetch additional details for each favorite from Anilist
           const updatedFavorites = await Promise.all(
             favouritesData.favourites.map(async (fav) => {
               const animeData = await fetchAnimeDetailsWithLocalStorage(fav.title || fav.synonyms || fav.romaji);
               if (animeData) {
                 return {
                   ...fav,
                   status: animeData.status,
                   nextAiringEpisode: animeData.nextAiringEpisode,
                 };
               }
               return fav;
             })
           );
   
           setUser((prevUser) => ({
             ...prevUser,
             favourites: updatedFavorites,
           }));
   
           // Check if reviews are stored in localStorage
           const cachedReviews = localStorage.getItem(`reviews_${profileData.id}`);
           if (cachedReviews) {
             console.log("Using data from local storage for reviews");
             console.log(cachedReviews);
             setUser((prevUser) => ({
               ...prevUser,
               reviews: JSON.parse(cachedReviews),
             }));
           } else {
             // Fetch reviews from API and store them in localStorage
             const reviewsResponse = await fetch(`${API_URL}/user-reviews/${profileData.id}`, {
               method: "GET",
               headers: {
                 "Content-Type": "application/json",
                 Authorization: `Bearer ${token}`,
               },
             });
   
             if (!reviewsResponse.ok) {
               throw new Error("Failed to fetch reviews");
             }
   
             const reviewsData = await reviewsResponse.json();
             setUser((prevUser) => ({
               ...prevUser,
               reviews: reviewsData.reviews || [],
             }));
   
             // Store reviews in localStorage for future use
             localStorage.setItem(`reviews_${profileData.id}`, JSON.stringify(reviewsData.reviews || []));
           }
         } else {
           // Fetch the profile from the API if not in localStorage
           const response = await fetch(`${API_URL}/profile`, {
             method: "GET",
             headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
             },
           });
   
           if (!response.ok) {
             throw new Error("Failed to fetch profile");
           }
   
           const data = await response.json();
           setUser(data);
   
           // Store the fetched profile in localStorage for future use
           localStorage.setItem("user_profile", JSON.stringify(data));
   
           // Fetch user's favourites based on the profile data
           const favouritesResponse = await fetch(`${API_URL}/favourites/${data.id}`, {
             method: "GET",
             headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
             },
           });
   
           if (!favouritesResponse.ok) {
             throw new Error("Failed to fetch favourites");
           }
   
           const favouritesData = await favouritesResponse.json();
   
           // Fetch additional details for each favorite from Anilist
           const updatedFavorites = await Promise.all(
             favouritesData.favourites.map(async (fav) => {
               const animeData = await fetchAnimeDetailsWithLocalStorage(fav.title || fav.synonyms || fav.romaji);
               if (animeData) {
                 return {
                   ...fav,
                   status: animeData.status,
                   nextAiringEpisode: animeData.nextAiringEpisode,
                 };
               }
               return fav;
             })
           );
   
           setUser((prevUser) => ({
             ...prevUser,
             favourites: updatedFavorites,
           }));
   
           // Fetch reviews from API and store them in localStorage
           const reviewsResponse = await fetch(`${API_URL}/user-reviews/${data.id}`, {
             method: "GET",
             headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
             },
           });
   
           if (!reviewsResponse.ok) {
             throw new Error("Failed to fetch reviews");
           }
   
           const reviewsData = await reviewsResponse.json();
           setUser((prevUser) => ({
             ...prevUser,
             reviews: reviewsData.reviews || [],
           }));
   
           // Store reviews in localStorage for future use
           localStorage.setItem(`reviews_${data.id}`, JSON.stringify(reviewsData.reviews || []));
         }
       } catch (err) {
         setError(err.message);
       } finally {
         setIsLoading(false);
         setIsFetchingFavorites(false);
       }
     };
   
     fetchProfileAndFavorites();
   }, [navigate]);
  
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  const handleRemoveFavorite = async (animeId) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("No token found. Please log in.");
      setSnackbarMessage("No token found. Please log in.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/remove-favourites/${user.id}/${animeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to remove anime from favourites");
      }

      const data = await response.json();
      if (data.message) {
        // Remove the anime from the user’s favorites in the UI
        setUser((prevUser) => ({
          ...prevUser,
          favourites: prevUser.favourites.filter((fav) => fav.anime_id !== animeId),
        }));

        setSnackbarMessage("Anime removed from favourites.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        setError(data.error);
        setSnackbarMessage(data.error);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (err) {
      setError(err.message);
      setSnackbarMessage(err.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };


  if (isLoading) {
    return (
      <section style={{ minHeight: "100vh", paddingTop: "80px" }}>
        <Container style={{ maxWidth: "1200px", padding: "20px" }}>
          <Skeleton variant="rectangular" animation="wave" width="100%" height={180} sx={{ borderRadius: "8px", bgcolor: 'grey.900' }} />
          <Skeleton variant="circular" animation="wave" width={120} height={120} sx={{ marginTop: "-60px", marginLeft: "30px", backgroundColor:'grey', zIndex:'2' }} />
          <Skeleton variant="rectangular" animation="wave" width="100%" height={180} sx={{ marginTop: "-70px", borderRadius: "8px", bgcolor: '#121317' }} />
          <Skeleton variant="rectangular" animation="wave" width="100%" height={180} sx={{ marginTop:'20px', borderRadius: "8px", bgcolor: '#121317' }} />
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section style={{ minHeight: "100vh", paddingTop: "80px" }}>
        <Container style={{ maxWidth: "1200px", paddingTop: "100px" }}>
          <BootstrapAlert variant="danger" style={{maxWidth:'800px', margin:'auto'}}>
            <h2><MdWifiTetheringError /></h2>
            <h5>Error connecting to server</h5>
            <h6 style={{color:'grey'}}>Note: Please refresh your browser</h6>
          </BootstrapAlert>
        </Container>
      </section>
    );
  }

  return (
    <section style={{ minHeight: "100vh", paddingTop: "80px" }}>
      <Container style={{ maxWidth: "1200px", padding: "20px" }}>
        <div style={{ position: "relative", marginBottom: "1px" }}>
          <div
            style={{
              width: "100%",
              height: "180px",
              backgroundImage: user?.wallpaper ? `url(${user.wallpaper})` : `url(${wallpaper_1})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              borderRadius: "8px",
            }}
          ></div>
          <Avatar
            sx={{
              position: "absolute",
              bottom: "-60px",
              left: "30px",
              height: "120px",
              width: "120px",
              border: "5px solid #121317",
              zIndex: '2',
            }}
            src={user?.profile_picture}
          />
        </div>

        <Card style={{ padding: "20px", borderRadius: "8px", backgroundColor: "#121317", color: "whitesmoke" }}>
          <div style={{ textAlign: "right" }}>
            <Button onClick={handleEditProfile} className="search-button">
              <FaRegEdit style={{ marginRight: "10px" }} />
              Edit Profile
            </Button>
          </div>
          <div style={{ textAlign: "left", marginTop: "10px" }}>
            <h3>{user?.username}</h3>
            <h6 style={{ color: "grey" }}>@{user?.email}</h6>
            <h6 style={{ marginTop: "15px", color: "grey" }}>
              <FaRegCalendarAlt style={{ marginRight: "10px" }} />
              Joined {user?.created_at.slice(0,16)}
            </h6>
          </div>
        </Card>

        <Box sx={{ marginTop: "20px", backgroundColor: "#121317", color: "whitesmoke", padding: deviceType === "Desktop" ? "20px" : "" , borderRadius: "8px" }}>
          <Tabs value={selectedTab} onChange={handleTabChange} aria-label="profile tabs"
          sx={{
            '& .MuiTab-root': {
              borderRadius: '10px',  // Make it pill shaped
              textTransform: 'none',
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
            
            <Tab label={`Favourites (${user.favourites.length})`} />
            <Tab label={`Review History (${user?.reviews?.length || 0})`} />
          </Tabs>
          <Box sx={{ padding: "20px", textAlign: "left" }}>
          {selectedTab === 0 && (
              <>
                {isFetchingFavorites ? (
                  [...Array(3)].map((_, index) => (
                    <Skeleton key={index} variant="rectangular" height={120} style={{ marginBottom: "10px" }} />
                  ))
                ) : user?.favourites?.length > 0 ? (
                  <>
                    {user.favourites.slice(0, visibleCount).map((fav, index) => (
                      <Card key={index} style={{ marginBottom: "10px", backgroundColor: "#1a1a1a" }}>
                        <Card.Body>
                          {/* Dropdown icon */}
                          <Dropdown style={{ textAlign: "right", marginTop: "-10px", marginRight: "-20px" }}>
                            <Dropdown.Toggle
                              variant="link"
                              id="dropdown-basic"
                              style={{
                                backgroundColor: "transparent",
                                border: "none",
                                color: "transparent",
                                fontSize: "24px",
                                padding: 0,
                              }}
                            >
                              <PiDotsThreeOutlineVerticalFill className="grey" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu align="end" style={{ backgroundColor: "rgb(49, 48, 48)" }}>
                              <Dropdown.Item
                                onClick={() => navigate(`/anime/${fav.anime_id}`)}
                                className="profile-item-selector"
                                style={{ color: "white" }}
                              >
                                <GrView style={{ marginRight: "10px" }} />
                                View Anime
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => handleRemoveFavorite(fav.anime_id)}
                                className="profile-item-selector"
                                style={{ color: "white" }}
                              >
                                <FaRegTrashAlt style={{ marginRight: "10px" }} />
                                Remove from Favourites
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>

                          {/* Anime details */}
                          <Row style={{ marginTop: "-30px" }}>
                            <Col lg={2} md={3} sm={4}>
                              <div style={{ margin: "10px", textAlign: "center" }}>
                                <img
                                  src={fav.main_picture}
                                  alt={fav.title}
                                  style={{
                                    maxWidth: "150px",
                                    maxHeight: "170px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                  }}
                                />
                              </div>
                            </Col>

                            <Col lg={10} md={9} sm={8}>
                              <Row style={{ paddingTop: "10px" }}>
                                <Col lg={11}>
                                  <h5 style={{ color: "#fff" }}>{fav.title}</h5>
                                  <p className="purple">Score: {fav.score.toFixed(2)}</p>
                                  <p style={{ color: "grey" }}>
                                    Status:{" "}
                                    <span
                                      style={
                                        fav.status === "FINISHED"
                                          ? { color: "#70cef0", backgroundColor: "#242651ca", borderRadius: "10px", padding: "3px" }
                                          : { color: "rgba(14, 234, 175, 0.937)", backgroundColor: "rgba(13, 97, 13, 0.314)", borderRadius: "10px", padding: "3px" }
                                      }
                                    >
                                      {fav.status === "FINISHED" ? "Completed" : "On-Going"}
                                    </span>
                                  </p>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          <Row>
                            {fav.nextAiringEpisode ? (
                              <p style={{ color: "#90ee90", textAlign: "right" }}>
                                <MdOutlineLiveTv style={{ marginRight: "10px" }} />
                                Next Episode in:{" "}
                                {Math.ceil((fav.nextAiringEpisode.airingAt * 1000 - Date.now()) / (1000 * 60 * 60 * 24))} days
                              </p>
                            ) : (
                              fav.status === "RELEASING" && <p style={{ color: "grey" }}>Airing complete</p>
                            )}
                          </Row>
                        </Card.Body>
                      </Card>
                    ))}
                    {user.favourites.length > visibleCount && (
                      <div style={{ textAlign: "center", marginTop: "10px" }}>
                        <button
                          onClick={() => setVisibleCount((prev) => prev + 3)}
                          className="multi-view-more"
                        >
                          <span style={{ padding: '10px' }}>
                            Show more <IoIosArrowDown />
                          </span>
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <h6>No favourites added yet.</h6>
                )}
              </>
            )}

          {selectedTab === 1 && (
            <>
              {user?.reviews?.length > 0 ? (
                <>
                  {user.reviews.slice(0, visibleReviewCount).map((review, index) => (
                    <Card
                      key={index}
                      style={{ marginBottom: "10px", backgroundColor: "#1a1a1a", cursor: "pointer" }}
                      onClick={() => clickReview(review.id, review.anime_id)} // Add onClick to trigger the redirect
                      className="review-hover"
                    >
                      <Card.Body>
                        <Row>
                          <h6 className="purple">
                            {user.username}{" "}
                            <span className="grey">
                              <FaPlay style={{ fontSize: "10px", marginRight: "5px", marginLeft: "5px" }} />
                              {review.title}
                            </span>
                          </h6>
                          <h6 style={{ color: "white" }}>{review.comment}</h6>
                          <h6 className="grey">{review.created_at.slice(0, 16)}</h6>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}
                  {user.reviews.length > visibleReviewCount && (
                    <div style={{ textAlign: "center", marginTop: "10px" }}>
                      <button
                        onClick={() => setVisibleReviewCount((prev) => prev + 3)}
                        className="multi-view-more"
                      >
                       <span style={{ padding: '10px' }}>
                          Show more <IoIosArrowDown />
                        </span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <h6>You have not reviewed any anime yet.</h6>
              )}
            </>
          )}
          </Box>
        </Box>
      </Container>

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
            sx={snackbarSeverity == 'success' ?{ width: "100%", color:'black', fontFamily:'Quicksand, sans-serif', bgcolor:'#70cef0' } : {width:'100%', backgroundColor:'#8B0000'}}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
    </section>
  );
}

export default Profile;
