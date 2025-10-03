package com.sairajtravels.site.service;

import com.sairajtravels.site.dto.VehiclePricingDTO;
import com.sairajtravels.site.entity.Vehicle;
import com.sairajtravels.site.entity.VehiclePricing;
import com.sairajtravels.site.repository.VehiclePricingRepository;
import com.sairajtravels.site.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VehiclePricingService {

    private final VehiclePricingRepository vehiclePricingRepository;
    private final VehicleRepository vehicleRepository;

    public VehiclePricingService(VehiclePricingRepository vehiclePricingRepository, VehicleRepository vehicleRepository) {
        this.vehiclePricingRepository = vehiclePricingRepository;
        this.vehicleRepository = vehicleRepository;
    }

    private VehiclePricingDTO convertToDTO(VehiclePricing pricing) {
        return new VehiclePricingDTO(
                pricing.getPricingId(),
                pricing.getVehicle() != null ? pricing.getVehicle().getVehicleId() : null,
                pricing.getRateType(),
                pricing.getRatePerKm(),
                pricing.getMinKmPerDay(),
                pricing.getPackageHours(),
                pricing.getPackageKm(),
                pricing.getPackageRate(),
                pricing.getExtraKmRate(),
                pricing.getExtraHourRate()
        );
    }

    private VehiclePricing convertToEntity(VehiclePricingDTO dto) {
        VehiclePricing pricing = new VehiclePricing();
        pricing.setPricingId(dto.getPricingId());
        pricing.setRateType(dto.getRateType());
        pricing.setRatePerKm(dto.getRatePerKm());
        pricing.setMinKmPerDay(dto.getMinKmPerDay());
        pricing.setPackageHours(dto.getPackageHours());
        pricing.setPackageKm(dto.getPackageKm());
        pricing.setPackageRate(dto.getPackageRate());
        pricing.setExtraKmRate(dto.getExtraKmRate());
        pricing.setExtraHourRate(dto.getExtraHourRate());

        if (dto.getVehicleId() != null) {
            Optional<Vehicle> vehicle = vehicleRepository.findById(dto.getVehicleId());
            vehicle.ifPresent(pricing::setVehicle);
        }

        return pricing;
    }

    public List<VehiclePricingDTO> getAllPricing() {
        return vehiclePricingRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<VehiclePricingDTO> getPricingByVehicle(Integer vehicleId) {
        return vehiclePricingRepository.findByVehicle_VehicleId(vehicleId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public VehiclePricingDTO createPricing(VehiclePricingDTO dto) {
        VehiclePricing saved = vehiclePricingRepository.save(convertToEntity(dto));
        return convertToDTO(saved);
    }

    public VehiclePricingDTO updatePricing(Integer id, VehiclePricingDTO dto) {
        if (vehiclePricingRepository.existsById(id)) {
            dto.setPricingId(id);
            VehiclePricing updated = vehiclePricingRepository.save(convertToEntity(dto));
            return convertToDTO(updated);
        }
        return null;
    }

    public void deletePricing(Integer id) {
        vehiclePricingRepository.deleteById(id);
    }
}
