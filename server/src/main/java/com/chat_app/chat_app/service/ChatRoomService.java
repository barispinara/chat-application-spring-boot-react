package com.chat_app.chat_app.service;

import java.util.Set;

import org.springframework.stereotype.Service;

import com.chat_app.chat_app.model.ChatRoom;
import com.chat_app.chat_app.model.User;
import com.chat_app.chat_app.repository.ChatRoomRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatRoomService {
  private final ChatRoomRepository chatRoomRepository;
  private final UserService userService;
  private final AuthenticationService authenticationService;

  public ChatRoom getOrCreateChatRoomByUsers(Long targetUserId) {
    User authUser = authenticationService.getAuthenticatedCurrentUser();
    User targetUser = userService.findUserById(targetUserId);
    Set<User> users = Set.of(targetUser, authUser);

    String userPairKey = ChatRoom.generateUserPairKey(users);
    return chatRoomRepository.findByUserPairKey(userPairKey).orElseGet(() -> createChatRoom(users));
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

  public ChatRoom createChatRoom(Set<User> users) {
    ChatRoom newChatRoom = new ChatRoom();
    newChatRoom.setUsers(users);
    return chatRoomRepository.save(newChatRoom);
  }
}
