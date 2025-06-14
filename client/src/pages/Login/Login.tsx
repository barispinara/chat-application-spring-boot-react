import { Box, Container, Typography, useTheme, alpha, IconButton } from "@mui/material";
import LoginForm from "../../components/auth/LoginForm";
import { useNavigate } from "react-router-dom";
import { DarkMode, LightMode, Celebration } from "@mui/icons-material";
import { useThemeContext } from "../../context/ThemeContext";
import PulseIcon from "../../components/icons/PulseIcon";

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useThemeContext();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.1
        )} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 50% 50%, ${alpha(
            theme.palette.primary.main,
            0.1
          )} 0%, transparent 50%)`,
          animation: "pulse 8s infinite",
          "@keyframes pulse": {
            "0%": {
              transform: "scale(1)",
              opacity: 0.5,
            },
            "50%": {
              transform: "scale(1.5)",
              opacity: 0.2,
            },
            "100%": {
              transform: "scale(1)",
              opacity: 0.5,
            },
          },
        },
      }}
    >
      <IconButton
        onClick={toggleTheme}
        sx={{
          position: "fixed",
          top: 20,
          right: 20,
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: "blur(8px)",
          "&:hover": {
            backgroundColor: alpha(theme.palette.background.paper, 0.9),
            transform: "scale(1.1)",
          },
          transition: "all 0.3s ease",
          zIndex: 1000,
        }}
      >
        {isDarkMode ? <LightMode /> : <DarkMode />}
      </IconButton>

      <Container
        component="main"
        maxWidth="xs"
        sx={{
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: "blur(8px)",
            padding: 4,
            borderRadius: 4,
            boxShadow: `0 8px 32px 0 ${alpha(
              theme.palette.primary.main,
              0.1
            )}`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: `0 8px 32px 0 ${alpha(
                theme.palette.primary.main,
                0.2
              )}`,
              transform: "translateY(-5px)",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 3,
            }}
          >
            <PulseIcon
              sx={{
                fontSize: 40,
                color: theme.palette.primary.main,
              }}
            />
            <Typography
              component="h1"
              variant="h4"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textAlign: "center",
              }}
            >
              Pulse
            </Typography>
          </Box>

          <Box 
            sx={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: 1, 
              mb: 2,
              animation: "fadeIn 0.5s ease-in",
              "@keyframes fadeIn": {
                "0%": { opacity: 0, transform: "translateY(10px)" },
                "100%": { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 600,
                letterSpacing: "0.5px",
              }}
            >
              Welcome Back
            </Typography>
            <Celebration 
              sx={{ 
                fontSize: 24, 
                color: theme.palette.primary.main,
                animation: "bounce 1s infinite",
                "@keyframes bounce": {
                  "0%, 100%": { transform: "translateY(0)" },
                  "50%": { transform: "translateY(-5px)" },
                },
              }} 
            />
          </Box>

          <Typography
            variant="body1"
            sx={{
              mb: 3,
              color: theme.palette.text.secondary,
              maxWidth: 320,
              mx: "auto",
              lineHeight: 1.6,
              fontSize: "0.95rem",
              textAlign: "center",
            }}
          >
            Sign in to continue your conversations and connect with people around the world
          </Typography>

          <LoginForm />
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
