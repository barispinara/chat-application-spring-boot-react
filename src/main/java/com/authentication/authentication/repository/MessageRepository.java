package com.authentication.authentication.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.authentication.authentication.model.Message;

@Repository
public interface MessageRepository extends CrudRepository<Message, Long> {
}
