package com.chat_app.chat_app.config;

import java.security.Principal;

import javax.security.sasl.AuthenticationException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.chat_app.chat_app.service.JwtService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class WebSocketAuthInterceptorAdapter implements ChannelInterceptor {

  private static final Logger logger = LoggerFactory.getLogger(WebSocketAuthInterceptorAdapter.class);
  private final JwtService jwtService;
  private final UserDetailsService userDetailsService;

  @Override
  public Message<?> preSend(Message<?> message, MessageChannel channel) {
    StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

    logger.debug("Processing message with command: {} and headers: {}",
        accessor != null ? accessor.getCommand() : "null", accessor);

    // Validate accessor
    if (accessor == null) {
      logger.error("StompHeaderAccessor is null - invalid message format");
      throw new IllegalArgumentException("Invalid message headers on WebSocket Authentication");
    }

    // Handle CONNECT command for initial authentication
    if (StompCommand.CONNECT.equals(accessor.getCommand())) {
      authenticateConnection(accessor);
    }
    // Handle MESSAGE commands (like @MessageMapping) - propagate authentication
    else if (StompCommand.SEND.equals(accessor.getCommand())) {
      authenticateMessage(accessor);
    }

    return message;
  }

  private void authenticateConnection(StompHeaderAccessor accessor) {
    try {
      String authorizationHeader = accessor.getFirstNativeHeader("Authorization");
      validateAuthorizationHeader(authorizationHeader);

      String token = authorizationHeader.substring(7).trim();
      String username = extractUsername(token);

      UserDetails userDetails = loadUserDetails(username);
      validateTokenForUser(token, userDetails);

      // Set authentication in accessor for session storage
      UsernamePasswordAuthenticationToken authenticationToken = createAuthenticationToken(userDetails);
      accessor.setUser(authenticationToken);

      // Also set in SecurityContext for this thread
      SecurityContextHolder.getContext().setAuthentication(authenticationToken);

    } catch (IllegalArgumentException e) {
      logger.error("WebSocket authentication failed: {}", e.getMessage());
      throw e;
    } catch (Exception e) {
      logger.error("Unexpected error during WebSocket Authentication: {}", e.getMessage());
      throw new IllegalArgumentException("Authentication failed due to server error during authentication");
    }
  }

  private void authenticateMessage(StompHeaderAccessor accessor) {
    try {
      // First, try to get authentication from the session (stored during CONNECT)
      Principal userPrincipal = accessor.getUser();
      if (userPrincipal instanceof UsernamePasswordAuthenticationToken sessionAuth) {
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(sessionAuth);
        SecurityContextHolder.setContext(context);
        logger.debug("This is the new SecurityContext {}", SecurityContextHolder.getContext().getAuthentication());
        return;
      }

      // Fallback: Try to authenticate from Authorization header in the message
      String authorizationHeader = accessor.getFirstNativeHeader("Authorization");
      if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
        validateAuthorizationHeader(authorizationHeader);
        String token = authorizationHeader.substring(7).trim();
        String username = extractUsername(token);
        UserDetails userDetails = loadUserDetails(username);
        validateTokenForUser(token, userDetails);

        UsernamePasswordAuthenticationToken authenticationToken = createAuthenticationToken(userDetails);
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);

        logger.debug("Message authenticated via Authorization header for user: {}", username);
      } else {
        logger.error("No authentication found for message - neither in session nor in headers");
        throw new AuthenticationException("Message authentication required");
      }

    } catch (Exception e) {
      logger.error("Message authentication failed: {}", e.getMessage());
      throw new IllegalArgumentException("Message authentication failed: " + e.getMessage());
    }
  }

  private void validateAuthorizationHeader(String authorizationHeader) {
    if (authorizationHeader == null) {
      throw new IllegalArgumentException("Authorization header is missing.");
    }
    if (authorizationHeader.trim().isEmpty()) {
      throw new IllegalArgumentException("Authorization header is empty.");
    }
    if (!authorizationHeader.startsWith("Bearer ")) {
      throw new IllegalArgumentException("Authorization header must start with 'Bearer '");
    }
    if (authorizationHeader.length() <= 7) {
      throw new IllegalArgumentException("Authorization header contains no token");
    }
  }

  private String extractUsername(String token) {
    try {
      String username = jwtService.extractUsername(token);
      if (username == null) {
        throw new IllegalArgumentException("Username not found in JWT token");
      }
      return username;
    } catch (Exception e) {
      throw new IllegalArgumentException("Failed to extract username from JWT token: " + e.getMessage());
    }
  }

  private UserDetails loadUserDetails(String username) {
    try {
      UserDetails userDetails = userDetailsService.loadUserByUsername(username);
      if (userDetails == null) {
        throw new IllegalArgumentException("User details not found for username: " + username);
      }
      return userDetails;
    } catch (UsernameNotFoundException e) {
      throw new UsernameNotFoundException("User not found: " + username);
    } catch (Exception e) {
      throw new IllegalArgumentException("Failed to load user details: " + e.getMessage());
    }
  }

  private void validateTokenForUser(String token, UserDetails userDetails) {
    try {
      if (!jwtService.isTokenValid(token, userDetails)) {
        throw new AuthenticationException("JWT token is invalid or expired.");
      }
    } catch (Exception e) {
      throw new IllegalArgumentException("Token validation failed: " + e.getMessage());
    }
  }

  private UsernamePasswordAuthenticationToken createAuthenticationToken(UserDetails userDetails) {
    return new UsernamePasswordAuthenticationToken(
        userDetails,
        null,
        userDetails.getAuthorities());
  }
}
