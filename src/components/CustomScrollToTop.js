// CustomScrollToTop.js

import React, { useEffect } from 'react';
import ScrollToTop from 'react-scroll-to-top';
import { FaArrowUp } from 'react-icons/fa';
import { useLocation } from "react-router-dom";

const CustomScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
      <ScrollToTop
        smooth={true}
        duration={500}
        // spy={true}
        component={
          <div style={styles.container}>
            <FaArrowUp style={styles.icon} />
          </div>
        }
        style={styles.button}
      />
   
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: '25px',
    animation:'bounce_up 1.2s infinite'
  },
  button: {
    backgroundColor: '#61dafb',
    padding: '10px',
    position: 'fixed',
    width:'auto',
    height:'auto',
  },
};

export default CustomScrollToTop;