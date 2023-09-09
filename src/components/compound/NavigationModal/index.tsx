import NavigationButton from "@components/simple/NavigationButton";
import { Box, Menu, MenuItem } from "@mui/material";
import { grey } from "@mui/material/colors";
import StyledMenu from "@components/simple/StyledMenu";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from '/home/ubuntu/saps-dashboard/src/services/auth/authContext.js';  // Make sure the path is correct

interface RouteInfo {
  route: string;
  icon: JSX.Element;
  action?: () => void;
}

const NavigationModal = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const { setIsAuthenticated } = useAuth();

  const handleLogout = () => {
    setIsAuthenticated(false);
    // If you need any other cleanup upon logging out, you can add it here
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const routes: Record<string, RouteInfo> = {
    Logout: {
      route: "/",
      icon: <></>,
      action: handleLogout
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
              href={value.route}
              onClick={value.action}
              style={{
                textDecoration: "none",
                color: grey[900],
                fontWeight: "bolder",
              }}
            >
              <MenuItem
                onClick={() => {
                  if (value.action) value.action(); 
                  handleClose();
                }}
              >
                {key}
              </MenuItem>
            </Link>
          );
        })}
      </StyledMenu>
    </Box>
  );
};

export default NavigationModal;