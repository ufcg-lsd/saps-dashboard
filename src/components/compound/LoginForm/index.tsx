import {
  Box,
  Button,
  Divider,
  Fade,
  InputAdornment,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import StyledLink from "@components/styled/StyledLink";
import { useState } from "react";
import { login } from "@src/services/auth";
import { useRouter } from "next/router";

const LoginForm = () => {
  const router = useRouter();

  async function handleSubmit(
    email: string,
    passwd: string
  ) {
    const result = await login(email, passwd);
    if (result) router.push("/processing") }
  
  const [loginType, setLoginType] = useState("regular");
  const leftDiffLoginType = loginType === "regular" ? 0 : -100;
  const [email, setEmail] = useState(""); 
  const [passwd, setPasswd] = useState("");
  console.log(login, passwd); 

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
            transform: `translateX(${leftDiffLoginType * 1.1}%)`,
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
            onChange={(e) => {
              setEmail(e.target.value)}}

            value={email}
            id="outlined-basic"
            size="small"
            label="Email"
            variant="outlined"
            type=""
          />
          <TextField
          onChange={(e) => {
            setPasswd(e.target.value)}}
            value={passwd}
            id="outlined-basic"
            size="small"
            label="Password"
            variant="outlined"
            type="password"
          />
          <Button variant="contained" onClick={()=> {handleSubmit(email,passwd)}}>Enter</Button>
          
        </Box>
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


