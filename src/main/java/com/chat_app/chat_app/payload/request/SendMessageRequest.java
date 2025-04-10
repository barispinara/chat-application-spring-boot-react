package com.chat_app.chat_app.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SendMessageRequest {

  @NotBlank(message = "user id is required.")
  private Integer userId;

  @NotBlank(message = "chat id is required.")
  private Integer chatId;

  @NotBlank(message = "Content can not empty")
  private String content;
}
