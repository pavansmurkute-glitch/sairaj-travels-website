package com.sairajtravels.site.controller;

import com.sairajtravels.site.dto.VehicleDetailsDTO;
import com.sairajtravels.site.entity.Vehicle;
import com.sairajtravels.site.entity.VehicleCharges;
import com.sairajtravels.site.entity.VehiclePricing;
import com.sairajtravels.site.entity.VehicleTerm;
import com.sairajtravels.site.entity.VehicleImage;
import com.sairajtravels.site.repository.VehicleRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/vehicle-details")
public class VehicleDetailsController {

    @Autowired
    private VehicleRepository vehicleRepository;

    @PersistenceContext
    private EntityManager entityManager;

    // ✅ 1. Get all vehicles (basic info)
    @GetMapping
    public ResponseEntity<List<VehicleDetailsDTO>> getAllVehicles() {
        List<Vehicle> vehicles = vehicleRepository.findAll();

        List<VehicleDetailsDTO> dtos = vehicles.stream().map(vehicle -> {
            VehicleDetailsDTO dto = new VehicleDetailsDTO();

            VehicleDetailsDTO.VehicleDTO vdto = new VehicleDetailsDTO.VehicleDTO();
            vdto.setVehicleId(vehicle.getVehicleId());
            vdto.setName(vehicle.getName());
            vdto.setType(vehicle.getType());
            vdto.setCapacity(vehicle.getCapacity());
            vdto.setIsAC(vehicle.getIsAC());
            vdto.setDescription(vehicle.getDescription());
            vdto.setMainImageUrl(vehicle.getMainImageUrl()); // ✅ Added here

            dto.setVehicle(vdto);
            return dto;
        }).toList();

        return ResponseEntity.ok(dtos);
    }

    // ✅ 2. Get single vehicle with full details
    @GetMapping("/{id}")
    public ResponseEntity<VehicleDetailsDTO> getVehicleFullDetails(@PathVariable Integer id) {
        VehicleDetailsDTO dto = new VehicleDetailsDTO();

        // --- Vehicle ---
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        VehicleDetailsDTO.VehicleDTO vdto = new VehicleDetailsDTO.VehicleDTO();
        vdto.setVehicleId(vehicle.getVehicleId());
        vdto.setName(vehicle.getName());
        vdto.setType(vehicle.getType());
        vdto.setCapacity(vehicle.getCapacity());
        vdto.setIsAC(vehicle.getIsAC());
        vdto.setDescription(vehicle.getDescription());
        vdto.setMainImageUrl(vehicle.getMainImageUrl()); // ✅ Added here

        dto.setVehicle(vdto);

        // --- Pricing ---
        TypedQuery<VehiclePricing> pricingQuery = entityManager.createQuery(
                "SELECT p FROM VehiclePricing p WHERE p.vehicle.vehicleId = :id", VehiclePricing.class);
        pricingQuery.setParameter("id", id);

        List<VehicleDetailsDTO.VehiclePricingDTO> pricingDTOs = pricingQuery.getResultList().stream().map(p -> {
            VehicleDetailsDTO.VehiclePricingDTO pdto = new VehicleDetailsDTO.VehiclePricingDTO();
            pdto.setPricingId(p.getPricingId());
            pdto.setRatePerKm(p.getRatePerKm());
            pdto.setExtraKmRate(p.getExtraKmRate());
            pdto.setExtraHourRate(p.getExtraHourRate());
            pdto.setMinKmPerDay(p.getMinKmPerDay());
            pdto.setPackageRate(p.getPackageRate());
            pdto.setPackageKm(p.getPackageKm());
            pdto.setPackageHours(p.getPackageHours());
            pdto.setRateType(p.getRateType());
            return pdto;
        }).toList();
        dto.setPricing(pricingDTOs);

        // --- Charges ---
        TypedQuery<VehicleCharges> chargesQuery = entityManager.createQuery(
                "SELECT c FROM VehicleCharges c WHERE c.vehicle.vehicleId = :id", VehicleCharges.class);
        chargesQuery.setParameter("id", id);

        List<VehicleDetailsDTO.VehicleChargesDTO> chargeDTOs = chargesQuery.getResultList().stream().map(c -> {
            VehicleDetailsDTO.VehicleChargesDTO cdto = new VehicleDetailsDTO.VehicleChargesDTO();
            cdto.setChargeId(c.getChargeId());
            cdto.setDriverAllowance(c.getDriverAllowance());
            cdto.setTollIncluded(c.getTollIncluded());
            cdto.setParkingIncluded(c.getParkingIncluded());
            cdto.setFuelIncluded(c.getFuelIncluded());
            cdto.setNightCharge(c.getNightCharge());

            return cdto;
        }).toList();
        dto.setCharges(chargeDTOs);

        // --- Terms ---
        TypedQuery<VehicleTerm> termQuery = entityManager.createQuery(
                "SELECT t FROM VehicleTerm t WHERE t.vehicle.vehicleId = :id", VehicleTerm.class);
        termQuery.setParameter("id", id);

        List<VehicleDetailsDTO.VehicleTermDTO> termDTOs = termQuery.getResultList().stream().map(t -> {
            VehicleDetailsDTO.VehicleTermDTO tdto = new VehicleDetailsDTO.VehicleTermDTO();
            tdto.setTermId(t.getTermId());
            tdto.setTermText(t.getTermText());
            return tdto;
        }).toList();
        dto.setTerms(termDTOs);

        // --- Images ---
        TypedQuery<VehicleImage> imageQuery = entityManager.createQuery(
                "SELECT i FROM VehicleImage i WHERE i.vehicle.vehicleId = :id", VehicleImage.class);
        imageQuery.setParameter("id", id);

        List<VehicleDetailsDTO.VehicleImageDTO> imgDTOs = imageQuery.getResultList().stream().map(i -> {
            VehicleDetailsDTO.VehicleImageDTO idto = new VehicleDetailsDTO.VehicleImageDTO();
            idto.setImageId(i.getImageId());
            idto.setImageUrl(i.getImageUrl());
            return idto;
        }).toList();
        dto.setImages(imgDTOs);

        return ResponseEntity.ok(dto);
    }
}
