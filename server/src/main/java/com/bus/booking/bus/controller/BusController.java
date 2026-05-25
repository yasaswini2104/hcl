package com.bus.booking.bus.controller;

import com.bus.booking.bus.dto.request.CreateBusRequest;
import com.bus.booking.bus.entity.Bus;
import com.bus.booking.bus.service.BusService;
import com.bus.booking.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/buses")
public class BusController {

    private final BusService busService;

    @PostMapping("/admin")
    public ResponseEntity<ApiResponse<Bus>>
    createBus(@Valid @RequestBody CreateBusRequest request) {

        Bus bus = busService.createBus(request);

        return ResponseEntity.ok(
                ApiResponse.<Bus>builder()
                        .success(true)
                        .message("Bus created successfully")
                        .data(bus)
                        .build()
        );
    }

    @GetMapping("/admin")
    public ResponseEntity<ApiResponse<List<Bus>>>
    getAllBuses() {

        return ResponseEntity.ok(
                ApiResponse.<List<Bus>>builder()
                        .success(true)
                        .message("Buses fetched successfully")
                        .data(busService.getAllBuses())
                        .build()
        );
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Bus>>>
    searchBuses(
            @RequestParam String sourceCity,
            @RequestParam String destinationCity
    ) {

        List<Bus> buses = busService.searchBuses(sourceCity, destinationCity);

        return ResponseEntity.ok(
                ApiResponse.<List<Bus>>builder()
                        .success(true)
                        .message("Buses fetched successfully")
                        .data(buses)
                        .build()
        );
    }

    @GetMapping("/{busId}")
    public ResponseEntity<ApiResponse<Bus>>
    getBusById(@PathVariable Long busId) {

        return ResponseEntity.ok(
                ApiResponse.<Bus>builder()
                        .success(true)
                        .message("Bus fetched successfully")
                        .data(busService.getBusById(busId))
                        .build()
        );
    }
}