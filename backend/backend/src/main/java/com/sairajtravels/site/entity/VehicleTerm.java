package com.sairajtravels.site.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "vehicle_terms")
public class VehicleTerm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer termId;

    // Foreign Key reference to Vehicle
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @Column(name = "term_type", length = 50, nullable = false)
    private String termType;

    @Column(name = "term_text", columnDefinition = "NVARCHAR(MAX)", nullable = false)
    private String termText;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;

    // ✅ Constructors
    public VehicleTerm() {}

    public VehicleTerm(Vehicle vehicle, String termText) {
        this.vehicle = vehicle;
        this.termText = termText;
    }

    // ✅ Getters & Setters
    public Integer getTermId() {
        return termId;
    }

    public void setTermId(Integer termId) {
        this.termId = termId;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public String getTermText() {
        return termText;
    }

    public void setTermText(String termText) {
        this.termText = termText;
    }
}
