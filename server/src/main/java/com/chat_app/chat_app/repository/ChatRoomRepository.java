package com.chat_app.chat_app.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.chat_app.chat_app.model.ChatRoom;

@Repository
public interface ChatRoomRepository extends CrudRepository<ChatRoom, Long> {
  Optional<ChatRoom> findByUserPairKey(String userPairKey);

  Boolean existsByUserPairKey(String userPairKey);

  // Fetch all chat rooms where the given user is a participant
  List<ChatRoom> findByUsers_Id(Long userId);
}