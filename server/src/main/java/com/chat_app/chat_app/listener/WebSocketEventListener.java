package com.chat_app.chat_app.listener;

import java.util.Objects;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.chat_app.chat_app.model.User;

@Component
public class WebSocketEventListener {

  private static final Logger logger = LoggerFactory.getLogger(WebSocketEventListener.class);

  @EventListener
  public void handleSessionConnectEvent(SessionConnectEvent event) {
    logger.info("Received a new web socket connection");
  }

  @EventListener
  public void handleSessionDisconnectEvent(SessionDisconnectEvent event) {
    StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
    User cUser = (User) Objects.requireNonNull(headerAccessor.getSessionAttributes()).get("User");
    logger.info("Received a new web socket disconnection " + cUser.getUsername());
  }
}
