package com.chat_app.chat_app.payload.response;

import com.chat_app.chat_app.payload.dto_model.UserDTO;

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
}
