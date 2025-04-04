package com.chat_app.chat_app.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.chat_app.chat_app.model.Message;

import jakarta.persistence.EntityNotFoundException;

@Repository
public interface MessageRepository extends CrudRepository<Message, Long> {
  default Message findByIdOrThrow(Long id) {
    return findById(id).orElseThrow(() -> new EntityNotFoundException("Message not found with id " + id));
  }

}
