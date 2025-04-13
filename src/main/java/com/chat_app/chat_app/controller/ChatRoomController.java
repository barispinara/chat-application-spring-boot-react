package com.chat_app.chat_app.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chat_app.chat_app.model.ChatRoom;
import com.chat_app.chat_app.service.ChatRoomService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/chat")
@Validated
@RequiredArgsConstructor
public class ChatRoomController {
  private final ChatRoomService chatRoomService;

  @GetMapping("/user/{user_id}")
  public ResponseEntity<?> getOrCreateChatRoomByUser(@PathVariable Long user_id) {
    ChatRoom chatRoom = chatRoomService.getOrCreateChatRoomByUsers(user_id);
    return ResponseEntity.ok(chatRoom);
  }

  @GetMapping("/{chat_id}")
  public ResponseEntity<?> getChatRoomById(@PathVariable Long chat_id) {
    ChatRoom chatRoom = chatRoomService.getChatRoomById(chat_id);
    return ResponseEntity.ok(chatRoom);
  }

}
