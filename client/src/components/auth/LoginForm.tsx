import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useNavigate } from 'react-router-dom';
import { clearError, loginUser } from '../../redux/slices/authSlice';
import { validatePassword, validateUsername } from '../../utils/userValidation';
import { Alert, Box, Button, CircularProgress, TextField, Typography } from '@mui/material';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);
 
  useEffect(() => {
    if (isAuthenticated) navigate('/chat');
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
  }

  return (
    <Box component={"form"} onSubmit={handleSubmit} sx={{ mt: 1}}>
      {error && <Alert severity="error" sx={{ mb: 2}}>{error}</Alert>}

      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        autoComplete="username"
        autoFocus
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        error={!!usernameError}
        helperText={usernameError}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!passwordError}
        helperText={passwordError}
      />

      <Button
        type='submit'
        fullWidth
        variant='contained'
        sx={{
          mt: 3,
          mb: 2,
        }}
        disabled={isLoading}
      >
        {isLoading ? (
          <CircularProgress size={24} color="inherit"/>
        ): (
          'Sign in'
        )}
      </Button>

      <Box sx={{ textAlign: 'center', mt:2}}>
        <Typography variant='body2'>
          Don't have an account?{' '}
          <Typography
            component='span'
            variant='body2'
            sx={{
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' }
            }}
            onClick={() => navigate('/register')}
          >
            Sign Up
          </Typography>
        </Typography>
      </Box>
    </Box>
  )
}

export default LoginForm