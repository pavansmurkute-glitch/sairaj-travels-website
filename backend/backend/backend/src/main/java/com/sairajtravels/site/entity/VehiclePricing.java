package com.sairajtravels.site.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "vehicle_pricing")
public class VehiclePricing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer pricingId;

    // Foreign Key reference to Vehicle
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @Column(name = "base_price", precision = 10, scale = 2, nullable = false)
    private BigDecimal basePrice;

    @Column(name = "per_km_rate", precision = 10, scale = 2, nullable = false)
    private BigDecimal perKmRate;

    @Column(name = "per_hour_rate", precision = 10, scale = 2, nullable = false)
    private BigDecimal perHourRate;

    @Column(name = "night_charge", precision = 10, scale = 2)
    private BigDecimal nightCharge;

    @Column(name = "toll_charges", precision = 10, scale = 2)
    private BigDecimal tollCharges;

    @Column(name = "parking_charges", precision = 10, scale = 2)
    private BigDecimal parkingCharges;

    @Column(name = "meal_charges", precision = 10, scale = 2)
    private BigDecimal mealCharges;

    @Column(name = "emergency_charges", precision = 10, scale = 2)
    private BigDecimal emergencyCharges;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;

    @Column(name = "updated_at")
    private java.time.LocalDateTime updatedAt;

    // ✅ Constructors
    public VehiclePricing() {}

    public VehiclePricing(Vehicle vehicle, BigDecimal basePrice, BigDecimal perKmRate,
                          BigDecimal perHourRate, BigDecimal nightCharge, BigDecimal tollCharges,
                          BigDecimal parkingCharges, BigDecimal mealCharges, BigDecimal emergencyCharges) {
        this.vehicle = vehicle;
        this.basePrice = basePrice;
        this.perKmRate = perKmRate;
        this.perHourRate = perHourRate;
        this.nightCharge = nightCharge;
        this.tollCharges = tollCharges;
        this.parkingCharges = parkingCharges;
        this.mealCharges = mealCharges;
        this.emergencyCharges = emergencyCharges;
        this.isActive = true;
    }

    // ✅ Getters & Setters
    public Integer getPricingId() {
        return pricingId;
    }

    public void setPricingId(Integer pricingId) {
        this.pricingId = pricingId;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public BigDecimal getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(BigDecimal basePrice) {
        this.basePrice = basePrice;
    }

    public BigDecimal getPerKmRate() {
        return perKmRate;
    }

    public void setPerKmRate(BigDecimal perKmRate) {
        this.perKmRate = perKmRate;
    }

    public BigDecimal getPerHourRate() {
        return perHourRate;
    }

    public void setPerHourRate(BigDecimal perHourRate) {
        this.perHourRate = perHourRate;
    }

    public BigDecimal getNightCharge() {
        return nightCharge;
    }

    public void setNightCharge(BigDecimal nightCharge) {
        this.nightCharge = nightCharge;
    }

    public BigDecimal getTollCharges() {
        return tollCharges;
    }

    public void setTollCharges(BigDecimal tollCharges) {
        this.tollCharges = tollCharges;
    }

    public BigDecimal getParkingCharges() {
        return parkingCharges;
    }

    public void setParkingCharges(BigDecimal parkingCharges) {
        this.parkingCharges = parkingCharges;
    }

    public BigDecimal getMealCharges() {
        return mealCharges;
    }

    public void setMealCharges(BigDecimal mealCharges) {
        this.mealCharges = mealCharges;
    }

    public BigDecimal getEmergencyCharges() {
        return emergencyCharges;
    }

    public void setEmergencyCharges(BigDecimal emergencyCharges) {
        this.emergencyCharges = emergencyCharges;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public java.time.LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(java.time.LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public java.time.LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(java.time.LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
