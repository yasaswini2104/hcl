package com.bus.booking.bus.repository;


import com.bus.booking.bus.entity.Bus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BusRepository
        extends JpaRepository<Bus, Long> {

    List<Bus> findByRoute_SourceCityAndRoute_DestinationCity(
            String sourceCity,
            String destinationCity
    );
}
