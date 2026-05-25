package com.bus.booking.booking.entity;

import com.bus.booking.auth.entity.User;

import com.bus.booking.schedule.entity.Schedule;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String bookingReference;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "schedule_id")
    private Schedule schedule;

    private String bookingStatus;

    private Double totalAmount;

    private LocalDateTime bookedAt;

    private String cancellationReason;

    @JsonManagedReference
    @OneToMany(
            mappedBy = "booking",
            cascade = CascadeType.ALL
    )
    private List<BookingSeat> bookingSeats;

    @PrePersist
    public void prePersist() {
        this.bookedAt = LocalDateTime.now();
    }
}