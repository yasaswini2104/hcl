package com.bus.booking.booking.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookingResponse {

    private String bookingReference;

    private String bookingStatus;

    private Double totalAmount;
}