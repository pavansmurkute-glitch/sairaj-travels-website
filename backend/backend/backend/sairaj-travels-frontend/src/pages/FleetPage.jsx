import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { apiMethods } from "../services/api";

export default function FleetPage() {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    setLoading(true);
    apiMethods
      .get("/vehicle-details")
      .then((res) => {
        console.log("API Response:", res.data);
        console.log("First vehicle image:", res.data[0]?.vehicle?.mainImageUrl);
        setVehicles(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching vehicles:", err);
        // Fallback to static vehicle data
        const fallbackVehicles = [
          {
            vehicle: {
              vehicleId: 1,
              name: "Urbania 17-Seater",
              capacity: 17,
              isAC: true,
              description: "Spacious 17-seater Urbania van with AC, best for group tours.",
              mainImageUrl: "/images/urbania1.avif"
            }
          },
          {
            vehicle: {
              vehicleId: 2,
              name: "Toyota Innova Crysta",
              capacity: 7,
              isAC: true,
              description: "Luxury 7-seater car with comfortable ride for family trips.",
              mainImageUrl: "/images/innova1.jpg"
            }
          },
          {
            vehicle: {
              vehicleId: 3,
              name: "Mercedes-Benz Bus",
              capacity: 35,
              isAC: true,
              description: "Premium 35-seater bus for large group travel.",
              mainImageUrl: "/images/benzbus1.jpg"
            }
          },
          {
            vehicle: {
              vehicleId: 4,
              name: "Maruti Ertiga - 7 seater",
              capacity: 4,
              isAC: false,
              description: "Spacious 7-seater Ertiga van with AC.",
              mainImageUrl: "/images/ertiga.avif"
            }
          },
          {
            vehicle: {
              vehicleId: 5,
              name: "Kia Carnival",
              capacity: 8,
              isAC: true,
              description: "Luxury 7-seater with AC for bussiness perpose",
              mainImageUrl: "/images/Kia_carnival.avif"
            }
          }
        ];
        setVehicles(fallbackVehicles);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading our premium fleet...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md mx-auto">
              <p className="font-semibold">Error Loading Fleet</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Consistent with App theme */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Our <span className="text-yellow-400">Premium Fleet</span>
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-6">
            Experience comfort and safety with our well-maintained vehicles, perfect for all your travel needs
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <div className="flex items-center bg-yellow-400 text-blue-900 px-3 py-1.5 rounded-full font-semibold">
              <span className="mr-1">🚌</span>
              <span>17-Seater Urbania</span>
            </div>
            <div className="flex items-center bg-yellow-400 text-blue-900 px-3 py-1.5 rounded-full font-semibold">
              <span className="mr-1">🛡️</span>
              <span>100% Safe</span>
            </div>
            <div className="flex items-center bg-yellow-400 text-blue-900 px-3 py-1.5 rounded-full font-semibold">
              <span className="mr-1">⭐</span>
              <span>Premium Service</span>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Features */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Why Choose Our Fleet?</h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">Modern vehicles with premium amenities for your comfort</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">🚌</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Modern Fleet</h3>
              <p className="text-xs text-gray-600">Well-maintained vehicles with latest features</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">🛡️</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Safety First</h3>
              <p className="text-xs text-gray-600">Regular maintenance and safety inspections</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">⭐</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Premium Service</h3>
              <p className="text-xs text-gray-600">Professional drivers and excellent service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicles Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Available Vehicles</h2>
            <p className="text-sm text-gray-600">Choose from our premium collection of vehicles</p>
          </div>

          {vehicles.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white rounded-lg p-8 shadow-lg max-w-md mx-auto">
                <div className="text-6xl mb-4">🚌</div>
                <h3 className="text-base font-bold text-gray-900 mb-2">No Vehicles Available</h3>
                <p className="text-sm text-gray-600 mb-4">We're updating our fleet. Please check back soon!</p>
                <Link
                  to="/contact"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vehicles.map((v) => (
                <div
                  key={v.vehicle.vehicleId}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={(() => {
                        const imageSrc = v.vehicle?.mainImageUrl
                          ? `http://localhost:8080${v.vehicle.mainImageUrl}` // use backend URL like VehicleDetailsPage
                          : "/images/Kia_carnival.avif"; // fallback
                        console.log(`Image for ${v.vehicle?.name}:`, imageSrc);
                        return imageSrc;
                      })()}
                      alt={v.vehicle?.name || v.vehicle?.vehicleName || 'Vehicle'}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        console.log(`Image failed to load for ${v.vehicle?.name}:`, e.target.src);
                      }}
                    />
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {v.vehicle?.capacity || v.vehicle?.seatingCapacity || 'N/A'} Seater
                    </div>
                    {(v.vehicle?.isAC || v.vehicle?.ac) && (
                      <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        AC
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-base font-bold text-gray-900 mb-2">{v.vehicle?.name || v.vehicle?.vehicleName || 'Vehicle'}</h3>
                    <p className="text-xs text-gray-600 mb-4 line-clamp-2">
                      {v.vehicle?.description || v.vehicle?.vehicleDescription || 'Premium vehicle for your travel needs.'}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-xs text-gray-600">
                        <span className="mr-1">👥</span>
                        <span>{v.vehicle.capacity} Seater</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <span className="mr-1">❄️</span>
                        <span>{v.vehicle.isAC ? "AC" : "Non-AC"}</span>
                      </div>
                    </div>

                    <Link
                      to={`/vehicles/${v.vehicle.vehicleId}`}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-lg md:text-xl font-bold mb-2">
            Ready to Book Your Vehicle?
          </h2>
          <p className="text-sm text-blue-100 mb-4 max-w-2xl mx-auto">
            Contact us now to book your preferred vehicle for your next journey
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              to="/booking"
              className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-500 transition-colors"
            >
              🚌 Book Now
            </Link>
            <a
              href="https://wa.me/919850748273?text=Hi, I want to know about your fleet services"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-green-600 transition-colors"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
