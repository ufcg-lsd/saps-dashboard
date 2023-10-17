import {
  Box,
  Button,
  Divider,
  Fade,
  TextField,
  Typography,
} from "@mui/material";

const RecoverForm = () => {
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
        Account Recovery
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
        {`Forgot your login details? Don't worry, we've got you covered. Simply follow the account recovery process.`}
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
          label="Email"
          variant="outlined"
        />
        <Button variant="contained">Recover</Button>
      </Box>
    </Box>
  );
};

export default RecoverForm;
