package com.bus.booking.bus.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateBusRequest {

    @NotBlank
    private String busNumber;

    @NotBlank
    private String busName;

    @NotBlank
    private String busType;

    @NotNull
    private Integer totalSeats;

    private String operatorName;

    @NotNull
    private Long routeId;
}