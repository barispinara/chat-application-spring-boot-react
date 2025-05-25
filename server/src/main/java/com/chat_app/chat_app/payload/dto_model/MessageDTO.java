package com.chat_app.chat_app.payload.dto_model;

import java.time.LocalDateTime;

import com.chat_app.chat_app.model.Message;
import com.chat_app.chat_app.model.User;

import lombok.Data;

@Data
public class MessageDTO {
  private Long id;
  private String content;
  private User sender;
  private Long chatRoomId;
  private LocalDateTime sentAt;
  private Boolean isSeen;

  public MessageDTO(Message message) {
    this.id = message.getId();
    this.content = message.getContent();
    this.sender = message.getSender();
    this.chatRoomId = message.getChatRoom().getId();
    this.sentAt = message.getSentAt();
    this.isSeen = message.getIsSeen();
  }
}
