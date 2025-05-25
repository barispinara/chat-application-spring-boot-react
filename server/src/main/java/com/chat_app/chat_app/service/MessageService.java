package com.chat_app.chat_app.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.chat_app.chat_app.model.ChatRoom;
import com.chat_app.chat_app.model.Message;
import com.chat_app.chat_app.model.User;
import com.chat_app.chat_app.payload.dto_model.MessageDTO;
import com.chat_app.chat_app.payload.request.SendMessageRequest;
import com.chat_app.chat_app.repository.MessageRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageService {
  private final MessageRepository messageRepository;
  private final ChatRoomService chatRoomService;
  private final SimpMessagingTemplate messagingTemplate;
  private final UserService userService;
  private static final Logger logger = LoggerFactory.getLogger(MessageService.class);

  public Message sendMessage(SendMessageRequest req, String userUsername) {
    User authUser = userService.findUserByUsername(userUsername);
    ChatRoom currChatRoom = chatRoomService.getChatRoomById(req.getChatId());

    Message newMessage = Message.builder()
        .sender(authUser)
        .chatRoom(currChatRoom)
        .content(req.getContent())
        .isSeen(false)
        .build();

    newMessage = messageRepository.save(newMessage);
    MessageDTO newMessageDTO = new MessageDTO(newMessage);
    messagingTemplate.convertAndSend("/topic/messages/" + currChatRoom.getId(), newMessageDTO);

    for (User user : currChatRoom.getUsers()) {
      if (!user.getUsername().equals(authUser.getUsername())) {
        messagingTemplate.convertAndSendToUser(user.getUsername(), "/notification", "New message from " +
            authUser.getUsername());
      }
    }

    return newMessage;
  }

  public List<MessageDTO> getAllMessagesByChatRoom(Long chatRoomId) {
    ChatRoom currChatRoom = chatRoomService.getChatRoomById(chatRoomId);
    List<Message> messageList = messageRepository.findAllByChatRoom(currChatRoom);
    return messageList.stream()
        .map(MessageDTO::new)
        .collect(Collectors.toList());
  }

  public Optional<MessageDTO> getLatestMessageByChatRoom(Long chatRoomId) {
    ChatRoom currChatRoom = chatRoomService.getChatRoomById(chatRoomId);
    Optional<Message> latestMessage = messageRepository.findLatestByChatRoom(currChatRoom);
    return latestMessage.map(message -> new MessageDTO(message));
  }
}
