package com.bus.booking.bus.service.impl;

import com.bus.booking.bus.dto.request.CreateBusRequest;
import com.bus.booking.bus.entity.Bus;
import com.bus.booking.bus.repository.BusRepository;
import com.bus.booking.bus.service.BusService;
import com.bus.booking.route.entity.Route;
import com.bus.booking.route.repository.RouteRepository;
import com.bus.booking.seat.entity.Seat;
import com.bus.booking.seat.repository.SeatRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BusServiceImpl implements BusService {

    private final BusRepository busRepository;
    private final RouteRepository routeRepository;
    private final SeatRepository seatRepository;

    @Override
    @Transactional
    public Bus createBus(CreateBusRequest request) {

        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() ->
                        new RuntimeException("Route not found"));

        Bus bus = Bus.builder()
                .busNumber(request.getBusNumber())
                .busName(request.getBusName())
                .busType(request.getBusType())
                .totalSeats(request.getTotalSeats())
                .operatorName(request.getOperatorName())
                .route(route)
                .build();

        busRepository.save(bus);

        //Auto-create seats for this bus
        int totalSeats = request.getTotalSeats() != null
                ? request.getTotalSeats()
                : 40;

        List<Seat> seats = new ArrayList<>();

        for (int i = 1; i <= totalSeats; i++) {
            //Label seats like A1, A2, A3, A4, B1, B2... (4 per row)
            char rowLetter = (char) ('A' + ((i - 1) / 4));
            int colNumber = ((i - 1) % 4) + 1;
            String seatNumber = "" + rowLetter + colNumber;

            String seatType = (i % 4 == 1 || i % 4 == 0)
                    ? "WINDOW"
                    : "AISLE";

            seats.add(
                    Seat.builder()
                            .seatNumber(seatNumber)
                            .seatType(seatType)
                            .bus(bus)
                            .build()
            );
        }

        seatRepository.saveAll(seats);

        log.info(
                "Bus created with {} seats: {}",
                seats.size(),
                bus.getBusNumber()
        );

        return bus;
    }

    @Override
    public List<Bus> searchBuses(
            String sourceCity,
            String destinationCity
    ) {

        log.info(
                "Searching buses from {} to {}",
                sourceCity,
                destinationCity
        );

        return busRepository
                .findByRoute_SourceCityAndRoute_DestinationCity(
                        sourceCity,
                        destinationCity
                );
    }

    @Override
    public Bus getBusById(Long busId) {

        return busRepository.findById(busId)
                .orElseThrow(() ->
                        new RuntimeException("Bus not found"));
    }

    @Override
    public List<Bus> getAllBuses() {
        return busRepository.findAll();
    }
}