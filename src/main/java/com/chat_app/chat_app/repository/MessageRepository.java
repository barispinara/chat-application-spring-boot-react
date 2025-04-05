package com.chat_app.chat_app.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.chat_app.chat_app.model.Message;

import jakarta.persistence.EntityNotFoundException;
import com.chat_app.chat_app.model.ChatRoom;

@Repository
public interface MessageRepository extends CrudRepository<Message, Long> {
  default Message findByIdOrThrow(Long id) {
    return findById(id).orElseThrow(() -> new EntityNotFoundException("Message not found with id " + id));
  }

  List<Message> findAllByChatRoom(ChatRoom chatRoom);

  Optional<Message> findFirstByChatRoomOrderBySentAt(ChatRoom chatRoom);

  default Message findLatestMessageOrThrow(ChatRoom chatRoom) {
    return findFirstByChatRoomOrderBySentAt(chatRoom).orElseThrow(() -> new EntityNotFoundException(
        "The latest message not found with given chatroom " + chatRoom.getChatIdName()));
  }
}
