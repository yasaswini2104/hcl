package com.bus.booking.booking.service;

import com.bus.booking.booking.dto.request.CreateBookingRequest;
import com.bus.booking.booking.dto.response.BookingResponse;

import java.util.List;

public interface BookingService {

    BookingResponse createBooking(
            String email,
            CreateBookingRequest request
    );

    void cancelBooking(
            Long bookingId,
            String email
    );

    List<BookingResponse> getUserBookings(String email);
}