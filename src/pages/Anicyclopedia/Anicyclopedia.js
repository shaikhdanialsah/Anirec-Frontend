import React, {useState} from "react";
import { Container, Row, Col, Modal, Button, Form, ListGroup} from "react-bootstrap";
import { IoHome } from "react-icons/io5";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AnicyclopediaContent from "./AnicyclopediaContent";
import { AnimationControl, zoomIn} from "../../components/AnimationControl";
import { CgBrowse } from "react-icons/cg";
import { getDeviceType } from '../../components/deviceCheck';
import animeData from '../../anime_data.json';
import { FaStar } from "react-icons/fa";

function Anicyclopedia() {

  const { ref, controls } = AnimationControl();
  const deviceType = getDeviceType();
  const [showSearchModal, setShowSearchModal] = useState(false); 
  const handleSearchModalOpen = () => setShowSearchModal(true);
  const handleSearchModalClose = () => setShowSearchModal(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showClear, setShowClear] = useState(false);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setShowClear(query.length > 0); // Show clear button if there's text
  
    if (query) {
      // Normalize the search query by removing special characters but keep spaces and capital letters
      const normalizedQuery = query.replace(/:/g, '').toLowerCase().trim();
  
      // Split the query into individual words
      const queryWords = normalizedQuery.split(/\s+/);
  
      // Separate exact matches and partial matches
      const exactMatches = [];
      const partialMatches = [];
  
      const filteredSuggestions = animeData.filter(anime => {
        // Normalize each title by removing colons and converting to lowercase for comparison
        const normalizedTitle = anime.title.replace(/:/g, '').toLowerCase().trim();
  
        // Check for exact match
        if (normalizedTitle === normalizedQuery) {
          exactMatches.push(anime);
          return false; // Skip this anime from partial matches to avoid duplication
        } 
  
        // Check for partial match
        if (queryWords.every(word => normalizedTitle.includes(word))) {
          partialMatches.push(anime);
        }
  
        return false; // Skip this anime as we handle it manually later
      });
  
      // Combine exact matches and partial matches, prioritizing exact matches
      const combinedSuggestions = [...exactMatches, ...partialMatches];
  
      if (combinedSuggestions.length > 0) {
        setSuggestions(combinedSuggestions.slice(0, 5)); // Limit to the first 5 suggestions
      } else {
        setSuggestions([{ title: 'No results found' }]); // Set a message indicating no results were found
      }
    } else {
      setSuggestions([]);
    }
  };
  

  const handleClear = () => {
    setSearchQuery('');
    setSuggestions([]);
    setShowClear(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    console.log("Search submitted:", searchQuery);
    // Add your form submission logic here, such as making an API call
  };


  return (
    <section style={{minHeight:'100vh'}}>
      <Container fluid className="anicyclopedia-section" ref={ref}>
      <Container>
        <Row style={{ justifyContent: "center", paddingBottom: "10px",padding:"10px" }}>
        <div style={{ textAlign: "left", color:'aliceblue' }}>
              <Link to="/" className="back-home-link"><IoHome />{deviceType==="Desktop"&&(<span>&nbsp;&nbsp; Home&nbsp;</span>)}</Link>
              &nbsp;&gt;<span className="grey"> &nbsp;Browse</span>
        </div>
        <Col
            md={12}
            style={{
              justifyContent: "center",
              paddingTop: "10px",
              paddingBottom:'25px',
              width:'auto'
            }}
          >
            <motion.h2 style={{ paddingTop: "15px", paddingBottom:'15px'}}
            initial="hidden"
            animate={controls}
            variants={zoomIn}
            >
              <strong><span className="font-color"><CgBrowse /> Browse Anime</span></strong>
            </motion.h2>

            {deviceType == 'Desktop' ? 
            (<button style={{borderRadius:'30px', textAlign:'left', minWidth:'450px',padding:'10px 20px', backgroundColor:'whitesmoke', border:'none'}} onClick={handleSearchModalOpen}>Search Anime...</button>) :
            (<button style={{borderRadius:'30px', textAlign:'left', width:'80vw',padding:'10px 20px', backgroundColor:'whitesmoke', border:'none'}} onClick={handleSearchModalOpen}>Search Anime...</button>)
            }
            
          </Col>
        </Row>
      </Container>
    </Container>
    <div id="home-features-section">
      <AnicyclopediaContent />
    </div>


    <Modal show={showSearchModal} onHide={handleSearchModalClose} size="xl">
      <Modal.Header closeButton closeVariant='white' style={{backgroundColor:'#121317',borderBottom:'black'}}>
        <Modal.Title style={{color:'whitesmoke'}}>Search Anime</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{backgroundColor:'#121317e4', minHeight:'300px'}}>
      <Form onSubmit={(e) => handleFormSubmit(e)}>
  <Form.Group controlId="searchInput" className="d-flex align-items-center">
    <Form.Control
      type="text"
      placeholder="Search for anime..."
      value={searchQuery}
      onChange={(e) => handleSearchChange(e.target.value)}
      className="me-2 flex-grow-1"
      autoComplete="off"
    />
    {showClear && (
      <Button
        className="search-button"
        onClick={handleClear}
        style={{ whiteSpace: "nowrap" }}
      >
        Clear
      </Button>
    )}
  </Form.Group>
      </Form>

        <ListGroup className="mt-3" style={{}}>
          {suggestions.map((anime, index) => (
            <ListGroup.Item key={index} style={{border:'none'}} className="search-list">
                <Link to={anime.title != "No results found" ? `/anime/${anime.anime_id}` : ''} className="link-item">
                  <Row>
                  <Col lg={1} xs={3}><img src={anime.main_picture} style={{maxWidth:'60px'}}/></Col>
                  <Col lg={11} xs={9}>
                    <Row style={{fontWeight:'bold'}} className="search-title"><p>{anime.title}</p></Row>
                    <Row className="search-rate">
                      <p>{anime.title !== "No results found" ? (
                        <><FaStar /> {anime.score?.toFixed(2)}</>) : (""
                        )}
                      </p>
                    </Row>
                  </Col>
                  </Row>
                </Link>
              
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      {/* <Modal.Footer style={{backgroundColor:'#121317',borderTop:'black'}}>
        <Button className="search-button" onClick={handleSearchModalClose}>
          Close
        </Button>
      </Modal.Footer> */}
    </Modal>

    </section>
  );
}

export default Anicyclopedia;
