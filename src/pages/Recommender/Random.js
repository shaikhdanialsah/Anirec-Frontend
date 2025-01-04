import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Dropdown, Spinner, Modal } from "react-bootstrap";
import { AnimationControl } from "../../components/AnimationControl";
import { FaShuffle } from "react-icons/fa6";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { FaCheck } from "react-icons/fa";
import { IoArrowForward, IoInformationCircle } from "react-icons/io5";
import { Snackbar, Alert } from '@mui/material';

function Random() {
  const [selectedGenre, setSelectedGenre] = useState("All Genre");
  const [randomAnime, setRandomAnime] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(false); // State to track loading status
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false); 
  const handleHelpModalOpen = () => setShowHelpModal(true);
  const handleHelpModalClose = () => setShowHelpModal(false);

  // API name
  const API_URL = process.env.REACT_APP_API_URL;

  const { ref } = AnimationControl();

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    setRandomAnime(null); // Reset random anime when genre is changed
  };

  const generateRandomAnime = () => {
    setLoading(true); // Set loading to true when fetching starts
    fetch(`${API_URL}/random?genre=${selectedGenre}`)
      .then(response => response.json())
      .then(data => {
        setRandomAnime(data.anime);
        setLoading(false); // Set loading to false when fetching is done
      })
      .catch(error => {
        console.error('Error fetching random anime:', error);
        setLoading(false); // Loading stop when there is an error
        setSnackbarMessage('Error conecting to the server!');
        setSnackbarOpen(true);
      });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
};

console.log(randomAnime);

  return (
    <Container>
        <Row
        className="justify-content-center"
        style={{ width: windowWidth < 992 ? "100%" : "80%", margin: 'auto' }}
      >
         {/* Help Modal */}
    <Modal show={showHelpModal} onHide={handleHelpModalClose} centered>
    <Modal.Header closeButton>
        <Modal.Title>Help - How to Use</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <p><strong>To get random anime recommendations:</strong></p>
        <ol>
            <li>Select genre from the genre list</li>
            <li>Click on the <strong>"Generate random anime"</strong> button to get your results.</li>
            <li>View the results or or click <strong>"View Anime"</strong> to view details of the anime</li>
        </ol>
    </Modal.Body>
    <Modal.Footer>
        <Button  className="search-button" onClick={handleHelpModalClose}>Close</Button>
    </Modal.Footer>
</Modal>

    <Button
        variant="info"
        style={{ marginTop: '10px', alignItems: 'center', marginBottom:'10px', backgroundColor:'transparent', borderColor:'transparent',color:'rgb(190, 188, 188)' }}
        onClick={handleHelpModalOpen}
    >
        <IoInformationCircle size="20px" style={{ marginRight: '10px' }} />
        How to use Random Generator
    </Button>
        <Col xs={12} md={5} className="mb-3">
          <Form.Group controlId="genreSelect">
            <Dropdown>
              <Dropdown.Toggle variant="success" id="dropdown-basic" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', color: 'black' }}>
                <span>{selectedGenre}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ width: '100%', maxHeight: '145px', overflowY: 'auto' }}>
                {["All Genre", "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Gourmet", "Mystery", "Romance", "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Suspense"].map((genre) => (
                  <Dropdown.Item
                    key={genre}
                    onClick={() => handleGenreChange(genre)}
                    className={selectedGenre === genre ? "genre-item-selector-active" : "genre-item-selector"}
                  >
                    {genre} {selectedGenre === genre && <FaCheck />}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>
        </Col>
        <Col xs={12} md={6} className="mb-3">
          <Button
            onClick={generateRandomAnime}
            variant="primary"
            className="search-button"
            style={{ borderRadius: "6px", width: '100%' }}
            disabled={loading} // Disable the button when loading
          >
            {loading ? (
              <>
                Generating...
              </>
            ) : (
              <>
                Generate random anime <FaShuffle />
              </>
            )}
          </Button>
        </Col>
        <Col xs={12} md={11} className="mb-3">
          <Card style={{ minHeight: '420px', backgroundColor: 'rgba(20, 20, 20, 0.511)', border: '1px solid white' }}>
            <Card.Body style={{ padding: '20px'}} className='font-color'>
              {loading ? (
                <>
                   <div className="loading-spinner" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color:'#75cff0' }}>
                    <Spinner animation="border" style={{ width: '3rem', height: '3rem' }} />
                    </div>
                </>
              ) : randomAnime ? (
                <>
                  <div style={{ height: '250px', overflowY: 'hidden', display: 'flex', justifyContent: 'center' }}>
                    <img src={randomAnime['main_picture']} alt={randomAnime.title} style={{ width: '200px' }} />
                  </div>
                  <h6 style={{ paddingTop: '10px' }}>{randomAnime.title}</h6>
                  <p style={{color:'#70cef0'}}>Rating : {(Math.round(randomAnime.score * 100) / 100).toFixed(2)}</p>
                  <Link to={`/anime/${randomAnime.anime_id}`}>
                    <Button style={{ width: '100%', marginTop: '20px' }} className="search-button">
                      View Anime <IoArrowForward className="view-icon"/>
                    </Button>
                  </Link>
                </>
              ) : (
                <div className="icon-container">
                  <GiPerspectiveDiceSixFacesRandom style={{ fontSize: '120px', color: 'grey' }} />
                  <p>Click on the button to generate random anime recommendation.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Snackbar 
          open={snackbarOpen} 
          autoHideDuration={2000} 
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center'}} // Add this line
      >
          <Alert onClose={handleSnackbarClose} variant="filled" severity="error" sx={{ width: '100%' }} style={{fontFamily: 'Quicksand, sans-serif', backgroundColor:'#8B0000'}}>
              {snackbarMessage}
          </Alert>
      </Snackbar>
    </Container>
      
  );
}

export default Random;
