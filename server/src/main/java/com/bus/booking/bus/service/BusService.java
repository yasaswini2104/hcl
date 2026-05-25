package com.bus.booking.bus.service;

import com.bus.booking.bus.dto.request.CreateBusRequest;
import com.bus.booking.bus.entity.Bus;

import java.util.List;

public interface BusService {

    Bus createBus(CreateBusRequest request);

    List<Bus> searchBuses(String sourceCity, String destinationCity);

    Bus getBusById(Long busId);

    List<Bus> getAllBuses();
}