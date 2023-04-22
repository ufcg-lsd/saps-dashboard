import { Button, Fab } from "@mui/material";
import NavigationIcon from "@mui/icons-material/Navigation";
import { Menu } from "@mui/icons-material";

interface Params {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

const NavigationButton = ({ onClick }: Params) => {
  return (
    <Button disableElevation variant="contained" onClick={onClick}>
      <Menu sx={{ mr: 1 }} />
      Menu
    </Button>
  );
};

export default NavigationButton;
