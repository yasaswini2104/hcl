package com.bus.booking.route.service.impl;

import com.bus.booking.route.dto.request.CreateRouteRequest;
import com.bus.booking.route.entity.Route;
import com.bus.booking.route.repository.RouteRepository;
import com.bus.booking.route.service.RouteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RouteServiceImpl implements RouteService {

    private final RouteRepository routeRepository;

    @Override
    public Route createRoute(CreateRouteRequest request) {

        Route route = Route.builder()
                .sourceCity(request.getSourceCity())
                .destinationCity(request.getDestinationCity())
                .distanceKm(request.getDistanceKm())
                .build();

        routeRepository.save(route);

        log.info("Route created: {} -> {}",
                request.getSourceCity(),
                request.getDestinationCity());

        return route;
    }

    @Override
    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }
}