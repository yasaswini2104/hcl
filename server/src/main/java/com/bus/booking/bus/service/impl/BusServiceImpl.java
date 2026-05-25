package com.bus.booking.bus.service.impl;

import com.bus.booking.bus.dto.request.CreateBusRequest;
import com.bus.booking.bus.entity.Bus;
import com.bus.booking.bus.repository.BusRepository;
import com.bus.booking.bus.service.BusService;
import com.bus.booking.route.entity.Route;
import com.bus.booking.route.repository.RouteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BusServiceImpl implements BusService {

    private final BusRepository busRepository;
    private final RouteRepository routeRepository;

    @Override
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

        log.info(
                "Bus created successfully: {}",
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
}