package com.bus.booking.seat.repository;
import com.bus.booking.seat.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SeatRepository
        extends JpaRepository<Seat, Long> {

    List<Seat> findByBus_Id(Long busId);
}
