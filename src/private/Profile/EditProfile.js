import React, { useState, useEffect } from "react";
import { Container, Card, Modal, Row, Button, Spinner, Col } from "react-bootstrap";
import { TextField, Box, Snackbar, Alert, Switch} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Avatar, IconButton } from "@mui/material";
import { MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";

// Wallpapers and Avatars
import wallpaper_1 from "../../assets/wallpaper_1.jpg";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#70cef0" },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
    },
  },
  typography: {
    fontFamily: "Quicksand, sans-serif",
  },
});

function EditProfile() {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [background, setBackground] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imageType, setImageType] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);  // Set initial state to false
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [checked, setChecked] = useState(true);

  const wallpapers = ['https://rare-gallery.com/thumbs/945078-anime-Kimi-no-Na-Wa-night-low-angle.jpg', 'https://e1.pxfuel.com/desktop-wallpaper/204/232/desktop-wallpaper-comet-kimi-no-na-wa-your-name-your-name-pc.jpg', 'https://img.freepik.com/free-photo/japan-background-digital-art_23-2151546140.jpg'];
  
  // 5 Jan 2025 (Add new avatars for user profile picture)
  const avatars = ['https://avatarfiles.alphacoders.com/375/thumb-1920-375542.png', 'https://64.media.tumblr.com/e40126dcc0477972febd1d5b8a0e7f64/4ec7e6a83c8d9508-7d/s1280x1920/d813625ac450328d7adcb40ad8ce1bdf6e60c9ee.jpg', 'https://i.pinimg.com/564x/c3/c2/05/c3c20561f69db03c456a68ab0b4fc33c.jpg', 'https://cdn.mos.cms.futurecdn.net/AebrjUYkBvHG6YokQxeeCf.jpg',
  'https://i.pinimg.com/736x/dd/9a/7a/dd9a7a16bc6815a508b44b12d4df5407.jpg', 'https://i.redd.it/the-my-melody-anime-is-so-peak-v0-zgwoegg9l8dc1.png?width=2420&format=png&auto=webp&s=325e420187bbed8f4c433b14097588d96f322522', 'https://cdn.rafled.com/anime-icons/images/ab222a09d15e3d829c48ee5fa5470bc60004a5c8a65248b0d9dcd8a6d182c8ff.jpg','https://i.pinimg.com/originals/60/6f/e3/606fe3a7af3f5671aeb0463f1e72c581.jpg',
  'https://i.pinimg.com/736x/1e/8b/f3/1e8bf3b2adefdfe76bb5dfe9bafe1ed5.jpg','https://i.pinimg.com/736x/c8/db/e9/c8dbe9c7b3abf17f237dc1b8275a9c73.jpg'];


  // API name
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      try {
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
        setAvatar(data.profile_picture); 
        setBackground(data.wallpaper || wallpaper_1);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, []);

  const openModal = (type) => {
    setImageType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setImageType(null);
    setPreviewImage(null);
  };

  const handleWallpaperSelect = (wallpaper) => {
    setPreviewImage(wallpaper);
  };

  const handleAvatarSelect = (avatar) => {
    setPreviewImage(avatar);
  };

  const saveImage = () => {
    if (imageType === "background") {
      setBackground(previewImage);
    } else if (imageType === "avatar") {
      setAvatar(previewImage);
    }
    closeModal();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Set loading state to true when submitting
  
    const data = {
      id: user.id,
      username: user.username,
      avatar: avatar,
      background: background,
    };
  
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${API_URL}/update-profile/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
  
      // Update the user profile in the localStorage after successful profile update
      const updatedUser = {
        ...user,
        profile_picture: avatar,
        wallpaper: background,
      };
      localStorage.setItem("user_profile", JSON.stringify(updatedUser));
  
      setSnackbarMessage("Profile updated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true); // Open the Snackbar
  
      // Delay navigation to allow Snackbar to display
      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setSnackbarMessage("Error updating profile. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true); // Open the Snackbar
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };
  
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
    navigate("/home"); // Navigate to the profile page when the Snackbar is closed
  };
  

  const handleCancel = () => {
    navigate("/home");
  };

  if (error) {
    return <div>{error}</div>;
  }

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <section style={{ minHeight: "100vh", paddingTop: "80px" }}>
      <Container style={{ maxWidth: "600px", padding: "20px" }}>
        <h2 style={{ marginBottom: "20px", color: "whitesmoke" }}>Edit Profile</h2>

        {/* Cover Photo Section */}
        <div style={{ position: "relative", marginBottom: "1px" }}>
          <div
            style={{
              width: "100%",
              height: "140px",
              backgroundImage: `url(${background})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "8px",
            }}
          >
            <IconButton
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "white",
              }}
              onClick={() => openModal("background")}
            >
              <MdEdit />
            </IconButton>
          </div>
          <Avatar
            sx={{
              position: "absolute",
              bottom: "-60px",
              left: "30px",
              height: "120px",
              width: "120px",
              border: "5px solid #121317",
              bgcolor: "#1a76d2",
              fontSize: "40px",
              zIndex: "2",
              backgroundImage: `url(${avatar})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <IconButton
              style={{
                position: "absolute",
                bottom: "0",
                right: "10px",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "white",
              }}
              onClick={() => openModal("avatar")}
            >
              <MdEdit />
            </IconButton>
          </Avatar>
        </div>

        {/* Form Section */}
        <Card
          style={{
            marginTop: "50px",
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: "#121317",
            color: "whitesmoke",
          }}
        >
          <form onSubmit={handleSubmit}>
            <ThemeProvider theme={darkTheme}>
              <Box sx={{ marginBottom: "10px", textAlign: "left" }}>
                <TextField
                  label="Your Name"
                  variant="outlined"
                  fullWidth
                  name="username"
                  placeholder="Enter your username"
                  required
                  value={user?.username || ""}
                  sx={{ marginTop: 2 }}
                  onChange={(e) => setUser({ ...user, username: e.target.value })}
                  helperText="You can change it multiple times"
                />
              </Box>


            {/* <Row>
              <Col lg="6" sm="6" xs="6" style={{textAlign:'left', paddingLeft:'18px'}}>
                Hide Profile
                </Col>
                <Col lg="6" sm="6" xs="6" style={{textAlign:'right'}}>
                  <Switch
                    checked={checked}
                    onChange={handleChange}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </Col>
            </Row> */}
              

              <Box sx={{ margin: "auto", paddingTop:'15px' }}>
                {isLoading ? (
                  <Button disabled className="search-button" style={{ marginRight: "20px" }}>
                    <Spinner animation="border" size="sm" style={{fontSize:"15px"}} /> Saving...
                  </Button>
                ) : (
                  <Button type="submit" className="search-button" style={{ marginRight: "20px" }}>
                    Save Changes
                  </Button>
                )}
                <Button className="cancel-button" onClick={handleCancel}>
                  Cancel
                </Button>
              </Box>
            </ThemeProvider>
          </form>
        </Card>

        {/* Wallpaper and Avatar Selection Modal */}
        <Modal show={showModal} onHide={closeModal} centered style={{}}>
          <Modal.Header closeButton closeVariant='white' style={{backgroundColor:'#121317',borderBottom:'black'}}>
            <Modal.Title style={{color:'whitesmoke'}}>Change {imageType}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{backgroundColor:'#121317e4', maxHeight:'450px', overflow: 'hidden', overflowY: 'auto'}}>
            <Row>
              {(imageType === "background" ? wallpapers : avatars).map((image, index) => (
                <div
                  key={index}
                  style={{
                    display: "inline-block",
                    margin: "auto",
                    cursor: "pointer",
                    width: imageType === "background" ? "100%" : "50%",
                    marginBottom: "10px",
                  }}
                  onClick={() =>
                    imageType === "background"
                      ? handleWallpaperSelect(image)
                      : handleAvatarSelect(image)
                  }
                >
                  {imageType === "background" ? (
                    <img
                      src={image}
                      alt={`${imageType} ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "130px",
                        objectFit: "cover",
                        border:
                          previewImage === image
                            ? "3px solid #70cef0"
                            : "3px solid transparent",
                        borderRadius: "8px",
                      }}
                      className={previewImage === image ? "" : "selectImage"}
                    />
                  ) : (
                    <img
                      src={image}
                      alt={`${imageType} ${index + 1}`}
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                        marginLeft:'25px',
                        border:
                          previewImage === image
                            ? "4px solid #70cef0"
                            : "4px solid transparent",
                        borderRadius: "50%",
                      }}
                      className={previewImage === image ? "" : "selectImage"}
                    />
                  )}
                </div>
              ))}
            </Row>
          </Modal.Body>
          <Modal.Footer style={{backgroundColor:'#121317',borderTop:'black'}}>
            <Button className="cancel-button" onClick={closeModal}>
              Cancel
            </Button>
            <Button onClick={saveImage} className="search-button">
              Change
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>

      <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
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

export default EditProfile;
