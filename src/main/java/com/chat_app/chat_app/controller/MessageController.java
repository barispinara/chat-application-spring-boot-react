package com.chat_app.chat_app.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chat_app.chat_app.model.Message;
import com.chat_app.chat_app.payload.request.SendMessageRequest;
import com.chat_app.chat_app.service.MessageService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/message")
@Validated
@RequiredArgsConstructor
public class MessageController {
  private final MessageService messageService;

  @PostMapping("/create")
  public ResponseEntity<?> sendMessage(@Valid @RequestBody SendMessageRequest request) {
    return ResponseEntity.ok(messageService.sendMessage(request));
  }

  @GetMapping("/all/{chat_id}")
  public ResponseEntity<?> getAllMessagesByChatRoom(@PathVariable Long chat_id) {
    List<Message> messages = messageService.getAllMessagesByChatRoom(chat_id);
    return ResponseEntity.ok(messages);
  }

  @GetMapping("/{chat_id}")
  public ResponseEntity<Message> getLatestMessageByChatRoom(@PathVariable Long chat_id) {
    // return ResponseEntity.ok(messageService.getLatestMessageByChatRoom(chat_id));
    return messageService.getLatestMessageByChatRoom(chat_id)
        .map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
  }

}
