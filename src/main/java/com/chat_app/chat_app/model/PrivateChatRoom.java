package com.chat_app.chat_app.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@DiscriminatorValue("PRIVATE")
public class PrivateChatRoom extends ChatRoom {

  public void setParticipants(User user1, User user2) {
    getParticipants().clear();
    getParticipants().add(user1);
    getParticipants().add(user2);
  }

}
