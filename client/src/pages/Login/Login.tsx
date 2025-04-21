import { WhatsApp } from "@mui/icons-material";
import { Box, Container, Paper, Typography } from "@mui/material";
import React from "react";
import LoginForm from "../../components/auth/LoginForm";

const LoginPage: React.FC = () => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          minHeight: "100vh",
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            borderRadius: 2,
          }}
        >
          <Box sx={{ mb: 3, textAlign: "center" }}>
            <WhatsApp
              sx={{
                fontSize: 48,
                mb: 1,
              }}
            />
            <Typography
              component="h1"
              variant="h4"
              sx={{
                fontWeight: "bold",
                mb: 1,
              }}
            >
              Chat App
            </Typography>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Sign in
            </Typography>
          </Box>
          <LoginForm />
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
