package com.bus.booking.schedule.repository;

import com.bus.booking.schedule.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ScheduleRepository
        extends JpaRepository<Schedule, Long> {

    List<Schedule>
    findByBus_Route_SourceCityAndBus_Route_DestinationCityAndTravelDate(
            String sourceCity,
            String destinationCity,
            LocalDate travelDate
    );
}