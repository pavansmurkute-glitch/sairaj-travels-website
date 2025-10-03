package com.sairajtravels.site.service;

import com.sairajtravels.site.dto.VehicleChargesDTO;
import com.sairajtravels.site.entity.Vehicle;
import com.sairajtravels.site.entity.VehicleCharges;
import com.sairajtravels.site.repository.VehicleChargesRepository;
import com.sairajtravels.site.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VehicleChargesService {

    private final VehicleChargesRepository vehicleChargesRepository;
    private final VehicleRepository vehicleRepository;

    public VehicleChargesService(VehicleChargesRepository vehicleChargesRepository, VehicleRepository vehicleRepository) {
        this.vehicleChargesRepository = vehicleChargesRepository;
        this.vehicleRepository = vehicleRepository;
    }

    private VehicleChargesDTO convertToDTO(VehicleCharges charges) {
        return new VehicleChargesDTO(
                charges.getChargeId(),
                charges.getVehicle() != null ? charges.getVehicle().getVehicleId() : null,
                charges.getDriverAllowance(),
                charges.getNightCharge(),
                charges.getFuelIncluded(),
                charges.getTollIncluded(),
                charges.getParkingIncluded()
        );
    }

    private VehicleCharges convertToEntity(VehicleChargesDTO dto) {
        VehicleCharges charges = new VehicleCharges();
        charges.setChargeId(dto.getChargeId());
        charges.setDriverAllowance(dto.getDriverAllowance());
        charges.setNightCharge(dto.getNightCharge());
        charges.setFuelIncluded(dto.getFuelIncluded());
        charges.setTollIncluded(dto.getTollIncluded());
        charges.setParkingIncluded(dto.getParkingIncluded());

        if (dto.getVehicleId() != null) {
            Optional<Vehicle> vehicle = vehicleRepository.findById(dto.getVehicleId());
            vehicle.ifPresent(charges::setVehicle);
        }

        return charges;
    }

    public List<VehicleChargesDTO> getAllCharges() {
        return vehicleChargesRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<VehicleChargesDTO> getChargesByVehicle(Integer vehicleId) {
        return vehicleChargesRepository.findByVehicle_VehicleId(vehicleId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public VehicleChargesDTO createCharges(VehicleChargesDTO dto) {
        VehicleCharges saved = vehicleChargesRepository.save(convertToEntity(dto));
        return convertToDTO(saved);
    }

    public VehicleChargesDTO updateCharges(Integer id, VehicleChargesDTO dto) {
        if (vehicleChargesRepository.existsById(id)) {
            dto.setChargeId(id);
            VehicleCharges updated = vehicleChargesRepository.save(convertToEntity(dto));
            return convertToDTO(updated);
        }
        return null;
    }

    public void deleteCharges(Integer id) {
        vehicleChargesRepository.deleteById(id);
    }
}
