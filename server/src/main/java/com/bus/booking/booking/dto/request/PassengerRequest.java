package com.bus.booking.booking.dto.request;

import lombok.Data;

@Data
public class PassengerRequest {

    private Long seatId;

    private String passengerName;

    private Integer passengerAge;

    private String passengerGender;
}