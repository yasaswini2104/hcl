package com.bus.booking.booking.service.impl;

import com.bus.booking.auth.entity.User;
import com.bus.booking.auth.repository.UserRepository;
import com.bus.booking.booking.dto.request.*;
import com.bus.booking.booking.dto.response.BookingResponse;
import com.bus.booking.booking.entity.*;
import com.bus.booking.booking.repository.*;
import com.bus.booking.booking.service.BookingService;
import com.bus.booking.notification.service.NotificationService;
import com.bus.booking.audit.service.AuditService;
import com.bus.booking.schedule.entity.Schedule;
import com.bus.booking.schedule.repository.ScheduleRepository;
import com.bus.booking.seat.entity.Seat;
import com.bus.booking.seat.repository.SeatRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingServiceImpl
        implements BookingService {

    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;

    private final UserRepository userRepository;
    private final ScheduleRepository scheduleRepository;
    private final SeatRepository seatRepository;

    private final NotificationService notificationService;
    private final AuditService auditService;

    @Override
    @Transactional
    public BookingResponse createBooking(
            String email,
            CreateBookingRequest request
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Schedule schedule = scheduleRepository
                .findById(request.getScheduleId())
                .orElseThrow(() ->
                        new RuntimeException("Schedule not found"));

        int requestedSeats = request.getPassengers().size();

        if (schedule.getAvailableSeats() < requestedSeats) {

            log.warn("Insufficient seats available");

            throw new RuntimeException(
                    "Requested seats unavailable"
            );
        }

        Booking booking = Booking.builder()
                .bookingReference(UUID.randomUUID().toString())
                .user(user)
                .schedule(schedule)
                .bookingStatus("CONFIRMED")
                .totalAmount(
                        schedule.getFare() * requestedSeats
                )
                .build();

        bookingRepository.save(booking);

        List<BookingSeat> bookingSeats = new ArrayList<>();

        for (PassengerRequest passenger
                : request.getPassengers()) {

            Seat seat = seatRepository.findById(
                            passenger.getSeatId()
                    )
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Seat not found"
                            ));

            List<BookingSeat> existingBookings =
                    bookingSeatRepository
                            .findBySeat_IdAndBooking_Schedule_Id(
                                    seat.getId(),
                                    schedule.getId()
                            );

            if (!existingBookings.isEmpty()) {

                log.warn(
                        "Seat already booked: {}",
                        seat.getSeatNumber()
                );

                throw new RuntimeException(
                        "Seat already booked"
                );
            }

            BookingSeat bookingSeat =
                    BookingSeat.builder()
                            .booking(booking)
                            .seat(seat)
                            .passengerName(
                                    passenger.getPassengerName()
                            )
                            .passengerAge(
                                    passenger.getPassengerAge()
                            )
                            .passengerGender(
                                    passenger.getPassengerGender()
                            )
                            .build();

            bookingSeats.add(bookingSeat);
        }

        bookingSeatRepository.saveAll(bookingSeats);

        booking.setBookingSeats(bookingSeats);

        schedule.setAvailableSeats(
                schedule.getAvailableSeats()
                        - requestedSeats
        );

        scheduleRepository.save(schedule);

        notificationService.sendBookingConfirmation(
                user.getId(),
                user.getEmail(),
                booking.getBookingReference()
        );

        auditService.logAction(
                "BOOKING_CREATED",
                user.getEmail(),
                "BOOKING_MODULE",
                "Booking created successfully"
        );

        log.info(
                "Booking created successfully: {}",
                booking.getBookingReference()
        );

        return BookingResponse.builder()
                .bookingReference(
                        booking.getBookingReference()
                )
                .bookingStatus(
                        booking.getBookingStatus()
                )
                .totalAmount(
                        booking.getTotalAmount()
                )
                .build();
    }

    @Override
    @Transactional
    public void cancelBooking(
            Long bookingId,
            String email
    ) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        if (!booking.getUser().getId().equals(user.getId())) {

            throw new RuntimeException(
                    "Unauthorized cancellation"
            );
        }

        booking.setBookingStatus("CANCELLED");

        Schedule schedule = booking.getSchedule();

        schedule.setAvailableSeats(
                schedule.getAvailableSeats()
                        + booking.getBookingSeats().size()
        );

        scheduleRepository.save(schedule);

        auditService.logAction(
                "BOOKING_CANCELLED",
                user.getEmail(),
                "BOOKING_MODULE",
                "Booking cancelled"
        );

        log.info(
                "Booking cancelled: {}",
                booking.getBookingReference()
        );
    }

    @Override
    public List<Booking> getUserBookings(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        log.info(
                "Fetching bookings for user: {}",
                email
        );

        return bookingRepository.findByUser_Id(user.getId());
    }
}