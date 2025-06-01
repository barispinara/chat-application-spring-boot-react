package com.chat_app.chat_app.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.chat_app.chat_app.model.ChatRoom;
import com.chat_app.chat_app.model.Message;
import com.chat_app.chat_app.model.Role;
import com.chat_app.chat_app.model.User;
import com.chat_app.chat_app.payload.dto_model.MessageDTO;
import com.chat_app.chat_app.payload.request.SendMessageRequest;
import com.chat_app.chat_app.repository.MessageRepository;

@ExtendWith(MockitoExtension.class)
public class MessageServiceTest {
  @Mock
  private MessageRepository messageRepository;

  @Mock
  private ChatRoomService chatRoomService;

  @Mock
  private SimpMessagingTemplate simpMessagingTemplate;

  @Mock
  private UserService userService;

  @InjectMocks
  private MessageService messageService;

  static ChatRoom dbChatRoom;
  static Message dbMessage;
  static MessageDTO messageDTO;
  static User dbFirstUser;
  static User dbSecondUser;
  static SendMessageRequest sendMessageRequest;
  static String messageExpectedPathPrefix = "/topic/messages/";
  static String notificationExpectedPathPrefix = "/notification";

  @BeforeAll
  static void setup() {
    dbFirstUser = User.builder()
        .id(1L)
        .username("firstUser")
        .firstName("firstTest")
        .lastName("firstTest")
        .password("encoded")
        .lastSeen(null)
        .role(Role.USER)
        .build();

    dbSecondUser = User.builder()
        .id(1L)
        .username("secondUser")
        .firstName("secondTest")
        .lastName("secondTest")
        .password("encoded")
        .lastSeen(null)
        .role(Role.USER)
        .build();

    dbChatRoom = new ChatRoom();
    dbChatRoom.setUsers(Set.of(dbFirstUser, dbSecondUser));
    dbChatRoom.setUserPairKey("1_2");

    dbMessage = Message.builder()
        .id(1L)
        .content("Test")
        .sender(dbFirstUser)
        .isSeen(false)
        .chatRoom(dbChatRoom)
        .build();

    messageDTO = new MessageDTO(dbMessage);

    sendMessageRequest = SendMessageRequest.builder()
        .content("Test")
        .chatId(dbChatRoom.getId())
        .build();
  }

  @Test
  public void sendMessageTest() {
    when(userService.findUserByUsername(dbFirstUser.getUsername())).thenReturn(dbFirstUser);
    when(chatRoomService.getChatRoomById(dbChatRoom.getId())).thenReturn(dbChatRoom);
    when(messageRepository.save(any(Message.class))).thenReturn(dbMessage);

    String expectedPathForMessage = messageExpectedPathPrefix + dbChatRoom.getId();

    messageService.sendMessage(sendMessageRequest, dbFirstUser.getUsername());

    verify(simpMessagingTemplate, times(1)).convertAndSend(expectedPathForMessage, messageDTO);
    verify(simpMessagingTemplate, times(dbChatRoom.getUsers().size() - 1)).convertAndSendToUser(
        dbSecondUser.getUsername(),
        notificationExpectedPathPrefix, "New message from " + dbFirstUser.getUsername());
  }

  @Test
  public void getAllMessagesByChatRoomWhenExists() {
    when(chatRoomService.getChatRoomById(dbChatRoom.getId())).thenReturn(dbChatRoom);
    when(messageRepository.findAllByChatRoom(dbChatRoom)).thenReturn(List.of(dbMessage));

    List<MessageDTO> expectedMessageList = messageService.getAllMessagesByChatRoom(dbChatRoom.getId());

    assertEquals(expectedMessageList.size(), 1);
    assertEquals(expectedMessageList, List.of(messageDTO));
    assertNotNull(expectedMessageList);
  }

  @Test
  public void getAllMessagesByChatRoomWhenDoesNotExist() {
    when(chatRoomService.getChatRoomById(dbChatRoom.getId())).thenReturn(dbChatRoom);
    when(messageRepository.findAllByChatRoom(dbChatRoom)).thenReturn(List.of());

    List<MessageDTO> expectedMessageList = messageService.getAllMessagesByChatRoom(dbChatRoom.getId());

    assertEquals(expectedMessageList.size(), 0);
    assertEquals(expectedMessageList, List.of());
  }

  @Test
  public void getLatestMessageByChatRoomWhenExists() {
    when(chatRoomService.getChatRoomById(dbChatRoom.getId())).thenReturn(dbChatRoom);
    when(messageRepository.findLatestByChatRoom(dbChatRoom)).thenReturn(Optional.of(dbMessage));

    Optional<MessageDTO> message = messageService.getLatestMessageByChatRoom(dbChatRoom.getId());

    assertNotEquals(Optional.empty(), message);
    assertEquals(Optional.of(messageDTO), message);
  }

  @Test
  public void getLatestMessageByChatRoomWhenDoesNotExist() {
    when(chatRoomService.getChatRoomById(dbChatRoom.getId())).thenReturn(dbChatRoom);
    when(messageRepository.findLatestByChatRoom(dbChatRoom)).thenReturn(Optional.empty());

    Optional<MessageDTO> message = messageService.getLatestMessageByChatRoom(dbChatRoom.getId());

    assertEquals(Optional.empty(), message);
  }
}
