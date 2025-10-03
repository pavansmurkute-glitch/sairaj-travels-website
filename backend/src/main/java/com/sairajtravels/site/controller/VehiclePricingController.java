package com.sairajtravels.site.controller;

import com.sairajtravels.site.dto.VehiclePricingDTO;
import com.sairajtravels.site.service.VehiclePricingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicle-pricing")
public class VehiclePricingController {

    private final VehiclePricingService vehiclePricingService;

    public VehiclePricingController(VehiclePricingService vehiclePricingService) {
        this.vehiclePricingService = vehiclePricingService;
    }

    @GetMapping
    public List<VehiclePricingDTO> getAllPricing() {
        return vehiclePricingService.getAllPricing();
    }

    @GetMapping("/vehicle/{vehicleId}")
    public List<VehiclePricingDTO> getPricingByVehicle(@PathVariable Integer vehicleId) {
        return vehiclePricingService.getPricingByVehicle(vehicleId);
    }

    @PostMapping
    public VehiclePricingDTO createPricing(@RequestBody VehiclePricingDTO dto) {
        return vehiclePricingService.createPricing(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VehiclePricingDTO> updatePricing(@PathVariable Integer id,
                                                           @RequestBody VehiclePricingDTO dto) {
        VehiclePricingDTO updated = vehiclePricingService.updatePricing(id, dto);
        return (updated != null) ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePricing(@PathVariable Integer id) {
        vehiclePricingService.deletePricing(id);
        return ResponseEntity.noContent().build();
    }
}
