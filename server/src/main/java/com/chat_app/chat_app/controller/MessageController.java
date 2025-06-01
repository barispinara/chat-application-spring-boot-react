package com.chat_app.chat_app.controller;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.chat_app.chat_app.payload.dto_model.MessageDTO;
import com.chat_app.chat_app.payload.request.SendMessageRequest;
import com.chat_app.chat_app.service.MessageService;
import com.chat_app.chat_app.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/message")
@Validated
@RequiredArgsConstructor
public class MessageController {
  private static final Logger logger = LoggerFactory.getLogger(MessageController.class);

  private final MessageService messageService;
  private final UserService userService;

  @MessageMapping("/create/{chatId}")
  public void sendMessage(@DestinationVariable Long chatId,
      @Valid SendMessageRequest request,
      Principal principal) {
    messageService.sendMessage(request, principal.getName());
  }

  @MessageMapping("/notification/{userUsername}")
  public void notificationMessage(@DestinationVariable String userUsername,
      SimpMessageHeaderAccessor headerAccessor) {
    logger.info("{} user is received new notification", userUsername);
  }

  @MessageMapping("/heartbeat")
  public void handleHeartbeat(Principal principal) {
    userService.updateUserLastSeen(principal.getName(), LocalDateTime.now());
    messageService.broadcastLastSeenInformation(principal.getName());
  }

  @MessageMapping("/lastseen/{userUsername}")
  public void handleLastSeenRequest(@DestinationVariable String userUsername, Principal principal) {
    logger.error("{} user is received new notification", userUsername);
  }

  @GetMapping("/all/{chat_id}")
  public ResponseEntity<?> getAllMessagesByChatRoom(@PathVariable Long chat_id) {
    List<MessageDTO> messages = messageService.getAllMessagesByChatRoom(chat_id);
    return ResponseEntity.ok(messages);
  }

  @GetMapping("/{chat_id}")
  public ResponseEntity<MessageDTO> getLatestMessageByChatRoom(@PathVariable Long chat_id) {
    return messageService.getLatestMessageByChatRoom(chat_id)
        .map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
  }

}
