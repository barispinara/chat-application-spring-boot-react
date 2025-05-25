package com.chat_app.chat_app.model;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "chat_room", uniqueConstraints = @UniqueConstraint(columnNames = { "user_pair_key" }))
public class ChatRoom {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "created_at", updatable = false)
  @CreationTimestamp
  private LocalDateTime createdAt;

  @Column(name = "updated_at", updatable = true)
  @UpdateTimestamp
  private LocalDateTime updatedAt;

  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(name = "chatroom_users", joinColumns = @JoinColumn(name = "chatroom_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
  private Set<User> users = new HashSet<>();

  // Enforcing uniqueness
  @Column(name = "user_pair_key", nullable = false, unique = true)
  private String userPairKey;

  // Overriding set method from Lombok @Setter
  public void setUsers(Set<User> users) {
    if (users == null || users.size() != 2) {
      throw new IllegalArgumentException("Chatroom must have exactly 2 users.");
    }

    this.users = users;
    this.userPairKey = generateUserPairKey(users);
  }

  public static String generateUserPairKey(Set<User> users) {
    return users.stream()
        .map(user -> user.getId().toString())
        .sorted()
        .collect(Collectors.joining("_"));
  }

}
