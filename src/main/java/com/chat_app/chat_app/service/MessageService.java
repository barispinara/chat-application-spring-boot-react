package com.chat_app.chat_app.service;

import org.springframework.stereotype.Service;

import com.chat_app.chat_app.model.Message;
import com.chat_app.chat_app.model.User;
import com.chat_app.chat_app.repository.MessageRepository;

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
