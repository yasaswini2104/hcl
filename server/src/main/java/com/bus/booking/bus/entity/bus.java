package com.bus.booking.bus.entity;
import com.bus.booking.route.entity.Route;
import com.bus.booking.seat.entity.Seat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "buses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String busNumber;

    @Column(nullable = false)
    private String busName;

    @Column(nullable = false)
    private String busType;

    @Column(nullable = false)
    private Integer totalSeats;

    private String operatorName;

    @ManyToOne
    @JoinColumn(name = "route_id")
    private Route route;

    @JsonIgnore
    @OneToMany(mappedBy = "bus")
    private List<Seat> seats;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}