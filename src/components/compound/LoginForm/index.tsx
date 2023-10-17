import {
  Box,
  Button,
  Divider,
  Fade,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import StyledLink from "@components/styled/StyledLink";
import { useState } from "react";
import axios from 'axios';
import { useRouter } from "next/router";
import { useAuth } from '@src/services/auth/authContext.js';
import { useEffect } from 'react';
import { loginUser } from '@src/services/auth/index.ts';

const LoginForm = () => {
  const [loginType, setLoginType] = useState("regular");
  const [email, setEmail] = useState("");
  const [passwd, setPasswd] = useState("");

  useEffect(() => {
    localStorage.setItem('email', email);
    localStorage.setItem('passwd', passwd); 
  }, [email, passwd]);

  const router = useRouter();
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  const { setIsAuthenticated } = useAuth();

  const handleLogin = async () => {
    try {
        const response = await loginUser(email, passwd, loginType);

        if (response === 'Success') {
            setIsAuthenticated(true); 
            setShowError(false);
        } 
    } catch (error) {
        setErrorMessage("Invalid email or password."); 
        setShowError(true);
    }
};

  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
      if (isAuthenticated) {
        router.push("/processing");
      }
  }, [isAuthenticated]);
    
  
  return (
    <Fade in={true} unmountOnExit>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          position: "relative",
          overflow: "hidden",
          padding: "0 6px",
        }}
      >
        <ToggleButtonGroup
          color="primary"
          exclusive
          value={loginType}
          onChange={(event, value) => {
            if (!value) return;
            setLoginType(value);
          }}
        >
          <ToggleButton value="regular">Regular</ToggleButton>
          <ToggleButton value="egi">EGI Check-in</ToggleButton>
        </ToggleButtonGroup>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            position: "relative",
            transform: `translateX(${loginType === "egi" ? -110 : 0}%)`, 
            transition: "transform 0.3s ease-in-out",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              left: "110%",
            }}
          >
            <Button variant="contained">Login with EGI</Button>
          </Box>
          <TextField
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            id="outlined-basic"
            size="small"
            label="Email"
            variant="outlined"
          />
          <TextField
            onChange={(e) => setPasswd(e.target.value)}
            value={passwd}
            id="outlined-basic"
            size="small"
            label="Password"
            variant="outlined"
            type="password"
          />
          <Button
            variant="contained"
            onClick={handleLogin}
          >
            Enter
          </Button>
        </Box>

        {showError && (
        <Box
          sx={{
            backgroundColor: "#FFC1C1",  
            color: "black",               
            textAlign: "center",
            marginTop: "12px",
            padding: "8px",
            borderRadius: "4px"
          }}
        >
          {errorMessage}
        </Box>
      )}

        <Box
          sx={{
            textAlign: "center",
            color: grey[500],
          }}
        >
          <span style={{ fontSize: "0.8rem" }}>or</span>
        </Box>
        <StyledLink href="/forgot">Forgot your password?</StyledLink>
        <Divider variant="middle" />
        <Box
          sx={{
            textAlign: "center",
            color: grey[500],
          }}
        >
          <span style={{ fontSize: "0.8rem" }}>
            {`Don't have an account? `}
            <StyledLink href="/register"> Register</StyledLink>
          </span>
        </Box>
      </Box>
    </Fade>
  );
};

export default LoginForm;
