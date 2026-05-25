package com.bus.booking.route.controller;

import com.bus.booking.common.response.ApiResponse;
import com.bus.booking.route.dto.request.CreateRouteRequest;
import com.bus.booking.route.entity.Route;
import com.bus.booking.route.service.RouteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/routes")
@RequiredArgsConstructor
public class RouteController {

    private final RouteService routeService;

    @PostMapping
    public ResponseEntity<ApiResponse<Route>>
    createRoute(@Valid @RequestBody CreateRouteRequest request) {

        Route route = routeService.createRoute(request);

        return ResponseEntity.ok(
                ApiResponse.<Route>builder()
                        .success(true)
                        .message("Route created successfully")
                        .data(route)
                        .build()
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Route>>>
    getAllRoutes() {

        return ResponseEntity.ok(
                ApiResponse.<List<Route>>builder()
                        .success(true)
                        .message("Routes fetched successfully")
                        .data(routeService.getAllRoutes())
                        .build()
        );
    }
}