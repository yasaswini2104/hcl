package com.bus.booking.booking.repository;

import com.bus.booking.booking.entity.BookingSeat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingSeatRepository extends JpaRepository<BookingSeat, Long> {
    List<BookingSeat>
    findBySeat_IdAndBooking_Schedule_Id(
            Long seatId,
            Long scheduleId
    );
}