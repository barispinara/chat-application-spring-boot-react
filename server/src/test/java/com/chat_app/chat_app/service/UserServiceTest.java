package com.chat_app.chat_app.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.isA;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.chat_app.chat_app.model.Role;
import com.chat_app.chat_app.model.User;
import com.chat_app.chat_app.payload.dto_model.UserDTO;
import com.chat_app.chat_app.payload.request.LoginRequest;
import com.chat_app.chat_app.payload.request.RegisterRequest;
import com.chat_app.chat_app.payload.response.AuthenticationResponse;
import com.chat_app.chat_app.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

  @Mock
  private UserRepository userRepository;

  @Mock
  private JwtService jwtService;

  @Mock
  private PasswordEncoder passwordEncoder;

  @Mock
  private AuthenticationManager authenticationManager;

  @InjectMocks
  private UserService userService;

  static RegisterRequest registerRequest;
  static LoginRequest loginRequest;
  static User dbUser;
  static UserDTO responseUserDTO;

  @BeforeAll
  static void setup() {

    registerRequest = RegisterRequest.builder()
        .username("admin")
        .firstName("admin")
        .lastName("test")
        .password("testasd123")
        .build();

    loginRequest = LoginRequest.builder()
        .username("admin")
        .password("testasd123")
        .build();

    dbUser = User.builder()
        .id(1L)
        .username("admin")
        .firstName("admin")
        .lastName("test")
        .role(Role.USER)
        .password("encoded")
        .lastSeen(null)
        .build();

    responseUserDTO = UserDTO.builder()
        .id(1L)
        .username("admin")
        .firstName("admin")
        .lastName("test")
        .lastSeen(null)
        .build();
  }

  @Test
  public void registerUserWhenUsernameDoesNotExist() {
    when(userRepository.existsByUsername(registerRequest.getUsername())).thenReturn(false);
    when(passwordEncoder.encode(registerRequest.getPassword())).thenReturn("encoded");
    when(userRepository.save(isA(User.class))).thenReturn(dbUser);

    String registerResponse = userService.registerUser(registerRequest);

    assertEquals("User registered successfully " + dbUser.getId(), registerResponse);

  }

  @Test
  public void registerUserWhenUsernameExists() {
    when(userRepository.existsByUsername(registerRequest.getUsername())).thenReturn(true);

    IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
        () -> userService.registerUser(registerRequest));

    assertTrue(exception.getMessage().equals("Username is already taken : " + registerRequest.getUsername()));
  }

  @Test
  public void loginUserWithRightCredentials() {
    Authentication authentication = mock(Authentication.class);

    when(authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())))
        .thenReturn(authentication);
    when(userRepository.findByUsername(loginRequest.getUsername())).thenReturn(Optional.of(dbUser));
    when(jwtService.generateToken(dbUser)).thenReturn("jwtToken12345");

    AuthenticationResponse authResponse = userService.loginUser(loginRequest);

    assertEquals("jwtToken12345", authResponse.getToken());
    assertEquals(responseUserDTO, authResponse.getUser());
    verify(authenticationManager).authenticate(any(Authentication.class));

  }

  @Test
  public void loginUserWithBadCredentials() {
    when(authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())))
        .thenThrow(new BadCredentialsException("Bad Credentials"));

    BadCredentialsException exception = assertThrows(BadCredentialsException.class,
        () -> userService.loginUser(loginRequest));

    assertTrue(exception.getMessage().equals("Bad Credentials"));
  }

}
