package com.bus.booking.route.service;

import com.bus.booking.route.dto.request.CreateRouteRequest;
import com.bus.booking.route.entity.Route;

public interface RouteService {

    Route createRoute(CreateRouteRequest request);
}