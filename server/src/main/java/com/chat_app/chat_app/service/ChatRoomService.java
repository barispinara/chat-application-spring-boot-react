package com.chat_app.chat_app.service;

import java.util.HashSet;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.chat_app.chat_app.model.ChatRoom;
import com.chat_app.chat_app.model.User;
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

    for (User u : chatRoom.getUsers()) {
      UserDTO newUserDTO = UserDTO.builder()
          .id(u.getId())
          .username(u.getUsername())
          .firstName(u.getFirstName())
          .lastName(u.getLastName())
          .build();

      userDTOList.add(newUserDTO);
    }

    return ChatRoomResponse.builder()
        .id(chatRoom.getId())
        .createdAt(chatRoom.getCreatedAt())
        .updatedAt(chatRoom.getUpdatedAt())
        .users(userDTOList)
        .build();
  }

  private Set<User> generateSetOfUser(Long targetUserId) {
    User authUser = authenticationService.getAuthenticatedCurrentUser();
    User targetUser = userService.findUserById(targetUserId);
    return Set.of(authUser, targetUser);
  }

}
