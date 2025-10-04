package com.sairajtravels.site.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "VehicleImages")
public class VehicleImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ImageId")
    private Integer imageId;

    // Foreign Key reference to Vehicle
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "VehicleId")
    private Vehicle vehicle;

    @Column(name = "ImageUrl", nullable = false, length = 255)
    private String imageUrl;

    // ✅ Constructors
    public VehicleImage() {}

    public VehicleImage(Vehicle vehicle, String imageUrl) {
        this.vehicle = vehicle;
        this.imageUrl = imageUrl;
    }

    // ✅ Getters & Setters
    public Integer getImageId() {
        return imageId;
    }

    public void setImageId(Integer imageId) {
        this.imageId = imageId;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
