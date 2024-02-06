package com.kl1verse.UserServer.domain.kafka.consumer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kl1verse.UserServer.domain.kafka.dto.req.BoardNotificationReqDto;
import com.kl1verse.UserServer.domain.kafka.dto.req.BoardNotificationReqDto.BoardNotificationType;
import com.kl1verse.UserServer.domain.kafka.dto.req.NotificationListReqDto;
import com.kl1verse.UserServer.domain.notification.dto.req.MessageReqDto;
import com.kl1verse.UserServer.domain.notification.dto.req.MessageReqDto.NotificationType;
import com.kl1verse.UserServer.domain.notification.service.NotificationService;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class KafkaBoardNotificationConsumer {

    private final NotificationService notificationService;

    @Autowired
    private ObjectMapper objectMapper;

//    @KafkaListener(topics = "board-notification", groupId = "user-group") // match-group아님, 현재 groupID !
    public void sendBoardNotification(String boardNotificationDataJson) {

        // userIdList를 받아서 알림 주기
        BoardNotificationReqDto boardNotificationReqDto = null;

        try {
            boardNotificationReqDto = objectMapper.readValue(boardNotificationDataJson,
                BoardNotificationReqDto.class);

            Integer userId = boardNotificationReqDto.getUserId();
            MessageReqDto messageReqDto = MessageReqDto.builder()
                .type(boardNotificationReqDto.getType() == BoardNotificationType.COMMENT ? NotificationType.COMMENT : NotificationType.LIKE)
                .message(boardNotificationReqDto.getMessage())
                .uri(boardNotificationReqDto.getUri())
                .userId(userId)
                .date(LocalDateTime.now())
                .build();

            notificationService.sendNotification(messageReqDto);

        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
    }
}
