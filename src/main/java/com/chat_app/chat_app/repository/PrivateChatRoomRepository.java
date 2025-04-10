package com.chat_app.chat_app.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.chat_app.chat_app.model.PrivateChatRoom;
import com.chat_app.chat_app.model.User;

@Repository
public interface PrivateChatRoomRepository extends CrudRepository<PrivateChatRoom, Long> {

  @Query("""
        SELECT c FROM PrivateChatRoom c
        WHERE :user1 MEMBER OF c.participants
        AND :user2 MEMBER OF c.participants
        AND SIZE(c.participants) = 2
      """)
  Optional<PrivateChatRoom> findPrivateChatRoomByUsers(@Param("user1") User user1, @Param("user2") User user2);

  @Query("""
          SELECT COUNT(c) > 0 FROM PrivateChatRoom c
          WHERE :user1 MEMBER OF c.participants
          AND :user2 MEMBER OF c.participants
          AND SIZE(c.participants) = 2
      """)
  boolean existsPrivateChatRoomByUsers(@Param("user1") User user1, @Param("user2") User user2);
}
