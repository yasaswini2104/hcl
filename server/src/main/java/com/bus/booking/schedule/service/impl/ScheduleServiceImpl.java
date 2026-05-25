package com.bus.booking.schedule.service.impl;
import com.bus.booking.bus.entity.Bus;
import com.bus.booking.bus.repository.BusRepository;
import com.bus.booking.schedule.dto.request.CreateScheduleRequest;
import com.bus.booking.schedule.entity.Schedule;
import com.bus.booking.schedule.repository.ScheduleRepository;
import com.bus.booking.schedule.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScheduleServiceImpl
        implements ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final BusRepository busRepository;

    @Override
    public Schedule createSchedule(
            CreateScheduleRequest request
    ) {

        Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() ->
                        new RuntimeException("Bus not found"));

        Schedule schedule = Schedule.builder()
                .bus(bus)
                .travelDate(request.getTravelDate())
                .departureTime(request.getDepartureTime())
                .arrivalTime(request.getArrivalTime())
                .fare(request.getFare())
                .availableSeats(bus.getTotalSeats())
                .scheduleStatus("ACTIVE")
                .build();

        scheduleRepository.save(schedule);

        log.info(
                "Schedule created for bus: {}",
                bus.getBusNumber()
        );

        return schedule;
    }

    @Override
    public List<Schedule> searchSchedules(
            String sourceCity,
            String destinationCity,
            LocalDate travelDate
    ) {

        log.info("Searching schedules");

        return scheduleRepository
                .findByBus_Route_SourceCityAndBus_Route_DestinationCityAndTravelDate(
                        sourceCity,
                        destinationCity,
                        travelDate
                );
    }

    @Override
    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    @Override
    public Schedule getScheduleById(Long id) {
        return scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
    }
}