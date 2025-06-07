import { createTheme } from "@mui/material";

// Light theme configuration
const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0077b6",
      light: "#339FCD",
      dark: "#005577",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#90e0ef",
      light: "#b3e8f3",
      dark: "#6bb6cc",
      contrastText: "#000000",
    },
    error: {
      main: "#d61321",
      light: "#e04250",
      dark: "#a30e17",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f8fbff", // Very light blue-tinted background
      paper: "#ffffff", // Pure white for cards/surfaces
    },
    text: {
      primary: "#1a1a1a",
      secondary: "#666666",
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        size: "small",
      },
    },
    MuiButtonGroup: {
      defaultProps: {
        size: "small",
      },
    },
    MuiCheckbox: {
      defaultProps: {
        size: "small",
      },
    },
    MuiFab: {
      defaultProps: {
        size: "small",
      },
    },
    MuiFormControl: {
      defaultProps: {
        margin: "dense",
        size: "small",
      },
    },
    MuiFormHelperText: {
      defaultProps: {
        margin: "dense",
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: "small",
      },
    },
    MuiInputBase: {
      defaultProps: {
        margin: "dense",
      },
    },
    MuiInputLabel: {
      defaultProps: {
        margin: "dense",
      },
    },
    MuiRadio: {
      defaultProps: {
        size: "small",
      },
    },
    MuiSwitch: {
      defaultProps: {
        size: "small",
      },
    },
    MuiTextField: {
      defaultProps: {
        margin: "dense",
        size: "small",
      },
    },
  },
});

// Dark theme configuration
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#0096cc", // Slightly lighter blue for dark mode
      light: "#33a9d6",
      dark: "#006b99",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#4fd3ed", // More vibrant cyan for dark mode
      light: "#7ddcf0",
      dark: "#38a3ba",
      contrastText: "#000000",
    },
    error: {
      main: "#ff4757", // Softer red for dark mode
      light: "#ff6b7a",
      dark: "#cc3644",
      contrastText: "#ffffff",
    },
    background: {
      default: "#0a0e13", // Very dark blue-black
      paper: "#1a252f", // Dark blue-gray for surfaces
    },
    text: {
      primary: "#e8f4f8",
      secondary: "#a8c5d1",
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        size: "small",
      },
    },
    MuiButtonGroup: {
      defaultProps: {
        size: "small",
      },
    },
    MuiCheckbox: {
      defaultProps: {
        size: "small",
      },
    },
    MuiFab: {
      defaultProps: {
        size: "small",
      },
    },
    MuiFormControl: {
      defaultProps: {
        margin: "dense",
        size: "small",
      },
    },
    MuiFormHelperText: {
      defaultProps: {
        margin: "dense",
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: "small",
      },
    },
    MuiInputBase: {
      defaultProps: {
        margin: "dense",
      },
    },
    MuiInputLabel: {
      defaultProps: {
        margin: "dense",
      },
    },
    MuiRadio: {
      defaultProps: {
        size: "small",
      },
    },
    MuiSwitch: {
      defaultProps: {
        size: "small",
      },
    },
    MuiTextField: {
      defaultProps: {
        margin: "dense",
        size: "small",
      },
    },
  },
});

// Function to create theme based on mode
export const createAppTheme = (mode = "light") => {
  return mode === "dark" ? darkTheme : lightTheme;
};

// Export both themes
export { lightTheme, darkTheme };

// Default export (light theme for backward compatibility)
export default lightTheme;
