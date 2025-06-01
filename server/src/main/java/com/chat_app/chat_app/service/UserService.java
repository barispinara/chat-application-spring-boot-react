package com.chat_app.chat_app.service;

import com.chat_app.chat_app.model.Role;
import com.chat_app.chat_app.model.User;
import com.chat_app.chat_app.payload.dto_model.UserDTO;
import com.chat_app.chat_app.payload.request.LoginRequest;
import com.chat_app.chat_app.payload.request.RegisterRequest;
import com.chat_app.chat_app.payload.response.AuthenticationResponse;
import com.chat_app.chat_app.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;
  private AuthenticationService authenticationService;

  @Autowired
  public void setAuthenticationService(@Lazy AuthenticationService authenticationService) {
    this.authenticationService = authenticationService;
  }

  public User findUserByUsername(String username) {
    return userRepository.findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found with username " + username));
  }

  public User findUserById(Long id) {
    return userRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("User not found with id " + id));
  }

  public boolean isUsernameTaken(String username) {
    return userRepository.existsByUsername(username);
  }

  public String registerUser(RegisterRequest request) {

    if (isUsernameTaken(request.getUsername())) {
      throw new IllegalArgumentException("Username is already taken : " + request.getUsername());
    }

    User user = User.builder()
        .firstName(request.getFirstName())
        .lastName(request.getLastName())
        .username(request.getUsername())
        .password(passwordEncoder.encode(request.getPassword()))
        .lastSeen(null)
        .role(Role.USER)
        .build();

    User savedUser = userRepository.save(user);
    return "User registered successfully " + savedUser.getId();

  }

  public void updateUserLastSeen(String username, LocalDateTime lastSeen) {
    User user = findUserByUsername(username);
    user.setLastSeen(lastSeen);
    userRepository.save(user);
  }

  public List<User> getAllUsersExceptCurrentUser() {
    User currentUser = authenticationService.getAuthenticatedCurrentUser();
    return (List<User>) userRepository.findAllByIdNot(currentUser.getId());
  }

  public AuthenticationResponse loginUser(LoginRequest request) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            request.getUsername(),
            request.getPassword()));

    User user = findUserByUsername(request.getUsername());

    String jwtToken = jwtService.generateToken(user);

    return AuthenticationResponse.builder()
        .token(jwtToken)
        .user(
            UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .lastSeen(user.getLastSeen())
                .build())
        .build();
  }
}
