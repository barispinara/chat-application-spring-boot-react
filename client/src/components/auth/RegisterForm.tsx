import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useNavigate } from 'react-router-dom';
import { clearError, registerUser } from '../../redux/slices/authSlice';
import { validateFirstName, validateLastName, validatePassword, validateUsername } from '../../utils/userValidation';
import { Alert, Box, Button, CircularProgress, TextField } from '@mui/material';

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [firstName, setFirstName] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState('');

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
    const newFirstNameError = validateFirstName(firstName);
    const newLastNameError = validateLastName(lastName);

    setUsernameError(newUsernameError);
    setPasswordError(newPasswordError);
    setFirstNameError(newFirstNameError);
    setLastNameError(newLastNameError);

    return !newUsernameError && !newPasswordError && !newFirstNameError && !newLastNameError;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      dispatch(registerUser({ username, password, firstName, lastName }));
      // TODO: Add navigation to go back to the Login page if register operation was successful
    }
  }

  return (
    <Box component={"form"} onSubmit={handleSubmit} sx={{ mt: 1 }}>
      {error && <Alert severity='error' sx={{ mb: 2 }}>{error}</Alert>}

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
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!passwordError}
        helperText={passwordError}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="firstname"
        label="First Name"
        type="firstname"
        id="firstname"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        error={!!firstNameError}
        helperText={firstNameError}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="lastname"
        label="Last Name"
        type="lastname"
        id="lastname"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        error={!!lastNameError}
        helperText={lastNameError}
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
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Sign in'
        )}
      </Button>
    </Box>
  )
}

export default RegisterForm