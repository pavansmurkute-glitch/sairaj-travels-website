package com.sairajtravels.site.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "VehiclePricing")
public class VehiclePricing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PricingId")
    private Integer pricingId;

    // Foreign Key reference to Vehicle
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "VehicleId")
    private Vehicle vehicle;

    @Column(name = "RateType", nullable = false, length = 20)
    private String rateType;

    @Column(name = "RatePerKm", precision = 10, scale = 2)
    private BigDecimal ratePerKm;

    @Column(name = "MinKmPerDay")
    private Integer minKmPerDay;

    @Column(name = "PackageHours")
    private Integer packageHours;

    @Column(name = "PackageKm")
    private Integer packageKm;

    @Column(name = "PackageRate", precision = 10, scale = 2)
    private BigDecimal packageRate;

    @Column(name = "ExtraKmRate", precision = 10, scale = 2)
    private BigDecimal extraKmRate;

    @Column(name = "ExtraHourRate", precision = 10, scale = 2)
    private BigDecimal extraHourRate;

    // ✅ Constructors
    public VehiclePricing() {}

    public VehiclePricing(Vehicle vehicle, String rateType, BigDecimal ratePerKm,
                          Integer minKmPerDay, Integer packageHours, Integer packageKm,
                          BigDecimal packageRate, BigDecimal extraKmRate, BigDecimal extraHourRate) {
        this.vehicle = vehicle;
        this.rateType = rateType;
        this.ratePerKm = ratePerKm;
        this.minKmPerDay = minKmPerDay;
        this.packageHours = packageHours;
        this.packageKm = packageKm;
        this.packageRate = packageRate;
        this.extraKmRate = extraKmRate;
        this.extraHourRate = extraHourRate;
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

    public String getRateType() {
        return rateType;
    }

    public void setRateType(String rateType) {
        this.rateType = rateType;
    }

    public BigDecimal getRatePerKm() {
        return ratePerKm;
    }

    public void setRatePerKm(BigDecimal ratePerKm) {
        this.ratePerKm = ratePerKm;
    }

    public Integer getMinKmPerDay() {
        return minKmPerDay;
    }

    public void setMinKmPerDay(Integer minKmPerDay) {
        this.minKmPerDay = minKmPerDay;
    }

    public Integer getPackageHours() {
        return packageHours;
    }

    public void setPackageHours(Integer packageHours) {
        this.packageHours = packageHours;
    }

    public Integer getPackageKm() {
        return packageKm;
    }

    public void setPackageKm(Integer packageKm) {
        this.packageKm = packageKm;
    }

    public BigDecimal getPackageRate() {
        return packageRate;
    }

    public void setPackageRate(BigDecimal packageRate) {
        this.packageRate = packageRate;
    }

    public BigDecimal getExtraKmRate() {
        return extraKmRate;
    }

    public void setExtraKmRate(BigDecimal extraKmRate) {
        this.extraKmRate = extraKmRate;
    }

    public BigDecimal getExtraHourRate() {
        return extraHourRate;
    }

    public void setExtraHourRate(BigDecimal extraHourRate) {
        this.extraHourRate = extraHourRate;
    }
}
