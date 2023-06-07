import Head from "next/head";
import Image from "next/image";
import { Roboto } from "next/font/google";
import logo from "../../public/logo-abertura.svg";
import NavigationModal from "@components/compound/NavigationModal";
import Map from "@components/simple/Map";
import { Box, Container, Fade } from "@mui/material";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin-ext"],
});

export default function Home() {
  return (
    <>
      <Head>
        <title>SAPS | Data</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavigationModal />

      <main className={roboto.className}>
        <Fade in={true} unmountOnExit>
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
                minHeight: "64px",
                width: "100%",
                maxHeight: "64px",
                padding: "4px 0",
                backgroundColor: "primary.main",
                display: "flex",
                justifyContent: "center",
              }}
              color="primary"
            >
              <Image
                src={logo}
                alt="Logo"
                style={{
                  objectFit: "contain",
                  height: "100%",
                  marginBottom: "24px",
                }}
              />
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                width: "100%",
              }}
            >
              <Box
                sx={{
                  height: "100%",
                }}
              >
                <Map />
              </Box>
            </Box>
          </Box>
        </Fade>
      </main>
    </>
  );
}