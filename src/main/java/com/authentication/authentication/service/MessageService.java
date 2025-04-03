package com.authentication.authentication.service;

import org.springframework.stereotype.Service;

import com.authentication.authentication.model.Message;
import com.authentication.authentication.model.User;
import com.authentication.authentication.repository.MessageRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;

    public Message createMessage(String content,
            User senderUser,
            User receiverUser) {

        Message createdMessage = Message.builder()
                .content(content)
                .sender(senderUser)
                .receiver(receiverUser)
                .build();

        return messageRepository.save(createdMessage);
    }

}
