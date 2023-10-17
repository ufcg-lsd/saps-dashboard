import { createTheme } from "@mui/material";
import { amber, teal } from "@mui/material/colors";

export const theme = createTheme({
  palette: {
    primary: {
      main: teal[500],
    },
    secondary: {
      main: amber[500],
    },
  },
});
