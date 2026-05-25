package com.bus.booking.schedule.dto.request;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class CreateScheduleRequest {

    private Long busId;

    private LocalDate travelDate;

    private LocalDateTime departureTime;

    private LocalDateTime arrivalTime;

    private Double fare;
}