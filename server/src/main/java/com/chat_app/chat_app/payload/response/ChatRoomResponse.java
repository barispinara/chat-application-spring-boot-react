package com.chat_app.chat_app.payload.response;

import java.time.LocalDateTime;
import java.util.Set;

import com.chat_app.chat_app.payload.dto_model.UserDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatRoomResponse {
  private Long id;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
  private Set<UserDTO> users;
}
