package com.chat_app.chat_app.repository;

import com.chat_app.chat_app.model.User;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.data.repository.CrudRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {

  Optional<User> findByUsername(String username);

  default User findByUsernameOrThrow(String username) {
    return findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found with username " + username));
  }

  default User findByIdOrThrow(Long id) {
    return findById(id).orElseThrow(() -> new EntityNotFoundException("User not found with id " + id));
  }

  boolean existsByUsername(String username);
}