import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#9c27b0", // Purple
    },
    secondary: {
      main: "#ce93d8", // Light purple
    },
    background: {
      default: "#121212", // Dark background
      paper: "#1e1e1e", // Card background
    },
    text: {
      primary: "#ffffff",
      secondary: "#b39ddb",
    },
  },
});

export default theme;
