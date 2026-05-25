package com.bus.booking.route.service;

import com.bus.booking.route.dto.request.CreateRouteRequest;
import com.bus.booking.route.entity.Route;

import java.util.List;

public interface RouteService {

    Route createRoute(CreateRouteRequest request);

    List<Route> getAllRoutes();
}