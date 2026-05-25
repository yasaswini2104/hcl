package com.bus.booking.schedule.service;

import com.bus.booking.schedule.dto.request.CreateScheduleRequest;
import com.bus.booking.schedule.entity.Schedule;

import java.time.LocalDate;
import java.util.List;

public interface ScheduleService {

    Schedule createSchedule(CreateScheduleRequest request);

    List<Schedule> searchSchedules(
            String sourceCity,
            String destinationCity,
            LocalDate travelDate
    );

    List<Schedule> getAllSchedules();

    Schedule getScheduleById(Long id);
}