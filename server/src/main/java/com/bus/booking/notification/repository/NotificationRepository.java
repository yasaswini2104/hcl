package com.bus.booking.notification.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bus.booking.notification.entity.Notification;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification>
    findByUser_IdOrderByCreatedAtDesc(Long userId);
}