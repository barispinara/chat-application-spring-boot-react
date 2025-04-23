import { Backdrop, CircularProgress } from "@mui/material";
import React from "react";

interface LoadingOverlayProps {
  loading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ loading }) => {
  return (
    <Backdrop
      open={loading}
      sx={{
        zIndex: 999,
        color: "#fff",
        backdropFilter: "blur(2px)",
        backgroundColor: "rgba(0,0,0,0.4)",
      }}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default LoadingOverlay;
