package com.handshaker.notification_service.service;

import com.handshaker.notification_service.config.RabbitConfig;
import com.handshaker.notification_service.events.UserNotificationEvent;
import com.handshaker.notification_service.model.Notification;
import com.handshaker.notification_service.repository.NotificationRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final NotificationRepository repository;

    public NotificationService(NotificationRepository repository) {
        this.repository = repository;
    }

    @RabbitListener(queues = RabbitConfig.NOTIFICATIONS_QUEUE)
    public void handleNotification(UserNotificationEvent event) {

        Notification notification = new Notification();
        notification.setUserId(event.getUserId());
        notification.setMessage(event.getMessage());

        repository.save(notification);
    }
}

