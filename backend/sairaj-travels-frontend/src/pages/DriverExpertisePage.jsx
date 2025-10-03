import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function DriverExpertisePage() {
  const [drivers, setDrivers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8080/api/drivers")
      .then((res) => {
        setDrivers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching drivers:", err);
        setError("Failed to load drivers. Please try again later.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm">Loading our professional drivers...</p>
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
              <p className="font-semibold text-sm">Error Loading Drivers</p>
              <p className="text-xs">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-6">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-lg md:text-xl font-bold mb-2">
            Our <span className="text-yellow-400">Professional Drivers</span>
          </h1>
          <p className="text-sm text-blue-100 max-w-2xl mx-auto mb-3">
            Experienced, licensed, and safety-trained drivers for your peace of mind
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <div className="flex items-center bg-yellow-400 text-blue-900 px-3 py-1.5 rounded-full font-semibold">
              <span className="mr-1">👨‍✈️</span>
              <span>Licensed Drivers</span>
            </div>
            <div className="flex items-center bg-yellow-400 text-blue-900 px-3 py-1.5 rounded-full font-semibold">
              <span className="mr-1">🛡️</span>
              <span>Safety Trained</span>
            </div>
            <div className="flex items-center bg-yellow-400 text-blue-900 px-3 py-1.5 rounded-full font-semibold">
              <span className="mr-1">⭐</span>
              <span>5+ Years Experience</span>
            </div>
          </div>
        </div>
      </section>

      {/* Driver Features */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Why Choose Our Drivers?</h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">Professional drivers with extensive experience and safety training</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">🛡️</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Safety First</h3>
              <p className="text-xs text-gray-600">All drivers undergo safety training and background checks</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">📜</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Licensed</h3>
              <p className="text-xs text-gray-600">Valid commercial driving licenses with regular renewals</p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl">⭐</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Experienced</h3>
              <p className="text-xs text-gray-600">Years of experience driving across Maharashtra</p>
            </div>
          </div>
        </div>
      </section>

      {/* Drivers Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Our Professional Drivers</h2>
            <p className="text-sm text-gray-600">Meet our experienced and trusted drivers</p>
          </div>

          {drivers.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white rounded-lg p-8 shadow-lg max-w-md mx-auto">
                <div className="text-6xl mb-4">👨‍✈️</div>
                <h3 className="text-base font-bold text-gray-900 mb-2">No Drivers Available</h3>
                <p className="text-sm text-gray-600 mb-4">We're updating our driver roster. Please check back soon!</p>
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
              {drivers.map((driver) => (
                <div
                  key={driver.driverId}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="relative p-6 text-center">
                    <div className="relative mb-4">
                      <img
                        src={
                          driver.photoPath
                            ? `http://localhost:8080${driver.photoPath}`
                            : "/images/default_driver.jpg"
                        }
                        alt={driver.fullName}
                        className="w-24 h-24 mx-auto object-cover rounded-full shadow-lg group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-gray-900 mb-2">{driver.fullName}</h3>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                      {driver.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>👨‍✈️ Experience</span>
                        <span className="font-semibold">{driver.experienceYears} years</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>📜 License</span>
                        <span className="font-semibold">{driver.licenseType}</span>
                      </div>
                      {driver.rating && (
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>⭐ Rating</span>
                          <span className="font-semibold">{driver.rating}</span>
                        </div>
                      )}
                    </div>

                    <Link
                      to={`/drivers/${driver.driverId}`}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block text-sm"
                    >
                      View Profile
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
            Need a Professional Driver?
          </h2>
          <p className="text-sm text-blue-100 mb-4 max-w-2xl mx-auto">
            Book with our experienced drivers for safe and comfortable travel
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              to="/booking"
              className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-500 transition-colors"
            >
              🚌 Book Driver
            </Link>
            <a
              href="https://wa.me/919850748273?text=Hi, I want to know about your drivers"
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
