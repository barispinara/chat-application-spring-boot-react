import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";
import { clearError, loginUser } from "../../redux/slices/authSlice";
import { validatePassword, validateUsername } from "../../utils/userValidation";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import { Lock, Person, Visibility, VisibilityOff } from "@mui/icons-material";

const LoginForm: React.FC = () => {
  const theme = useTheme();
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isAuthenticated) navigate("/chat");
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const validateForm = () => {
    const newUsernameError = validateUsername(username);
    const newPasswordError = validatePassword(password);

    setUsernameError(newUsernameError);
    setPasswordError(newPasswordError);

    return !newUsernameError && !newPasswordError;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      dispatch(loginUser({ username, password }));
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  }

  return (
    <Box 
      component={"form"} 
      onSubmit={handleSubmit} 
      sx={{ 
        mt: 1,
        animation: "fadeIn 0.5s ease-in",
        "@keyframes fadeIn": {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2,
            borderRadius: 2,
            animation: "shake 0.5s ease-in-out",
            "@keyframes shake": {
              "0%, 100%": { transform: "translateX(0)" },
              "25%": { transform: "translateX(-5px)" },
              "75%": { transform: "translateX(5px)" },
            },
          }}
        >
          {error}
        </Alert>
      )}

      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        autoFocus
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        error={!!usernameError}
        helperText={usernameError}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            transition: "all 0.3s ease",
            "&:hover": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.main,
              },
            },
            "&.Mui-focused": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderWidth: 2,
              },
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person sx={{ 
                color: theme.palette.text.secondary,
                transition: "color 0.3s ease",
                "&:hover": {
                  color: theme.palette.primary.main,
                },
              }} />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type={showPassword ? "text" : "password"}
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!passwordError}
        helperText={passwordError}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            transition: "all 0.3s ease",
            "&:hover": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.main,
              },
            },
            "&.Mui-focused": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderWidth: 2,
              },
            },
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock sx={{ 
                color: theme.palette.text.secondary,
                transition: "color 0.3s ease",
                "&:hover": {
                  color: theme.palette.primary.main,
                },
              }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleTogglePassword}
                edge="end"
                size="small"
                sx={{ 
                  color: theme.palette.text.secondary,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: theme.palette.primary.main,
                    transform: "scale(1.1)",
                  },
                }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{
          mt: 3,
          mb: 2,
          py: 1.5,
          borderRadius: 2,
          textTransform: "none",
          fontSize: "1rem",
          fontWeight: 600,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.dark, 0.8)} 100%)`,
          boxShadow: `0 4px 14px 0 ${alpha(theme.palette.primary.main, 0.4)}`,
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: `0 6px 20px 0 ${alpha(theme.palette.primary.main, 0.6)}`,
          },
          "&:active": {
            transform: "translateY(0)",
          },
        }}
        disabled={isLoading}
      >
        {isLoading ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={20} color="inherit" />
            <span>Signing In...</span>
          </Box>
        ) : (
          "Sign In"
        )}
      </Button>

      <Box 
        sx={{ 
          textAlign: "center", 
          mt: 2,
          opacity: 0.8,
          transition: "opacity 0.3s ease",
          "&:hover": {
            opacity: 1,
          },
        }}
      >
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
          Don't have an account?{" "}
          <Typography
            component="span"
            variant="body2"
            sx={{
              cursor: "pointer",
              color: theme.palette.primary.main,
              fontWeight: 600,
              transition: "all 0.3s ease",
              "&:hover": { 
                color: theme.palette.primary.dark,
                textDecoration: "underline",
              },
            }}
            onClick={() => navigate("/register")}
          >
            Sign Up
          </Typography>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginForm;

