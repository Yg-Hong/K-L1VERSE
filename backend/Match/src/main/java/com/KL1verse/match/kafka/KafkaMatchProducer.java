package com.KL1verse.match.kafka;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Component
@RequiredArgsConstructor
@Service
public class KafkaMatchProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;

    @Async
    public void sendMessage(String topic, String message) {
        kafkaTemplate.send(topic, message);
    }
}