package com.chat_app.chat_app.controller;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.chat_app.chat_app.model.ChatRoom;
import com.chat_app.chat_app.model.Message;
import com.chat_app.chat_app.model.Role;
import com.chat_app.chat_app.model.User;
import com.chat_app.chat_app.payload.dto_model.MessageDTO;
import com.chat_app.chat_app.payload.request.SendMessageRequest;
import com.chat_app.chat_app.service.JwtService;
import com.chat_app.chat_app.service.MessageService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.SerializationFeature;

@WebMvcTest(controllers = MessageController.class)
@AutoConfigureMockMvc(addFilters = false)
public class MessageControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @MockitoBean
  private MessageService messageService;

  @MockitoBean
  private JwtService jwtService;

  static ChatRoom dbChatRoom;
  static Message dbMessage;
  static MessageDTO messageDTO;
  static User dbFirstUser;
  static User dbSecondUser;
  static SendMessageRequest sendMessageRequest;
  static ObjectMapper mapper;
  static ObjectWriter ow;
  static Principal dPrincipal;

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
    dbChatRoom.setId(1L);
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
    dPrincipal = new Principal() {
      @Override
      public String getName() {
        return dbFirstUser.getUsername();
      }
    };

    mapper = new ObjectMapper().configure(SerializationFeature.WRAP_ROOT_VALUE, false);
    ow = mapper.writer().withDefaultPrettyPrinter();
  }

  @Test
  public void getAllMessagesByChatRoomControllerWhenExists() throws Exception {
    when(messageService.getAllMessagesByChatRoom(dbChatRoom.getId())).thenReturn(List.of(messageDTO));

    mockMvc.perform(get("/message/all/{chat_id}", dbChatRoom.getId()))
        .andExpectAll(
            status().isOk(),
            content().json(ow.writeValueAsString(List.of(messageDTO))));

    verify(messageService).getAllMessagesByChatRoom(dbChatRoom.getId());
  }

  @Test
  public void getAllMessagesByChatRoomControllerWhenDoesNotExists() throws Exception {
    when(messageService.getAllMessagesByChatRoom(dbChatRoom.getId())).thenReturn(List.of());

    mockMvc.perform(get("/message/all/{chat_id}", dbChatRoom.getId()))
        .andExpectAll(
            status().isOk(),
            content().json(ow.writeValueAsString(List.of())));

    verify(messageService).getAllMessagesByChatRoom(dbChatRoom.getId());
  }

  @Test
  public void getLatestMessageByChatRoomControllerWhenExists() throws Exception {
    when(messageService.getLatestMessageByChatRoom(dbChatRoom.getId())).thenReturn(Optional.of(messageDTO));

    mockMvc.perform(get("/message/{chat_id}", dbChatRoom.getId()))
        .andExpectAll(
            status().isOk(),
            content().json(ow.writeValueAsString(messageDTO)));

    verify(messageService).getLatestMessageByChatRoom(dbChatRoom.getId());
  }

  @Test
  public void getLatestMessageByChatRoomControllerWhenDoesNotExists() throws Exception {
    when(messageService.getLatestMessageByChatRoom(dbChatRoom.getId())).thenReturn(Optional.empty());

    mockMvc.perform(get("/message/{chat_id}", dbChatRoom.getId()))
        .andExpectAll(
            status().isNotFound());

    verify(messageService).getLatestMessageByChatRoom(dbChatRoom.getId());
  }

}
