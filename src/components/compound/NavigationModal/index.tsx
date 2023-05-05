import NavigationButton from "@components/simple/NavigationButton";
import { Box, Menu, MenuItem } from "@mui/material";
import { grey } from "@mui/material/colors";
import StyledMenu from "@components/simple/StyledMenu";
import { useState } from "react";
import Link from "next/link";

const NavigationModal = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const routes = {
    Main: {
      route: "/",
      icon: <></>,
    },
    Register: {
      route: "/register",
      icon: <></>,
    },
    Processing: {
      route: "/processing",
      icon: <></>,
    },
    Data: {
      route: "/data",
      icon: <></>,
    },
  };

  return (
    <Box position="fixed" bottom="4vmin" right="4vmin">
      <NavigationButton onClick={handleClick} />
      <StyledMenu open={openMenu} anchorEl={anchorEl} onClose={handleClose}>
        {Object.entries(routes).map(([key, value]) => {
          return (
            <Link
              key={key}
              href={`${value.route}`}
              style={{
                textDecoration: "none",
                color: grey[900],
                fontWeight: "bolder",
              }}
            >
              <MenuItem>{key}</MenuItem>
            </Link>
          );
        })}
      </StyledMenu>
    </Box>
  );
};

export default NavigationModal;
