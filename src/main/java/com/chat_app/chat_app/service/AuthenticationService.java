package com.chat_app.chat_app.service;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.chat_app.chat_app.model.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
  private final UserService userService;
  private final JwtService jwtService;

  public User getAuthenticatedCurrentUser() {
    Authentication authentication = getAuthentication();
    validateAuthentication(authentication);
    UserDetails userDetails = extractUserDetails(authentication);
    return userService.findUserByUsername(userDetails.getUsername());
  }

  public User getAuthenticatedUserFromToken(String token) {
    String username = jwtService.extractUsername(token);
    return userService.findUserByUsername(username);
  }

  private Authentication getAuthentication() {
    return SecurityContextHolder.getContext().getAuthentication();
  }

  private void validateAuthentication(Authentication authentication) {
    if (authentication == null || !authentication.isAuthenticated()
        || authentication instanceof AnonymousAuthenticationToken)
      throw new AccessDeniedException("User not authenticated");
  }

  private UserDetails extractUserDetails(Authentication authentication) {
    Object principal = authentication.getPrincipal();
    if (!(principal instanceof UserDetails))
      throw new IllegalStateException("Authentication principal is not of UserDetails type");

    return (UserDetails) principal;
  }
}
