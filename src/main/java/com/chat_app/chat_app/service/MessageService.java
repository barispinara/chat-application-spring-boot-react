package com.chat_app.chat_app.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.chat_app.chat_app.model.ChatRoom;
import com.chat_app.chat_app.model.Message;

import com.chat_app.chat_app.model.User;
import com.chat_app.chat_app.repository.MessageRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class MessageService {

  private final MessageRepository messageRepository;

  public Message createMessage(String content, User senderUser, ChatRoom currChatRoom) {

    Message newMessage = Message.builder()
        .content(content)
        .sender(senderUser)
        .chatRoom(currChatRoom)
        .sentAt(LocalDateTime.now())
        .build();
    return messageRepository.save(newMessage);
  }

  public List<Message> getAllMessagesByChatRoom(ChatRoom chatRoom) {
    return messageRepository.findAllByChatRoom(chatRoom);
  }

  public Message getLatestMessageByChatRoom(ChatRoom chatRoom) {
    return messageRepository.findLatestMessageOrThrow(chatRoom);
  }
}
