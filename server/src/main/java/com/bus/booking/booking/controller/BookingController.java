package com.bus.booking.booking.controller;

import com.bus.booking.booking.dto.request.CreateBookingRequest;
import com.bus.booking.booking.dto.response.BookingResponse;
import com.bus.booking.booking.service.BookingService;
import com.bus.booking.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>>
    createBooking(
            @RequestBody CreateBookingRequest request,
            Authentication authentication
    ) {

        String email = authentication.getName();

        BookingResponse response = bookingService.createBooking(
                        email,
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.<BookingResponse>builder()
                        .success(true)
                        .message("Booking successful")
                        .data(response)
                        .build()
        );
    }

    @DeleteMapping("/{bookingId}")
    public ResponseEntity<ApiResponse<Object>>
    cancelBooking(
            @PathVariable Long bookingId,
            Authentication authentication
    ) {
        String email = authentication.getName();
        bookingService.cancelBooking(
                bookingId,
                email
        );

        return ResponseEntity.ok(
                ApiResponse.builder()
                        .success(true)
                        .message("Booking cancelled successfully")
                        .build()
        );
    }

    @GetMapping("/user")
    public ResponseEntity<ApiResponse<?>>
    getUserBookings(
            Authentication authentication
    ) {
        String email = authentication.getName();
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .success(true)
                        .message("Bookings fetched successfully")
                        .data(
                                bookingService
                                        .getUserBookings(email)
                        )
                        .build()
        );
    }
}