import React, { useState } from "react";
import {
  Box,
  Button,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";

const RegisterForm = () => {
  const [isSuccess, setIsSuccess] = useState(null);
  const [response, setResponse] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userNotify: "",
  });

  const authEndpoint = 'http://10.11.19.229:8091/users?register';

  const handleSubmit = async (event) => {
    event.preventDefault();

    // 2. Converta formData em uma string URL-encoded
    const formattedData = 
    `userName=${encodeURIComponent(formData.name)}&` + // Modificado para userName
    `userEmail=${encodeURIComponent(formData.email)}&` + // Modificado para userEmail
    `userPass=${encodeURIComponent(formData.password)}&` + // Modificado para userPass
    `userPassConfirm=${encodeURIComponent(formData.confirmPassword)}&` +
    `userNotify=${encodeURIComponent("")}`;


    console.log("formData:", formData);
    console.log("formattedData:", formattedData);



    try {
      const response = await axios.post(authEndpoint, formattedData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
      },
      });

      if (response.status === 200) {
        setResponse("Registration successful");
        setIsSuccess(true);
      } 
    } catch (error) {
      console.error("Erro ao enviar solicitação:", error);
      setResponse("Registration Unsuccessful");
      setIsSuccess(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        position: "relative",
        overflow: "hidden",
        padding: "6px",
        marginTop: "50px",
      }}
    >
      <Typography
        variant="h1"
        color="primary"
        sx={{
          fontSize: "1.2rem",
          fontWeight: "bold",
        }}
      >
        Register
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          fontSize: "0.8rem",
          fontWeight: "200",
          maxWidth: "217px",
        }}
      >
        {`Once you have completed the registration process, you will have access to all the features offered by SAPS.`}
      </Typography>
      <Divider />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          position: "relative",
        }}
      >
        <TextField
          id="outlined-basic"
          size="small"
          label="Name"
          variant="outlined"
          name="name"
          onChange={handleChange}
        />
        <TextField
          id="outlined-basic"
          size="small"
          label="Email"
          variant="outlined"
          name="email"
          onChange={handleChange}
        />
        <TextField
          id="outlined-basic"
          size="small"
          label="Password"
          variant="outlined"
          type="password"
          name="password"
          onChange={handleChange}
        />

        <TextField
          id="outlined-basic"
          size="small"
          label="Confirm Password"
          variant="outlined"
          type="password"
          name="confirmPassword"
          onChange={handleChange}
        />
        <Button variant="contained" onClick={handleSubmit}>
          Create Account
        </Button>
        
        {response && (
          <Box
            sx={{
              padding: "6px",
              backgroundColor: isSuccess ? "#59FF59" : "#FF5959", 
              color: "white", 
              textAlign: "center",
              borderRadius: "4px",
              marginTop: "10px", 
            }}
          >
            <Typography>{response}</Typography>
          </Box>
        )}

      </Box>
    </Box>
  );
};

export default RegisterForm;
