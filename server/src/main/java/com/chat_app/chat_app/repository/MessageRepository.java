package com.chat_app.chat_app.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.chat_app.chat_app.model.ChatRoom;
import com.chat_app.chat_app.model.Message;

@Repository
public interface MessageRepository extends CrudRepository<Message, Long> {
  List<Message> findAllByChatRoom(ChatRoom chatRoom);

  @Query("""
          SELECT m from Message m
          WHERE m.chatRoom = :chatRoom
          ORDER BY m.sentAt
          DESC LIMIT 1
      """)
  Optional<Message> findLatestByChatRoom(@Param("chatRoom") ChatRoom chatRoom);
}
