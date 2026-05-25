package com.bus.booking.booking.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class CreateBookingRequest {

    private Long scheduleId;

    private List<PassengerRequest> passengers;
}