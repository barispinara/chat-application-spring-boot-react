package com.chat_app.chat_app.listener;

import java.security.Principal;
import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import com.chat_app.chat_app.service.UserService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class WebSocketEventListener {

  private static final Logger logger = LoggerFactory.getLogger(WebSocketEventListener.class);
  private final UserService userService;

  @EventListener
  public void handleSessionConnectEvent(SessionConnectedEvent event) {
    StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
    Principal userPrincipal = accessor.getUser();
    if (userPrincipal == null) {
      logger.error("User not found on session connect event");
    } else {
      logger.info("Received a new web socket connection {}", userPrincipal.getName());
      userService.updateUserLastSeen(userPrincipal.getName(), LocalDateTime.now());

    }
  }

  @EventListener
  public void handleSessionDisconnectEvent(SessionDisconnectEvent event) {
    StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
    Principal userPrincipal = accessor.getUser();
    if (userPrincipal == null) {
      logger.error("User not found on session disconnect event");
    } else {
      logger.info("Received a new web socket disconnection {}", userPrincipal.getName());
      userService.updateUserLastSeen(userPrincipal.getName(), LocalDateTime.now());
    }
  }

  @EventListener
  public void handleWebSocketSubscribeListener(SessionSubscribeEvent event) {
    StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
    Principal userPrincipal = accessor.getUser();
    if (userPrincipal == null) {
      logger.error("User not found on session subscribe event ");
    } else {
      logger.info("User : {} subscribed to this topic {}", userPrincipal.getName(), accessor.getDestination());
    }

  }
}
