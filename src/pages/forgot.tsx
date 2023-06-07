import Head from "next/head";
import { Roboto } from "next/font/google";
import NavigationModal from "@components/compound/NavigationModal";
import { Box, Container, Divider, Fade } from "@mui/material";
import StyledLink from "@components/styled/StyledLink";
import { grey } from "@mui/material/colors";
import RecoverForm from "@components/compound/RecoverForm";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin-ext"],
});

export default function Forgot() {
  return (
    <>
      <Head>
        <title>SAPS | Account Recovery</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Fade in={true} unmountOnExit>
        <Container>
          <Box
            sx={{
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <RecoverForm />
              <Box
                sx={{
                  marginTop: "12px",
                }}
              >
                <Divider variant="middle" />
                <Box
                  sx={{
                    textAlign: "center",
                    color: grey[500],
                    marginTop: "12px",
                  }}
                >
                  <span style={{ fontSize: "0.8rem" }}>
                    {`Want to go back to login? `}
                    <StyledLink href="/">Click here</StyledLink>
                  </span>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                gap: "24px",
                justifyContent: "center",
                padding: "12px 0",
              }}
            >
              <StyledLink href={"/SAPS_privacy_policy.pdf"} target="_blank">
                Privacy Policy
              </StyledLink>
              <StyledLink href={"/SAPS_terms_of_usage.pdf"} target="_blank">
                Terms of usage
              </StyledLink>
            </Box>
          </Box>
        </Container>
      </Fade>

      <NavigationModal />
    </>
  );
}