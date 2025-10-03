package com.sairajtravels.site.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "vehicle_charges")
public class VehicleCharges {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer chargeId;

    // Foreign Key reference to Vehicle
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @Column(name = "charge_type", length = 50, nullable = false)
    private String chargeType;

    @Column(name = "charge_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal chargeAmount;

    @Column(name = "is_mandatory")
    private Boolean isMandatory;

    @Column(name = "description", length = 200)
    private String description;

    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;

    @Column(name = "ParkingIncluded")
    private Boolean parkingIncluded;

    // Additional fields that are referenced in the code
    @Column(name = "driver_allowance", precision = 10, scale = 2)
    private BigDecimal driverAllowance;

    @Column(name = "night_charge", precision = 10, scale = 2)
    private BigDecimal nightCharge;

    @Column(name = "fuel_included")
    private Boolean fuelIncluded;

    @Column(name = "toll_included")
    private Boolean tollIncluded;

    // ✅ Constructors
    public VehicleCharges() {}

    public VehicleCharges(Vehicle vehicle, BigDecimal driverAllowance, BigDecimal nightCharge,
                          Boolean fuelIncluded, Boolean tollIncluded, Boolean parkingIncluded) {
        this.vehicle = vehicle;
        this.driverAllowance = driverAllowance;
        this.nightCharge = nightCharge;
        this.fuelIncluded = fuelIncluded;
        this.tollIncluded = tollIncluded;
        this.parkingIncluded = parkingIncluded;
    }

    // ✅ Getters & Setters
    public Integer getChargeId() {
        return chargeId;
    }

    public void setChargeId(Integer chargeId) {
        this.chargeId = chargeId;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public BigDecimal getDriverAllowance() {
        return driverAllowance;
    }

    public void setDriverAllowance(BigDecimal driverAllowance) {
        this.driverAllowance = driverAllowance;
    }

    public BigDecimal getNightCharge() {
        return nightCharge;
    }

    public void setNightCharge(BigDecimal nightCharge) {
        this.nightCharge = nightCharge;
    }

    public Boolean getFuelIncluded() {
        return fuelIncluded;
    }

    public void setFuelIncluded(Boolean fuelIncluded) {
        this.fuelIncluded = fuelIncluded;
    }

    public Boolean getTollIncluded() {
        return tollIncluded;
    }

    public void setTollIncluded(Boolean tollIncluded) {
        this.tollIncluded = tollIncluded;
    }

    public Boolean getParkingIncluded() {
        return parkingIncluded;
    }

    public void setParkingIncluded(Boolean parkingIncluded) {
        this.parkingIncluded = parkingIncluded;
    }
}
