package com.authentication.authentication.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Message")
public class Message {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "sender", unique = false, nullable = false)
  private User sender;

  @Column(name = "receiver", unique = false, nullable = false)
  private User receiver;

  @Column(name = "sended_at", unique = false, nullable = false)
  private String sendedAt;

  @Column(name = "is_seen", unique = false, nullable = false)
  private Boolean isSeen;
}
