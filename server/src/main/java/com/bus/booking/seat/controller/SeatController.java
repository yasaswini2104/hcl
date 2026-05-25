package com.bus.booking.seat.controller;

import com.bus.booking.booking.entity.BookingSeat;
import com.bus.booking.booking.repository.BookingSeatRepository;
import com.bus.booking.common.response.ApiResponse;
import com.bus.booking.seat.entity.Seat;
import com.bus.booking.seat.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/seats")
public class SeatController {

    private final SeatRepository seatRepository;
    private final BookingSeatRepository bookingSeatRepository;

    @GetMapping("/bus/{busId}/schedule/{scheduleId}")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>>
    getSeatsForSchedule(
            @PathVariable Long busId,
            @PathVariable Long scheduleId
    ) {

        List<Seat> seats = seatRepository.findByBus_Id(busId);

        Set<Long> bookedSeatIds = new HashSet<>();
        for (Seat seat : seats) {
            List<BookingSeat> bookings =
                    bookingSeatRepository
                            .findBySeat_IdAndBooking_Schedule_Id(
                                    seat.getId(),
                                    scheduleId
                            );
            if (!bookings.isEmpty()) {
                bookedSeatIds.add(seat.getId());
            }
        }

        List<Map<String, Object>> result = seats.stream()
                .map(seat -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", seat.getId());
                    map.put("label", seat.getSeatNumber());
                    map.put("seatType", seat.getSeatType());
                    map.put("status",
                            bookedSeatIds.contains(seat.getId())
                                    ? "BOOKED"
                                    : "AVAILABLE");
                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(
                ApiResponse.<List<Map<String, Object>>>builder()
                        .success(true)
                        .message("Seats fetched successfully")
                        .data(result)
                        .build()
        );
    }
}