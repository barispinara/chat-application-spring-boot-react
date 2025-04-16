package com.chat_app.chat_app.service;

import java.util.List;
import java.util.Optional;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.chat_app.chat_app.model.ChatRoom;
import com.chat_app.chat_app.model.Message;
import com.chat_app.chat_app.model.User;
import com.chat_app.chat_app.payload.request.SendMessageRequest;
import com.chat_app.chat_app.repository.MessageRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageService {
  private final MessageRepository messageRepository;
  private final AuthenticationService authenticationService;
  private final ChatRoomService chatRoomService;
  private final SimpMessagingTemplate messagingTemplate;

  public Message sendMessage(SendMessageRequest req) {
    User authUser = authenticationService.getAuthenticatedCurrentUser();
    ChatRoom currChatRoom = chatRoomService.getChatRoomById(req.getChatId());

    Message newMessage = Message.builder()
        .sender(authUser)
        .chatRoom(currChatRoom)
        .content(req.getContent())
        .build();

    newMessage = messageRepository.save(newMessage);
    messagingTemplate.convertAndSend("/chat/" + currChatRoom.getId(), newMessage);

    return newMessage;
  }

  public List<Message> getAllMessagesByChatRoom(Long chatRoomId) {
    ChatRoom currChatRoom = chatRoomService.getChatRoomById(chatRoomId);
    return messageRepository.findAllByChatRoom(currChatRoom);
  }

  public Optional<Message> getLatestMessageByChatRoom(Long chatRoomId) {
    ChatRoom currChatRoom = chatRoomService.getChatRoomById(chatRoomId);
    return messageRepository.findLatestByChatRoom(currChatRoom);
  }
}
