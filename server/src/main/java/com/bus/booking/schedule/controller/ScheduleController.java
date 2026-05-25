package com.bus.booking.schedule.controller;

import com.bus.booking.common.response.ApiResponse;
import com.bus.booking.schedule.dto.request.CreateScheduleRequest;
import com.bus.booking.schedule.entity.Schedule;
import com.bus.booking.schedule.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/schedules")
public class ScheduleController {

    private final ScheduleService scheduleService;

    @PostMapping("/admin")
    public ResponseEntity<ApiResponse<Schedule>>
    createSchedule(
            @RequestBody CreateScheduleRequest request
    ) {

        Schedule schedule =
                scheduleService.createSchedule(request);

        return ResponseEntity.ok(
                ApiResponse.<Schedule>builder()
                        .success(true)
                        .message("Schedule created successfully")
                        .data(schedule)
                        .build()
        );
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Schedule>>>
    searchSchedules(
            @RequestParam String sourceCity,
            @RequestParam String destinationCity,
            @RequestParam LocalDate travelDate
    ) {

        List<Schedule> schedules =
                scheduleService.searchSchedules(
                        sourceCity,
                        destinationCity,
                        travelDate
                );

        return ResponseEntity.ok(
                ApiResponse.<List<Schedule>>builder()
                        .success(true)
                        .message("Schedules fetched successfully")
                        .data(schedules)
                        .build()
        );
    }
}