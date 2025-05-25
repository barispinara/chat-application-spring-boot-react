package com.chat_app.chat_app.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chat_app.chat_app.model.ChatRoom;
import com.chat_app.chat_app.payload.response.ChatRoomResponse;
import com.chat_app.chat_app.service.ChatRoomService;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/chat")
@Validated
@RequiredArgsConstructor
public class ChatRoomController {
  private final ChatRoomService chatRoomService;

  @GetMapping("/user/{user_id}")
  public ResponseEntity<ChatRoomResponse> getChatRoomByUser(@PathVariable Long user_id) {
    ChatRoom chatRoom = chatRoomService.getChatRoomByUsers(user_id);
    return ResponseEntity.ok(chatRoomService.generateChatRoomResponseByChatRoom(chatRoom));
  }

  @PostMapping("/create/{user_id}")
  public ResponseEntity<ChatRoomResponse> createChatRoom(@PathVariable Long user_id) {
    ChatRoom chatRoom = chatRoomService.createChatRoom(user_id);
    return ResponseEntity.ok(chatRoomService.generateChatRoomResponseByChatRoom(chatRoom));
  }

  @GetMapping("/user/all")
  public ResponseEntity<List<ChatRoomResponse>> getAllChatRoomsOfUser() {
    List<ChatRoom> chatRooms = chatRoomService.getAllChatRoomsOfUser();
    return ResponseEntity.ok(
            chatRooms.stream()
                    .map(chatRoomService::generateChatRoomResponseByChatRoom)
                    .collect(Collectors.toList())
    );
  }

  @GetMapping("/{chat_id}")
  public ResponseEntity<ChatRoomResponse> getChatRoomById(@PathVariable Long chat_id) {
    ChatRoom chatRoom = chatRoomService.getChatRoomById(chat_id);
    return ResponseEntity.ok(chatRoomService.generateChatRoomResponseByChatRoom(chatRoom));
  }

}
