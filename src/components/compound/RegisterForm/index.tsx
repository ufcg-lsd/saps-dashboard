import {
  Box,
  Button,
  Divider,
  Fade,
  TextField,
  Typography,
} from "@mui/material";

const RegisterForm = () => {
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
        />
        <TextField
          id="outlined-basic"
          size="small"
          label="Email"
          variant="outlined"
        />
        <TextField
          id="outlined-basic"
          size="small"
          label="Password"
          variant="outlined"
          type="password"
        />

        <TextField
          id="outlined-basic"
          size="small"
          label="Confirm Password"
          variant="outlined"
          type="password"
        />
        <Button variant="contained">Create Account</Button>
      </Box>
    </Box>
  );
};

export default RegisterForm;
