package com.chat_app.chat_app.listener;

import java.security.Principal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class WebSocketEventListener {

  private static final Logger logger = LoggerFactory.getLogger(WebSocketEventListener.class);

  @EventListener
  public void handleSessionConnectEvent(SessionConnectedEvent event) {
    logger.info(event.getMessage().toString());
    logger.error("Received a new web socket connection");
  }

  @EventListener
  public void handleSessionDisconnectEvent(SessionDisconnectEvent event) {
    StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
    Principal userPrincipal = accessor.getUser();
    if (userPrincipal != null) {
      logger.info("Received a new web socket disconnection {}", userPrincipal.getName());
    } else {
      logger.error("Error occurred during receiving user information on web socke disconnect event");
    }
  }

  @EventListener
  public void handleWebSocketSubscribeListener(SessionSubscribeEvent event) {
    StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
    Principal userPrincipal = accessor.getUser();
    if (userPrincipal != null) {
      logger.info("Received a new web socket connection {}", userPrincipal.getName());
    } else {
      logger.error("Error occurred during receiving user information on web socket connection event");
    }
  }
}
