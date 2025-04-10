package com.chat_app.chat_app.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.chat_app.chat_app.model.PrivateChatRoom;
import com.chat_app.chat_app.model.User;
import com.chat_app.chat_app.repository.PrivateChatRoomRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PrivateChatRoomService {
  private final PrivateChatRoomRepository privateChatRoomRepository;
  private final AuthenticationService authenticationService;
  private final UserService userService;

  public PrivateChatRoom getOrCreatePrivateChatRoom(Long targetUserId) {
    User currAuthenticatedUser = authenticationService.getAuthenticatedCurrentUser();
    User targetUser = userService.findUserById(targetUserId);

    Optional<PrivateChatRoom> existingChat = privateChatRoomRepository.findPrivateChatRoomByUsers(currAuthenticatedUser,
        targetUser);

    if (existingChat.isPresent()) {
      return existingChat.get();
    }

    PrivateChatRoom newPrivateChatRoom = new PrivateChatRoom();
    newPrivateChatRoom.setParticipants(currAuthenticatedUser, targetUser);
    return privateChatRoomRepository.save(newPrivateChatRoom);
  }

  public PrivateChatRoom getPrivateChatRoomById(Long id) {
    return privateChatRoomRepository.findById(id)
        .orElseThrow(() -> new EntityNotFoundException("PrivateChatRoom not found with id " + id));
  }

  public void deletePrivateChatRoomById(Long id) {
    privateChatRoomRepository.deleteById(id);
  }

}
