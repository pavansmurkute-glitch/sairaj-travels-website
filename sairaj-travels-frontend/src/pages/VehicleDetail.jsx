import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/vehicles/${id}`)
      .then(res => setVehicle(res.data))
      .catch(err => console.error("Error fetching vehicle details:", err));
  }, [id]);

  if (!vehicle) return <p className="p-6">Loading vehicle details...</p>;

  return (
    <div className="p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-200 px-3 py-1 rounded"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold">{vehicle.name}</h2>
      <p>{vehicle.capacity} Seater {vehicle.isAC ? "AC" : "Non-AC"}</p>
      <p>{vehicle.description}</p>

      {/* Images */}
      <div className="flex gap-2 mt-3">
        {vehicle.images.map((img, idx) => (
          <img key={idx} src={img} alt="vehicle" className="h-32 rounded" />
        ))}
      </div>

      {/* Pricing */}
      <h3 className="text-xl font-semibold mt-4">Pricing</h3>
      <ul className="list-disc pl-6">
        {vehicle.pricing.map((p, idx) => (
          <li key={idx}>
            {p.rateType === "PER_KM"
              ? `₹${p.ratePerKm}/km (Min ${p.minKmPerDay} km/day)`
              : `Package ₹${p.packageRate} (${p.packageHours}h / ${p.packageKm}km)`}
          </li>
        ))}
      </ul>

      {/* Charges */}
      {vehicle.charges && (
        <>
          <h3 className="text-xl font-semibold mt-4">Extra Charges</h3>
          <ul className="list-disc pl-6">
            <li>Driver Allowance: ₹{vehicle.charges.driverAllowance}</li>
            <li>Night Charge: ₹{vehicle.charges.nightCharge}</li>
            <li>Fuel Included: {vehicle.charges.fuelIncluded ? "Yes" : "No"}</li>
            <li>Toll Included: {vehicle.charges.tollIncluded ? "Yes" : "No"}</li>
            <li>Parking Included: {vehicle.charges.parkingIncluded ? "Yes" : "No"}</li>
          </ul>
        </>
      )}

      {/* Terms */}
      <h3 className="text-xl font-semibold mt-4">Terms</h3>
      <ul className="list-disc pl-6">
        {vehicle.terms.map((t, idx) => (
          <li key={idx}>{t}</li>
        ))}
      </ul>

      {/* Booking Button */}
      <button
        onClick={() => navigate(`/vehicles/${id}/book`)}
        className="mt-6 bg-green-600 text-white px-4 py-2 rounded"
      >
        Book This Vehicle
      </button>
    </div>
  );
}
