package com.sairajtravels.site.controller;

import com.sairajtravels.site.dto.VehicleChargesDTO;
import com.sairajtravels.site.service.VehicleChargesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicle-charges")
public class VehicleChargesController {

    private final VehicleChargesService vehicleChargesService;

    public VehicleChargesController(VehicleChargesService vehicleChargesService) {
        this.vehicleChargesService = vehicleChargesService;
    }

    @GetMapping
    public List<VehicleChargesDTO> getAllCharges() {
        return vehicleChargesService.getAllCharges();
    }

    @GetMapping("/vehicle/{vehicleId}")
    public List<VehicleChargesDTO> getChargesByVehicle(@PathVariable Integer vehicleId) {
        return vehicleChargesService.getChargesByVehicle(vehicleId);
    }

    @PostMapping
    public VehicleChargesDTO createCharges(@RequestBody VehicleChargesDTO dto) {
        return vehicleChargesService.createCharges(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VehicleChargesDTO> updateCharges(@PathVariable Integer id,
                                                           @RequestBody VehicleChargesDTO dto) {
        VehicleChargesDTO updated = vehicleChargesService.updateCharges(id, dto);
        return (updated != null) ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCharges(@PathVariable Integer id) {
        vehicleChargesService.deleteCharges(id);
        return ResponseEntity.noContent().build();
    }
}
