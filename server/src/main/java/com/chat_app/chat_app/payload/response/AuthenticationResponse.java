package com.chat_app.chat_app.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {

  private String token;
  private UserDTO user;

  @Data
  @Builder
  @AllArgsConstructor
  public static class UserDTO {
    private Long id;
    private String username;
    private String firstName;
    private String lastName;

  }
}
