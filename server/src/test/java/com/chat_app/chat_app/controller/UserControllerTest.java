package com.chat_app.chat_app.controller;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.chat_app.chat_app.model.Role;
import com.chat_app.chat_app.model.User;
import com.chat_app.chat_app.payload.request.LoginRequest;
import com.chat_app.chat_app.payload.request.RegisterRequest;
import com.chat_app.chat_app.payload.response.AuthenticationResponse;
import com.chat_app.chat_app.payload.response.AuthenticationResponse.UserDTO;
import com.chat_app.chat_app.service.JwtService;
import com.chat_app.chat_app.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.SerializationFeature;

@WebMvcTest(controllers = UserController.class)
@AutoConfigureMockMvc(addFilters = false)
public class UserControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @MockitoBean
  private UserService userService;

  @MockitoBean
  private JwtService jwtService;

  @MockitoBean
  private AuthenticationProvider authenticationProvider;

  static RegisterRequest registerRequest;
  static LoginRequest loginRequest;
  static User dbUser;
  static UserDTO responseUserDTO;

  static Authentication authentication;
  static ObjectMapper mapper;
  static ObjectWriter ow;

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
        .build();

    responseUserDTO = UserDTO.builder()
        .id(1L)
        .username("admin")
        .firstName("admin")
        .lastName("test")
        .build();

    authentication = new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword());

    mapper = new ObjectMapper().configure(SerializationFeature.WRAP_ROOT_VALUE, false);
    ow = mapper.writer().withDefaultPrettyPrinter();
  }

  @Test
  public void registerUserWhenUsernameDoesNotExist() throws Exception {
    when(userService.registerUser(registerRequest))
        .thenReturn("User registered successfully " + dbUser.getId());

    String requestJson = ow.writeValueAsString(registerRequest);

    mockMvc.perform(post("/user/register")
        .contentType(MediaType.APPLICATION_JSON)
        .content(requestJson))
        .andExpectAll(
            status().isOk(),
            content().string("User registered successfully " + dbUser.getId()));

    verify(userService).registerUser(registerRequest);
  }

  @Test
  public void registerUserWhenUsernameExists() throws Exception {
    when(userService.registerUser(registerRequest))
        .thenThrow(
            new IllegalArgumentException("Username is already taken : " + registerRequest.getUsername()));

    String requestJson = ow.writeValueAsString(registerRequest);

    mockMvc.perform(post("/user/register")
        .contentType(MediaType.APPLICATION_JSON)
        .content(requestJson))
        .andExpectAll(
            status().isBadRequest(),
            jsonPath("$.message").value("Username is already taken : " + registerRequest.getUsername()));

    verify(userService).registerUser(registerRequest);

  }

  @Test
  public void loginUserWithRightCredentials() throws Exception {
    when(userService.loginUser(loginRequest))
        .thenReturn(new AuthenticationResponse("jwtToken12345", responseUserDTO));

    String requestJson = ow.writeValueAsString(loginRequest);

    mockMvc.perform(post("/user/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content(requestJson))
        .andExpectAll(
            status().isOk(),
            jsonPath("$.token").value("jwtToken12345"),
            jsonPath("$.user.id").value(1L),
            jsonPath("$.user.username").value("admin"),
            jsonPath("$.user.firstName").value("admin"),
            jsonPath("$.user.lastName").value("test"));

    verify(userService).loginUser(loginRequest);
  }

  @Test
  public void loginUserWithWrongCredentials() throws Exception {
    when(userService.loginUser(loginRequest))
        .thenThrow(new BadCredentialsException("Invalid username or password"));

    String requestJson = ow.writeValueAsString(loginRequest);

    mockMvc.perform(post("/user/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content(requestJson))
        .andExpectAll(
            status().isForbidden(),
            jsonPath("$.message").value("Invalid username or password"));

    verify(userService).loginUser(loginRequest);
  }

  @Test
  public void registerUserWithBlankUsernameCredentials() throws Exception {
    RegisterRequest invalidRequest = RegisterRequest.builder()
        .firstName("admin")
        .lastName("test")
        .username("")
        .password("testasd123")
        .build();

    String requestJson = ow.writeValueAsString(invalidRequest);

    mockMvc.perform(post("/user/register")
        .contentType(MediaType.APPLICATION_JSON)
        .content(requestJson))
        .andExpectAll(
            status().isBadRequest());

  }

  @Test
  public void registerUserWithBlankPasswordCredentials() throws Exception {
    RegisterRequest invalidRequest = RegisterRequest.builder()
        .firstName("admin")
        .lastName("test")
        .username("admin")
        .password("")
        .build();

    String requestJson = ow.writeValueAsString(invalidRequest);

    mockMvc.perform(post("/user/register")
        .contentType(MediaType.APPLICATION_JSON)
        .content(requestJson))
        .andExpectAll(
            status().isBadRequest());
  }

  @Test
  public void registerUserWithNonDigitPasswordCredentials() throws Exception {
    RegisterRequest invalidRequest = RegisterRequest.builder()
        .firstName("admin")
        .lastName("test")
        .username("admin")
        .password("testasd")
        .build();

    String requestJson = ow.writeValueAsString(invalidRequest);

    mockMvc.perform(post("/user/register")
        .contentType(MediaType.APPLICATION_JSON)
        .content(requestJson))
        .andExpectAll(
            status().isBadRequest(),
            jsonPath("$.message").value("{\"Password\": [Password must contain at least one digit.]}"));
  }

  @Test
  public void registerUserWithBlankFirstNameCredentials() throws Exception {
    RegisterRequest invalidRequest = RegisterRequest.builder()
        .firstName("")
        .lastName("test")
        .username("admin")
        .password("testasd123")
        .build();

    String requestJson = ow.writeValueAsString(invalidRequest);

    mockMvc.perform(post("/user/register")
        .contentType(MediaType.APPLICATION_JSON)
        .content(requestJson))
        .andExpectAll(
            status().isBadRequest(),
            jsonPath("$.message").value("{\"FirstName\": [First name is required.]}"));
  }

  @Test
  public void registerUserWithBlankLastNameCredentials() throws Exception {
    RegisterRequest invalidRequest = RegisterRequest.builder()
        .firstName("admin")
        .lastName("")
        .username("admin")
        .password("testasd123")
        .build();

    String requestJson = ow.writeValueAsString(invalidRequest);

    mockMvc.perform(post("/user/register")
        .contentType(MediaType.APPLICATION_JSON)
        .content(requestJson))
        .andExpectAll(
            status().isBadRequest(),
            jsonPath("$.message").value("{\"LastName\": [Last name is required.]}"));
  }

  @Test
  public void loginUserWithBlankUsernameCredentials() throws Exception {
    LoginRequest invalidRequest = LoginRequest.builder()
        .username("")
        .password("testasd123")
        .build();

    String requestJson = ow.writeValueAsString(invalidRequest);

    mockMvc.perform(post("/user/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content(requestJson))
        .andExpectAll(
            status().isBadRequest());
  }

  @Test
  public void loginUserWithBlankPasswordCredentials() throws Exception {
    LoginRequest invalidRequest = LoginRequest.builder()
        .username("admin")
        .password("null")
        .build();

    String requestJson = ow.writeValueAsString(invalidRequest);

    mockMvc.perform(post("/user/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content(requestJson))
        .andExpectAll(
            status().isBadRequest());
  }

}
