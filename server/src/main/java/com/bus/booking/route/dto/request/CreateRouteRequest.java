package com.bus.booking.route.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateRouteRequest {

    @NotBlank
    private String sourceCity;

    @NotBlank
    private String destinationCity;

    private Double distanceKm;
}