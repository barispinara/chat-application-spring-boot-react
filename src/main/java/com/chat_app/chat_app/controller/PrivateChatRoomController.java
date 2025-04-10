package com.chat_app.chat_app.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chat_app.chat_app.model.PrivateChatRoom;
import com.chat_app.chat_app.service.PrivateChatRoomService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/chat-room/private")
@RequiredArgsConstructor
@Validated
public class PrivateChatRoomController {

  private final PrivateChatRoomService privateChatRoomService;

  @PostMapping("/{target_user_id}")
  public ResponseEntity<PrivateChatRoom> getOrCreatePrivateChatRoom(@PathVariable Long target_user_id) {
    return ResponseEntity.ok(privateChatRoomService.getOrCreatePrivateChatRoom(target_user_id));
  }

}
