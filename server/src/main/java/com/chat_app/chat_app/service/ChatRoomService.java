package com.chat_app.chat_app.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import com.chat_app.chat_app.model.ChatRoom;
import com.chat_app.chat_app.model.User;
import com.chat_app.chat_app.payload.dto_model.MessageDTO;
import com.chat_app.chat_app.payload.dto_model.UserDTO;
import com.chat_app.chat_app.payload.response.ChatRoomResponse;
import com.chat_app.chat_app.repository.ChatRoomRepository;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatRoomService {
  private final ChatRoomRepository chatRoomRepository;
  private final UserService userService;
  private final AuthenticationService authenticationService;
  private MessageService messageService;

  @Autowired
  public void setMessageService(@Lazy MessageService messageService) {
    this.messageService = messageService;
  }

  public ChatRoom getChatRoomByUsers(Long targetUserId) {
    Set<User> users = generateSetOfUser(targetUserId);

    String userPairKey = ChatRoom.generateUserPairKey(users);
    return chatRoomRepository.findByUserPairKey(userPairKey)
        .orElseThrow(() -> new EntityNotFoundException("You don't have chatroom with this user " + targetUserId));
  }

  public ChatRoom getChatRoomById(Long id) {
    return chatRoomRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("ChatRoom not found with id " + id));
  }

  public List<ChatRoom> getAllChatRoomsOfUser() {
    User authenticatedUser = authenticationService.getAuthenticatedCurrentUser();
    return chatRoomRepository.findByUsers_Id(authenticatedUser.getId());
  }

  public void deleteChatRoomById(Long id) {
    if (chatRoomRepository.existsById(id)) {
      chatRoomRepository.deleteById(id);
    }
  }

  public ChatRoom createChatRoom(Long targetUserId) {
    Set<User> users = generateSetOfUser(targetUserId);
    String generatedPairkey = ChatRoom.generateUserPairKey(users);

    if (chatRoomRepository.existsByUserPairKey(generatedPairkey)) {
      throw new EntityExistsException("There is already chatroom between these users");
    }

    ChatRoom newChatRoom = new ChatRoom();
    newChatRoom.setUsers(users);
    return chatRoomRepository.save(newChatRoom);
  }

  public ChatRoomResponse generateChatRoomResponseByChatRoom(ChatRoom chatRoom) {
    Set<UserDTO> userDTOList = new HashSet<>();
    MessageDTO latestMessage = messageService.getLatestMessageByChatRoom(chatRoom.getId()).orElse(null);

    for (User u : chatRoom.getUsers()) {
      UserDTO newUserDTO = UserDTO.builder()
          .id(u.getId())
          .username(u.getUsername())
          .firstName(u.getFirstName())
          .lastName(u.getLastName())
          .lastSeen(u.getLastSeen())
          .build();

      userDTOList.add(newUserDTO);
    }

    return ChatRoomResponse.builder()
        .id(chatRoom.getId())
        .createdAt(chatRoom.getCreatedAt())
        .updatedAt(chatRoom.getUpdatedAt())
        .users(userDTOList)
        .latestMessage(latestMessage)
        .build();
  }

  private Set<User> generateSetOfUser(Long targetUserId) {
    User authUser = authenticationService.getAuthenticatedCurrentUser();
    User targetUser = userService.findUserById(targetUserId);
    return Set.of(authUser, targetUser);
  }

}
