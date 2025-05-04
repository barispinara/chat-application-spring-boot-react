package com.chat_app.chat_app.controller;

import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import com.chat_app.chat_app.payload.dto_model.UserDTO;
import com.chat_app.chat_app.payload.response.ChatRoomResponse;
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
  static ChatRoomResponse chatRoomResponse;

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

    chatRoomResponse = ChatRoomResponse.builder()
            .id(1L)
            .createdAt(dbChatRoom.getCreatedAt())
            .updatedAt(dbChatRoom.getUpdatedAt())
            .users(
                    Set.of(
                            new UserDTO(dbFirstUser.getId(), dbFirstUser.getUsername(), dbFirstUser.getFirstName(), dbFirstUser.getLastName()),
                            new UserDTO(dbSecondUser.getId(), dbSecondUser.getUsername(), dbSecondUser.getFirstName(), dbSecondUser.getLastName())
                    )
            )
            .build();
  }

  @Test
  public void getChatRoomByUserWhenExists() throws Exception {
    when(chatRoomService.getChatRoomByUsers(dbSecondUser.getId())).thenReturn(dbChatRoom);
    when(chatRoomService.generateChatRoomResponseByChatRoom(dbChatRoom)).thenReturn(chatRoomResponse);

    mockMvc.perform(get("/chat/user/{user_id}", dbSecondUser.getId()))
        .andExpectAll(
            status().isOk(),
            jsonPath("$.id").value(1L),
            jsonPath("$.createdAt").exists(),
            jsonPath("$.updatedAt").exists(),
            jsonPath("$.users").isArray(),
            jsonPath("$.users", hasSize(2)),
            jsonPath("$.users[*].id", hasItems(1, 2)),
            jsonPath("$.users[*].username", hasItems("firstUser", "secondUser")),
            jsonPath("$.users[*].firstName", hasItems("firstTest", "secondTest")),
            jsonPath("$.users[*].lastName", hasItems("firstTest", "secondTest")),
            jsonPath("$.users[*].password").doesNotExist());

    verify(chatRoomService).getChatRoomByUsers(dbSecondUser.getId());
  }

  @Test
  public void getChatRoomByIdWhenExists() throws Exception {
    when(chatRoomService.getChatRoomById(dbChatRoom.getId())).thenReturn(dbChatRoom);
    when(chatRoomService.generateChatRoomResponseByChatRoom(dbChatRoom)).thenReturn(chatRoomResponse);

    mockMvc.perform(get("/chat/{chat_id}", dbChatRoom.getId()))
        .andExpectAll(
            status().isOk(),
            jsonPath("$.id").value(1L),
            jsonPath("$.createdAt").exists(),
            jsonPath("$.updatedAt").exists(),
            jsonPath("$.users").isArray(),
            jsonPath("$.users", hasSize(2)),
            jsonPath("$.users[*].id", hasItems(1, 2)),
            jsonPath("$.users[*].username", hasItems("firstUser", "secondUser")),
            jsonPath("$.users[*].firstName", hasItems("firstTest", "secondTest")),
            jsonPath("$.users[*].lastName", hasItems("firstTest", "secondTest")),
            jsonPath("$.users[*].password").doesNotExist());

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

  @Test
  public void createChatRoom() throws Exception {
    when(chatRoomService.createChatRoom(dbSecondUser.getId())).thenReturn(dbChatRoom);
    when(chatRoomService.generateChatRoomResponseByChatRoom(dbChatRoom)).thenReturn(chatRoomResponse);

    mockMvc.perform(post("/chat/create/{user_id}", dbSecondUser.getId()))
        .andExpectAll(
            status().isOk(),
            jsonPath("$.id").value(1L),
            jsonPath("$.createdAt").exists(),
            jsonPath("$.updatedAt").exists(),
            jsonPath("$.users").isArray(),
            jsonPath("$.users", hasSize(2)),
            jsonPath("$.users[*].id", hasItems(1, 2)),
            jsonPath("$.users[*].username", hasItems("firstUser", "secondUser")),
            jsonPath("$.users[*].firstName", hasItems("firstTest", "secondTest")),
            jsonPath("$.users[*].lastName", hasItems("firstTest", "secondTest")),
            jsonPath("$.users[*].password").doesNotExist());

    verify(chatRoomService).createChatRoom(dbSecondUser.getId());
  }

  @Test
  public void getAllChatRoomsOfUser() throws Exception {
    when(chatRoomService.getAllChatRoomsOfUser()).thenReturn(List.of(dbChatRoom));
    when(chatRoomService.generateChatRoomResponseByChatRoom(dbChatRoom)).thenReturn(chatRoomResponse);

    mockMvc.perform(get("/chat/user/all"))
            .andExpectAll(
                    status().isOk(),
                    jsonPath("$[0].id").value(1),
                    jsonPath("$[0].users", hasSize(2))
            );
  }

}
