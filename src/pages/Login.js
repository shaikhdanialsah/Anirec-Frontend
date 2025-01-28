import React, { useState} from "react";
import {Modal, Form} from "react-bootstrap";
import { Container,Tabs,Tab,Button,TextField, Box, CssBaseline, Card,Checkbox, FormControlLabel, InputAdornment, Alert, Snackbar, CircularProgress} from '@mui/material';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PasswordStrengthBar from "react-password-strength-bar";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Terms from "./Terms";

// API name
const API_URL = process.env.REACT_APP_API_URL;

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

function Login() {
  const [activeTab, setActiveTab] = useState(0);
  const [loginFields, setLoginFields] = useState({ email: "", password: "" });
  const [registerFields, setRegisterFields] = useState({
    name: "",
    emailRegister: "",
    passwordRegister: "",
    agreed: false,
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  // Modal
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
   // Snackbar
   const [snackbarOpen, setSnackbarOpen] = useState(false);
   const [snackbarMessage, setSnackbarMessage] = useState("");
   const [snackbarSeverity, setSnackbarSeverity] = useState("error");

   const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
 
   // Loading states
   const [isLoadingLogin, setIsLoadingLogin] = useState(false);
   const [isLoadingRegister, setIsLoadingRegister] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginFields((prev) => ({
      ...prev,
      [name]: value.replace(/\s+/g, ""), // No spaces
    }));
  };

  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target;
    const filteredValue =
      name === "name" ? value.replace(/[^a-zA-Z\s]/g, "") : value.replace(/\s+/g, "");
    setRegisterFields((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : filteredValue,
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoadingLogin(true);

    try {
      console.log("Login request payload:", loginFields);
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginFields),
      });
      setIsLoadingLogin(false);
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("access_token", data.access_token);
        setSuccessMessage("Login successful!");
        setSnackbarSeverity("success");
        setSnackbarMessage("Login successful!");
        setSnackbarOpen(true);
        window.location.href = '/home';
      } else {
        setErrorMessage("Invalid email or password.");
        setSnackbarSeverity("error");
        setSnackbarMessage("Invalid email or password.");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setIsLoadingLogin(false);
      setErrorMessage("Error connecting to server.");
      setSnackbarSeverity("error");
      setSnackbarMessage("Error connecting to server.");
      setSnackbarOpen(true);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoadingRegister(true);

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerFields.name,
          email: registerFields.emailRegister,
          password: registerFields.passwordRegister,
        }),
      });
      setIsLoadingRegister(false);
      if (response.ok) {
        setSuccessMessage("Registration successful!");
        setSnackbarSeverity("success");
        setSnackbarMessage("Registration successful!");
        setSnackbarOpen(true);
        setTimeout(() => {
          window.location.href = '/login';
        }, 200); 
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Registration failed.");
        setSnackbarSeverity("error");
        setSnackbarMessage(errorData.error || "Registration failed.");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setIsLoadingRegister(false);
      setErrorMessage("Error connecting to server.");
      setSnackbarSeverity("error");
      setSnackbarMessage("Error connecting to server.");
      setSnackbarOpen(true);
    }
  };


  const isLoginDisabled = !loginFields.email || !loginFields.password;
  const isRegisterDisabled =
    !registerFields.name ||
    !registerFields.emailRegister ||
    !registerFields.passwordRegister ||
    !registerFields.agreed ||
    passwordStrength < 2;

  return (
    <section fluid className='login-section' >
       <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container sx={{ paddingBottom: "60px" }}>
        <Container maxWidth="sm" sx={{ mt: 5, display: "flex", flexDirection: "column", paddingTop: "75px" }}>
          <h2 style={{ color: "#FFF5EE" }}>{activeTab === 0 ? "Welcome back!" : "Greetings new user!"}</h2>
          <br />
          <Card
            sx={{
              paddingLeft: "15px",
              paddingRight: "15px",
              paddingTop: "30px",
              paddingBottom: "40px",
              backgroundColor: "#1213178d",
              borderRadius: "15px",
              backdropFilter: "blur(150px)",
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
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
              }}
            >
              <Tab label="Login" />
              <Tab label="Register" />
            </Tabs>

            {activeTab === 0 && (
              <Box component="form" onSubmit={handleLoginSubmit}>
                <TextField
                  fullWidth
                  label="Email address"
                  margin="normal"
                  type="email"
                  name="email"
                  placeholder="e.g: youremail@gmail.com"
                  value={loginFields.email}
                  onChange={handleLoginChange}
                />
                <TextField
                  fullWidth
                  label="Password"
                  margin="normal"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={loginFields.password}
                  onChange={handleLoginChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          onClick={togglePasswordVisibility}
                          sx={{ minWidth: 0, padding: 0 }}
                        >
                          {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                  style={{paddingBottom:'5px'}}
                />

                <Button variant="contained" fullWidth type="submit" disabled={isLoginDisabled} style={isLoadingLogin ?{ backgroundColor :'grey'} : {}}>
                  {isLoadingLogin ? <CircularProgress size={24} color="inherit" /> : "Log In"}
                </Button>

                
              </Box>
            )}

            {activeTab === 1 && (
              <Box component="form" onSubmit={handleRegisterSubmit}>
                <TextField
                  fullWidth
                  label="Name*"
                  margin="normal"
                  name="name"
                  placeholder="e.g: Ali bin Abu"
                  value={registerFields.name}
                  onChange={handleRegisterChange}
                />
                <TextField
                  fullWidth
                  label="Email*"
                  margin="normal"
                  type="email"
                  name="emailRegister"
                  placeholder="e.g: youremail@gmail.com"
                  value={registerFields.emailRegister}
                  onChange={handleRegisterChange}
                />
                <TextField
                  fullWidth
                  label="Password*"
                  margin="normal"
                  type={showPassword ? "text" : "password"}
                  name="passwordRegister"
                  value={registerFields.passwordRegister}
                  onChange={handleRegisterChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          onClick={togglePasswordVisibility}
                          sx={{ minWidth: 0, padding: 0 }}
                        >
                          {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
                <PasswordStrengthBar
                  password={registerFields.passwordRegister}
                  onChangeScore={setPasswordStrength}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="agreed"
                      checked={registerFields.agreed}
                      onChange={handleRegisterChange}
                    />
                  }
                  label={
                    <div style={{ fontSize: '14px', textAlign: 'justify', color: '#D3D3D3' }}>
                      By creating an account, I confirm that I have read the <a className="purple" style={{backgroundColor:'transparent', border:'none'}} onClick={handleShow}>terms and agreement</a> and I am at least 18 years of age
                    </div>
                  }
                  style={{paddingBottom:'20px'}}
                />
                <Button
                  variant="contained"
                  fullWidth
                  type="submit"
                  disabled={isRegisterDisabled}
                  style={isLoadingRegister ?{ backgroundColor :'grey'} : {}}
                >
                 {isLoadingRegister ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
                </Button>
              </Box>
            )}

          <Modal show={show} onHide={handleClose} size="xl">
            <Modal.Header closeButton closeVariant='white' style={{backgroundColor:'#121317',borderBottom:'black'}}>
                <Modal.Title style={{color:'whitesmoke'}}>Terms and Agreement for Anirec+</Modal.Title>
              </Modal.Header>
              <Modal.Body style={{backgroundColor:'#121317e4', maxHeight:'450px', overflow: 'hidden', overflowY: 'auto'}}>
              <Terms />
              </Modal.Body>
              <Modal.Footer style={{backgroundColor:'#121317',borderTop:'black'}}>
                <Button style={{textTransform:'none', color:'white'}} onClick={handleClose} className="search-button">
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </Card>

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
            sx={snackbarSeverity == 'success' ?{ width: "100%", color:'black', bgcolor:'#70cef0', } : {width:'100%', backgroundColor:'#8B0000'}}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        </Container>
      </Container>
    </ThemeProvider>
    </section>
   
  );
}

export default Login;
