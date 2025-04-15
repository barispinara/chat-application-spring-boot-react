package com.chat_app.chat_app.controller;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;
import java.util.Set;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.chat_app.chat_app.model.ChatRoom;
import com.chat_app.chat_app.model.Role;
import com.chat_app.chat_app.model.User;
import com.chat_app.chat_app.service.ChatRoomService;
import com.chat_app.chat_app.service.JwtService;

import jakarta.persistence.EntityNotFoundException;

@WebMvcTest(controllers = ChatRoomController.class)
@AutoConfigureMockMvc(addFilters = false)
public class ChatRoomControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @MockitoBean
  private ChatRoomService chatRoomService;

  @MockitoBean
  private JwtService jwtService;

  static User dbFirstUser;
  static User dbSecondUser;
  static ChatRoom dbChatRoom;

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
    dbChatRoom.setUsers(Set.of(dbFirstUser, dbSecondUser));
    dbChatRoom.setUserPairKey("1_2");
    dbChatRoom.setId(1L);
    dbChatRoom.setCreatedAt(LocalDateTime.now());
    dbChatRoom.setUpdatedAt(LocalDateTime.now());
  }

  @Test
  public void getOrCreateChatRoomByUserWhenExists() throws Exception {
    when(chatRoomService.getOrCreateChatRoomByUsers(dbSecondUser.getId())).thenReturn(dbChatRoom);

    mockMvc.perform(get("/chat/user/{user_id}", dbSecondUser.getId()))
        .andExpectAll(
            status().isOk());

    verify(chatRoomService).getOrCreateChatRoomByUsers(dbSecondUser.getId());
  }

  @Test
  public void getChatRoomByIdWhenExists() throws Exception {
    when(chatRoomService.getChatRoomById(dbChatRoom.getId())).thenReturn(dbChatRoom);

    mockMvc.perform(get("/chat/{chat_id}", dbChatRoom.getId()))
        .andExpectAll(
            status().isOk());

    verify(chatRoomService).getChatRoomById(dbChatRoom.getId());
  }

  @Test
  public void getChatRoomByIdWhenDoesNotExists() throws Exception {
    Long dummyId = 2L;
    when(chatRoomService.getChatRoomById(dummyId))
        .thenThrow(new EntityNotFoundException("ChatRoom not found with id " + dummyId));

    mockMvc.perform(get("/chat/{chat_id}", dummyId))
        .andExpectAll(
            status().isNotFound(),
            jsonPath("$.message").value("ChatRoom not found with id " + dummyId));

    verify(chatRoomService).getChatRoomById(dummyId);
  }

}
