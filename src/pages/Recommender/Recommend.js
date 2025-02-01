import React, { useEffect, useState, useRef } from "react";
import { Form, Row, Col, Button, ListGroup, Spinner, Modal, Alert as BootStrapAlert } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { IoSearch, IoInformationCircle } from "react-icons/io5";
import { FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { AnimationControl, zoomIn} from "../../components/AnimationControl";
import { handleSearchChange } from "./search";
import { Snackbar, Alert } from '@mui/material';
import { IoArrowForward } from "react-icons/io5";

function Recommend() {
    const [message, setMessage] = useState(""); 
    const [searchQuery, setSearchQuery] = useState(""); 
    const [isFocused, setIsFocused] = useState(false); 
    const [suggestions, setSuggestions] = useState([]); 
    const [showClear, setShowClear] = useState(false); 
    const [loading, setLoading] = useState(false); // State to track loading status
    const [recommendAnime, setRecommendAnime] = useState(null);
    const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1); 
    const [snackbarOpen, setSnackbarOpen] = useState(false); 
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const searchInputRef = useRef(null);
    const [showHelpModal, setShowHelpModal] = useState(false); 
    const handleHelpModalOpen = () => setShowHelpModal(true);
    const handleHelpModalClose = () => setShowHelpModal(false);

    // API name
  const API_URL = process.env.REACT_APP_API_URL;

    const handleFocus = () => {
        setIsFocused(true);
    };
    
    const handleBlur = () => {
        if (searchQuery === '') {
            setIsFocused(false);
        }
    };

    useEffect(() => {
        console.log("Received recommendAnime data:", recommendAnime);
    }, [recommendAnime]);

    const generateRecommendAnime = () => {
        setLoading(true); // Set loading to true when fetching starts
        fetch(`${API_URL}/recommend?anime=${encodeURIComponent(searchQuery)}`)
          .then(response => response.json())
          .then(data => {
            setRecommendAnime(data.recommended_animes); // Use the correct key
            setLoading(false); // Set loading to false when fetching is done
          })
          .catch(error => {
            console.error('Error fetching recommended anime:', error);
            setLoading(false); // Loading stop when there is an error
            setSnackbarMessage('Error connecting to the server!');
            setSnackbarOpen(true);
          });
    };
    

    const handleSearchChangeWrapper = (event) => {
        handleSearchChange(event.target.value, setSearchQuery, setShowClear, setSuggestions);
        setFocusedSuggestionIndex(-1);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (!searchQuery.trim()) {
            setSnackbarMessage('Search cannot be empty!');
            setSnackbarOpen(true);
            return;
        }
        console.log('Search Query:', searchQuery);
    };

    const handleSuggestionClick = (title) => {
        if(title !== 'No results found') {
            setSearchQuery(title);
            setSuggestions([]);
        }
    };

    const handleClear = () => {
        setSearchQuery('');
        setShowClear(false);
        setSuggestions([]);
        searchInputRef.current.focus();
    };

    const handleKeyDown = (event) => {
        if(suggestions.length > 0 && suggestions[0].title !== "No results found") {
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                setFocusedSuggestionIndex((prevIndex) => {
                    const newIndex = prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex;
                    if (newIndex < suggestions.length) {
                        setSearchQuery(suggestions[newIndex].title);
                    }
                    return newIndex;
                });
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                setFocusedSuggestionIndex((prevIndex) => {
                    const newIndex = prevIndex > 0 ? prevIndex - 1 : prevIndex;
                    if (newIndex >= 0) {
                        setSearchQuery(suggestions[newIndex].title);
                    }
                    return newIndex;
                });
            } else if (event.key === 'Enter') {
                if (focusedSuggestionIndex >= 0 && suggestions.length > 0) {
                    handleSuggestionClick(suggestions[focusedSuggestionIndex].title);
                }
            }
        }
    };

    useEffect(() => {
        if (focusedSuggestionIndex >= 0 && suggestions.length > 0) {
            const suggestionElements = document.querySelectorAll('.suggestion-list-item');
            if (suggestionElements[focusedSuggestionIndex]) {
                suggestionElements[focusedSuggestionIndex].scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
            }
        }
    }, [focusedSuggestionIndex, suggestions]);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const { ref, controls } = AnimationControl();

    return (
        <>
        {/* Help Modal */}
    <Modal show={showHelpModal} onHide={handleHelpModalClose} centered>
    <Modal.Header closeButton closeVariant='white' style={{backgroundColor:'#121317',borderBottom:'black'}}>
        <Modal.Title style={{color:'whitesmoke'}}>Help - How to Use</Modal.Title>
    </Modal.Header>
    <Modal.Body style={{backgroundColor:'#121317e4'}} className="grey">
        <p style={{color:'whitesmoke'}}><strong>To get anime recommendations:</strong></p>
        <ol>
            <li>Type the <strong>name of the anime</strong> in the search box.</li>
            <li>Select a suggestion or press Enter to confirm your search.</li>
            <li>Click on the <strong>"Recommend me"</strong> button to fetch results.</li>
            <li>View the results or navigate to detailed recommendations.</li>
        </ol>
    </Modal.Body>
    <Modal.Footer style={{backgroundColor:'#121317',borderTop:'black'}}>
        <Button className="search-button" onClick={handleHelpModalClose}>Close</Button>
    </Modal.Footer>
</Modal>

    <Button
        variant="info"
        style={{ marginTop: '10px', alignItems: 'center', marginBottom:'10px', backgroundColor:'transparent', borderColor:'transparent',color:'rgb(190, 188, 188)' }}
        onClick={handleHelpModalOpen}
    >
        <IoInformationCircle size="20px" style={{ marginRight: '10px' }} />
        How to use Recommender
    </Button>
    <Form onSubmit={handleSearchSubmit} className="search" ref={ref}>
            <Form.Group controlId="searchQuery" style={{ position: 'relative' }}>
                <div className="search-icon-box">
                    <IoSearch size="20px" style={{color:'white'}} />
                </div>
                <Form.Label
                    style={{
                        marginBottom: '20px',
                        position: 'absolute',
                        left: isFocused || searchQuery ? '10px' : '60px',
                        top: isFocused || searchQuery ? '-20px' : '10px',
                        fontSize: isFocused || searchQuery ? '14px' : '16px',
                        transition: 'all 0.3s ease',
                        color:'white'
                    }}
                >
                    {isFocused || searchQuery ? 'Anime Name' : ''}
                </Form.Label>
                <Form.Control
                    type="text"
                    placeholder={isFocused || searchQuery ? '' : 'Enter anime name'}
                    value={searchQuery}
                    onChange={handleSearchChangeWrapper}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                    style={{ borderRadius: '30px', paddingLeft: '60px', paddingRight: '40px', fontWeight: 'bold', height: '48px', backgroundColor:'rgba(255, 255, 255, 0.91)' }}
                    ref={searchInputRef}
                />
                {showClear && (
                    <FaTimes onClick={handleClear} className="search-clear-button" />
                )}
            </Form.Group>

            <div className="suggestion-list">
                <ListGroup>
                    {suggestions.map((suggestion, index) => (
                        <ListGroup.Item
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion.title)}
                            className={`suggestion-list-item ${index === focusedSuggestionIndex ? 'active' : ''}`}
                        >
                            <Row className="width-ratio" style={{ paddingBottom: '3px' }}>
                                <Col xs={1}>
                                    <IoSearch />
                                </Col>
                                <Col xs={11}>
                                    {suggestion.title}
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </div>

            <motion.div animate={controls} variants={zoomIn}>
                <Button
                    onClick={generateRecommendAnime}
                    variant="primary"
                    type="submit"
                    className="search-button"
                    style={{ borderRadius: "30px", marginTop: '30px', fontSize: '18px',minWidth:'220px' }}
                >
                    Recommend me <IoArrowForward className="view-icon"/>
                </Button>
            </motion.div>

        <br></br>
            {loading ? (
  <div
    className="loading-spinner"
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      color: '#75cff0',
    }}
  >
    <Spinner animation="border" style={{ width: '2rem', height: '2rem' }} />
    <span>&nbsp;&nbsp;Recommending anime</span>
  </div>
) : recommendAnime && Array.isArray(recommendAnime) ? (
    <>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', backgroundColor:'transparent'}}>
            <h6 style={{ color: 'white' }}>{recommendAnime.length} animes found</h6>
        </div>
        <Link to={`/recommended/${encodeURIComponent(searchQuery)}`}>
            <Button style={{ width: '300px', marginTop: '20px' }} className="search-button">
                View All Results <IoArrowForward className="view-icon" />
            </Button>
        </Link>
    </>
  
) : null}

            <Snackbar 
                open={snackbarOpen} 
                autoHideDuration={2000} 
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center'}} 
            >
                <Alert onClose={handleSnackbarClose} variant="filled" severity="error" sx={{ width: '100%' }} style={{fontFamily: 'Quicksand, sans-serif', backgroundColor:'#8B0000'}}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Form>
        </>
        
    );
}

export default Recommend;
