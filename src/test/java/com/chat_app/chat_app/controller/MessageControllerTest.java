package com.chat_app.chat_app.controller;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.chat_app.chat_app.model.ChatRoom;
import com.chat_app.chat_app.model.Message;
import com.chat_app.chat_app.model.Role;
import com.chat_app.chat_app.model.User;
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
  static User dbFirstUser;
  static User dbSecondUser;
  static SendMessageRequest sendMessageRequest;
  static ObjectMapper mapper;
  static ObjectWriter ow;

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
        .id(1L)
        .username("secondUser")
        .firstName("secondTest")
        .lastName("secondTest")
        .password("encoded")
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

    sendMessageRequest = SendMessageRequest.builder()
        .content("Test")
        .chatId(dbChatRoom.getId())
        .build();

    mapper = new ObjectMapper().configure(SerializationFeature.WRAP_ROOT_VALUE, false);
    ow = mapper.writer().withDefaultPrettyPrinter();
  }

  @Test
  public void sendMessageControllerTest() throws Exception {
    when(messageService.sendMessage(sendMessageRequest)).thenReturn(dbMessage);

    String requestJson = ow.writeValueAsString(sendMessageRequest);

    mockMvc.perform(post("/message/create")
        .contentType(MediaType.APPLICATION_JSON)
        .content(requestJson))
        .andExpectAll(
            status().isOk());

    verify(messageService).sendMessage(sendMessageRequest);
  }

  @Test
  public void getAllMessagesByChatRoomControllerWhenExists() throws Exception {
    when(messageService.getAllMessagesByChatRoom(dbChatRoom.getId())).thenReturn(List.of(dbMessage));

    mockMvc.perform(get("/message/all/{chat_id}", dbChatRoom.getId()))
        .andExpectAll(
            status().isOk(),
            content().json(ow.writeValueAsString(List.of(dbMessage))));

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
    when(messageService.getLatestMessageByChatRoom(dbChatRoom.getId())).thenReturn(Optional.of(dbMessage));

    mockMvc.perform(get("/message/{chat_id}", dbChatRoom.getId()))
        .andExpectAll(
            status().isOk(),
            content().json(ow.writeValueAsString(dbMessage)));

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
