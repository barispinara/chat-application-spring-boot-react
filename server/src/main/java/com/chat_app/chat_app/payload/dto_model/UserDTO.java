package com.chat_app.chat_app.payload.dto_model;

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

}
