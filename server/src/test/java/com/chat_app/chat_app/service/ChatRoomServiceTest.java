package com.chat_app.chat_app.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.isA;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import com.chat_app.chat_app.model.ChatRoom;
import com.chat_app.chat_app.model.Role;
import com.chat_app.chat_app.model.User;
import com.chat_app.chat_app.payload.response.ChatRoomResponse;
import com.chat_app.chat_app.repository.ChatRoomRepository;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;

@ExtendWith(MockitoExtension.class)
public class ChatRoomServiceTest {
  @Mock
  private ChatRoomRepository chatRoomRepository;

  @Mock
  private UserService userService;

  @Mock
  private AuthenticationService authenticationService;

  @InjectMocks
  private ChatRoomService chatRoomService;

  static ChatRoom dbChatRoom;
  static User dbFirstUser;
  static User dbSecondUser;

  @BeforeAll
  static void setup() {
    dbFirstUser = User.builder()
        .id(1L)
        .username("firstUser")
        .firstName("firstTest")
        .lastName("firstTest")
        .password("encoded")
        .role(Role.USER)
        .build();

    dbSecondUser = User.builder()
        .id(2L)
        .username("secondUser")
        .firstName("secondTest")
        .lastName("secondTest")
        .password("encoded")
        .role(Role.USER)
        .build();

    dbChatRoom = new ChatRoom();
    dbChatRoom.setId(1L);
    dbChatRoom.setCreatedAt(LocalDateTime.now());
    dbChatRoom.setUpdatedAt(LocalDateTime.now());
    dbChatRoom.setUsers(Set.of(dbFirstUser, dbSecondUser));
    dbChatRoom.setUserPairKey("1_2");
  }

  @Test
  public void getChatRoomByUsersWhenExists() {
    when(authenticationService.getAuthenticatedCurrentUser()).thenReturn(dbFirstUser);
    when(userService.findUserById(dbSecondUser.getId())).thenReturn(dbSecondUser);

    try (MockedStatic<ChatRoom> mockedStatic = Mockito.mockStatic(ChatRoom.class)) {
      mockedStatic.when(() -> ChatRoom.generateUserPairKey(Set.of(dbFirstUser, dbSecondUser))).thenReturn("1_2");
      when(chatRoomRepository.findByUserPairKey("1_2")).thenReturn(Optional.of(dbChatRoom));

      ChatRoom result = chatRoomService.getChatRoomByUsers(dbSecondUser.getId());

      assertNotNull(result);
      assertEquals(dbChatRoom.getId(), result.getId());
      assertEquals(dbChatRoom.getUserPairKey(), result.getUserPairKey());
    }
  }

  @Test
  public void getChatRoomByUsersWhenDoesNotExist() {
    when(authenticationService.getAuthenticatedCurrentUser()).thenReturn(dbFirstUser);
    when(userService.findUserById(dbSecondUser.getId())).thenReturn(dbSecondUser);

    try (MockedStatic<ChatRoom> mockedStatic = Mockito.mockStatic(ChatRoom.class)) {
      mockedStatic.when(() -> ChatRoom.generateUserPairKey(Set.of(dbFirstUser, dbSecondUser))).thenReturn("1_2");
      when(chatRoomRepository.findByUserPairKey("1_2")).thenReturn(Optional.empty());

      EntityNotFoundException exception = assertThrows(EntityNotFoundException.class,
          () -> chatRoomService.getChatRoomByUsers(dbSecondUser.getId()));

      assertTrue(exception.getMessage().equals("You don't have chatroom with this user " + dbSecondUser.getId()));
    }
  }

  @Test
  public void deleteChatRoomByIdWhenExists() {
    when(chatRoomRepository.existsById(dbChatRoom.getId())).thenReturn(true);
    doNothing().when(chatRoomRepository).deleteById(dbChatRoom.getId());

    chatRoomService.deleteChatRoomById(dbChatRoom.getId());
    verify(chatRoomRepository, times(1)).deleteById(dbChatRoom.getId());
  }

  @Test
  public void deleteChatRoomByIdWhenDoesNotExist() {
    when(chatRoomRepository.existsById(dbChatRoom.getId())).thenReturn(false);
    chatRoomService.deleteChatRoomById(dbChatRoom.getId());
    verify(chatRoomRepository, times(0)).deleteById(dbChatRoom.getId());
  }

  @Test
  public void getChatRoomByIdWhenExists() {
    when(chatRoomRepository.findById(dbChatRoom.getId())).thenReturn(Optional.of(dbChatRoom));
    ChatRoom chatRoom = chatRoomService.getChatRoomById(dbChatRoom.getId());
    assertNotNull(chatRoom);
    assertEquals(dbChatRoom.getId(), chatRoom.getId());
    assertEquals(dbChatRoom.getUserPairKey(), chatRoom.getUserPairKey());
  }

  @Test
  public void getChatRoomByIdWhenDoesNotExist() {
    when(chatRoomRepository.findById(dbChatRoom.getId()))
        .thenThrow(new EntityNotFoundException("ChatRoom not found with id " + dbChatRoom.getId()));

    EntityNotFoundException exception = assertThrows(EntityNotFoundException.class,
        () -> chatRoomService.getChatRoomById(dbChatRoom.getId()));

    assertTrue(exception.getMessage().equals("ChatRoom not found with id " + dbChatRoom.getId()));
  }

  @Test
  public void createChatRoomWhenDoesNotExist() {
    when(authenticationService.getAuthenticatedCurrentUser()).thenReturn(dbFirstUser);
    when(userService.findUserById(dbSecondUser.getId())).thenReturn(dbSecondUser);
    try (MockedStatic<ChatRoom> mockedStatic = Mockito.mockStatic(ChatRoom.class)) {
      mockedStatic.when(() -> ChatRoom.generateUserPairKey(Set.of(dbFirstUser, dbSecondUser))).thenReturn("1_2");
      when(chatRoomRepository.existsByUserPairKey("1_2")).thenReturn(false);
      when(chatRoomRepository.save(isA(ChatRoom.class))).thenReturn(dbChatRoom);

      ChatRoom newChatRoom = chatRoomService.createChatRoom(dbSecondUser.getId());

      assertEquals(1L, newChatRoom.getId());
      assertEquals(2, newChatRoom.getUsers().size());
      assertEquals("1_2", newChatRoom.getUserPairKey());
      assertTrue(newChatRoom.getUsers().contains(dbFirstUser));
      assertTrue(newChatRoom.getUsers().contains(dbSecondUser));
    }
  }

  @Test
  public void createChatRoomWhenUserPairKeyExists() {
    when(authenticationService.getAuthenticatedCurrentUser()).thenReturn(dbFirstUser);
    when(userService.findUserById(dbSecondUser.getId())).thenReturn(dbSecondUser);
    try (MockedStatic<ChatRoom> mockedStatic = Mockito.mockStatic(ChatRoom.class)) {
      mockedStatic.when(() -> ChatRoom.generateUserPairKey(Set.of(dbFirstUser, dbSecondUser))).thenReturn("1_2");
      when(chatRoomRepository.existsByUserPairKey("1_2")).thenReturn(true);

      EntityExistsException exception = assertThrows(EntityExistsException.class,
          () -> chatRoomService.createChatRoom(dbSecondUser.getId()));

      assertTrue(exception.getMessage().equals("There is already chatroom between these users"));
    }
  }
}
