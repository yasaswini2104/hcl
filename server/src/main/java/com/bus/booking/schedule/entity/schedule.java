package com.bus.booking.schedule.entity;
import com.bus.booking.bus.entity.Bus;
import jakarta.persistence.*;
import lombok.*;

import java.time.*;

@Entity
@Table(name = "schedules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "bus_id")
    private Bus bus;

    private LocalDate travelDate;

    private LocalDateTime departureTime;

    private LocalDateTime arrivalTime;

    private Double fare;

    private Integer availableSeats;

    private String scheduleStatus;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
