package com.chat_app.chat_app.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.chat_app.chat_app.model.ChatRoom;

import jakarta.persistence.EntityNotFoundException;
import com.chat_app.chat_app.model.User;
import java.util.Set;

@Repository
public interface ChatRoomRepository extends CrudRepository<ChatRoom, Long> {

  default ChatRoom findByIdOrThrow(Long id) {
    return findById(id).orElseThrow(() -> new EntityNotFoundException("Chatroom not found with id " + id));
  }

  Optional<ChatRoom> findByChatIdName(String chatIdName);

  default ChatRoom findByChatIdNameOrThrow(String chatIdName) {
    return findByChatIdName(chatIdName)
        .orElseThrow(() -> new EntityNotFoundException("Chatroom not found with given chat id name " + chatIdName));
  }

  List<ChatRoom> findByParticipantsContaining(User user);
}
