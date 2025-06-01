package com.chat_app.chat_app.payload.dto_model;

import java.time.LocalDateTime;

import com.chat_app.chat_app.model.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class UserDTO {
  private Long id;
  private String username;
  private String firstName;
  private String lastName;
  private LocalDateTime lastSeen;

  public UserDTO(User user) {
    this.id = user.getId();
    this.username = user.getUsername();
    this.firstName = user.getFirstName();
    this.lastName = user.getLastName();
    this.lastSeen = user.getLastSeen();
  }

}
