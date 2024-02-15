package com.KL1verse.match.scheduler.service;

import com.KL1verse.match.kafka.producer.KafkaMatchNotificationProducer;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ScheduledFuture;

import com.KL1verse.match.match.dto.res.TimelineResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.Trigger;
import org.springframework.scheduling.TriggerContext;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class SchedulerService {

    private final ThreadPoolTaskScheduler taskScheduler;
    private final Map<Integer, ScheduledFuture<?>> scheduledTasks = new HashMap<>();
    private final KafkaMatchNotificationProducer kafkaMatchNotificationProducer;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper;

    // 동적으로 스케줄된 작업을 예약
    public void scheduleTaskNotification(String cronExpression, int matchId) {
        Runnable task = () -> {
            log.info("matchId: {} 경기가 30분 전입니다.", matchId);

            // 여기에 원하는 작업 수행
            kafkaMatchNotificationProducer.matchNotification(matchId);

        };

        // 스케줄된 작업 예약
        ScheduledFuture<?> scheduledTask = taskScheduler.schedule(task, new Trigger() {
            @Override
            public Instant nextExecution(TriggerContext triggerContext) {
                CronTrigger crontrigger = new CronTrigger(cronExpression);
                return crontrigger.nextExecution(triggerContext);
            }
        });
    }

    public void scheduleTaskCrawl(String cronExpression, int matchId) {
        Runnable task = () -> {
            log.info("경기 크롤링 Start = {}", matchId);

            // 여기에 원하는 작업 수행
            scheduleCrawl(matchId);

        };

        // 스케줄된 작업 예약
        ScheduledFuture<?> scheduledTask = taskScheduler.schedule(task, new Trigger() {
            @Override
            public Instant nextExecution(TriggerContext triggerContext) {
                CronTrigger crontrigger = new CronTrigger(cronExpression);
                return crontrigger.nextExecution(triggerContext);
            }
        });
    }

    public void scheduleCrawl(int matchId) {
        Runnable task = () -> {
            log.info("경기 크롤링 Start = {}", matchId);

            // 여기에 원하는 작업 수행
            crawlMatch(matchId);

        };

        // 스케줄된 작업 예약
        ScheduledFuture<?> scheduledTask = taskScheduler.schedule(task, new Trigger() {
            @Override
            public Instant nextExecution(TriggerContext triggerContext) {
                CronTrigger crontrigger = new CronTrigger("0/2 * * * * *");
                return crontrigger.nextExecution(triggerContext);
            }
        });
        scheduledTasks.put(matchId, scheduledTask);
    }

    // 동적으로 스케줄된 작업을 제거
    public void cancelAllScheduledTasks() {
        scheduledTasks.forEach((matchId, scheduledTask) -> {
            if (scheduledTask != null && !scheduledTask.isCancelled()) {
                scheduledTask.cancel(true);
            }
        });
        scheduledTasks.clear();
    }

    public void cancleScheduledTask(int matchId) {
        ScheduledFuture<?> scheduledTask = scheduledTasks.get(matchId);
        if (scheduledTask != null && !scheduledTask.isCancelled()) {
            scheduledTask.cancel(true);
            scheduledTasks.remove(matchId);
        }
    }

    public void crawlMatch(int matchId) {
        String url = "http://localhost:8080/timelines/" + matchId;
        String response = restTemplate.getForObject(url, String.class);
        log.info("response: {}", response);

        try {
            List<TimelineResponse> timelineResponse = Arrays.asList(objectMapper.readValue(response, TimelineResponse[].class));
            log.info("timelineResponse: {}", timelineResponse.size());
            if(timelineResponse.get(timelineResponse.size()-1).getEventName().equals("경기종료")) {
                cancleScheduledTask(matchId);
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
