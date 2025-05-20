package com.chat_app.chat_app.controller;

import com.chat_app.chat_app.model.Message;
import com.chat_app.chat_app.payload.request.SendMessageRequest;
import com.chat_app.chat_app.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/message")
@Validated
@RequiredArgsConstructor
public class MessageController {
    private static final Logger logger = LoggerFactory.getLogger(MessageController.class);

    private final MessageService messageService;

    @MessageMapping("/create/{chatId}")
    public ResponseEntity<?> sendMessage(@DestinationVariable Long chatId, @Valid @RequestBody SendMessageRequest request) {
        return ResponseEntity.ok(messageService.sendMessage(request));
    }

    @MessageMapping("/notification")
    public ResponseEntity<?> notificationMessage(@Payload String userUsername, SimpMessageHeaderAccessor headerAccessor) {
        logger.info("{} user is connected", userUsername);
        return ResponseEntity.ok("User connected");
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
