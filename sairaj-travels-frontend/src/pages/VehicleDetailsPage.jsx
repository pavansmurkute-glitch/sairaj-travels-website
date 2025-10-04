import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function VehicleDetailsPage() {
  const { id } = useParams();
  const [vehicleData, setVehicleData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/vehicles/${id}`)
      .then((res) => {
        setVehicleData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching vehicle details:", err);
        setError("Failed to load vehicle details. Please try again later.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm">Loading vehicle details...</p>
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
              <p className="font-semibold text-sm">Error Loading Vehicle</p>
              <p className="text-xs">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const vehicle = vehicleData;
  const images = vehicleData.images || [{ imageUrl: vehicleData.mainImageUrl }];
  const pricing = vehicleData.pricing || [];
  const charges = vehicleData.charges || [];
  const terms = vehicleData.terms || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-6">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/fleet" className="inline-flex items-center text-blue-200 hover:text-white text-sm mb-4 transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Fleet
          </Link>
          
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">
              {vehicle.name}
            </h1>
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              <div className="flex items-center bg-white bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-semibold shadow-lg">
                <span className="mr-2 text-base">👥</span>
                <span>{vehicle.capacity} Seater</span>
              </div>
              <div className="flex items-center bg-white bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-semibold shadow-lg">
                <span className="mr-2 text-base">❄️</span>
                <span>{vehicle.isAC ? "AC" : "Non-AC"}</span>
              </div>
              <div className="flex items-center bg-white bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-semibold shadow-lg">
                <span className="mr-2 text-base">⭐</span>
                <span>Premium Service</span>
              </div>
            </div>
            <p className="text-base text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {vehicle.description}
            </p>
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Vehicle Gallery</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Experience the comfort and luxury of our premium vehicle</p>
          </div>
          
          {images && images.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Image Display */}
              <div className="lg:col-span-2">
                <div className="relative group">
                  <div className="aspect-w-16 aspect-h-10 overflow-hidden rounded-2xl shadow-2xl">
                    <img
                      src={`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}${images[selectedImage].imageUrl}`}
                      alt={vehicle.name}
                      className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  
                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : images.length - 1)}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setSelectedImage(selectedImage < images.length - 1 ? selectedImage + 1 : 0)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                  
                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {selectedImage + 1} / {images.length}
                  </div>
                </div>
              </div>
              
              {/* Thumbnail Gallery */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">All Photos</h3>
                <div className="grid grid-cols-2 gap-4">
                  {images.map((img, index) => (
                    <button
                      key={img.imageId}
                      onClick={() => setSelectedImage(index)}
                      className={`relative group overflow-hidden rounded-xl transition-all duration-300 ${
                        selectedImage === index 
                          ? 'ring-4 ring-blue-500 shadow-xl scale-105' 
                          : 'hover:shadow-lg hover:scale-102'
                      }`}
                    >
                      <div className="aspect-w-1 aspect-h-1">
                        <img
                          src={`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}${img.imageUrl}`}
                          alt={`${vehicle.name} ${index + 1}`}
                          className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      {selectedImage === index && (
                        <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-xl p-12 max-w-lg mx-auto">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">No Images Available</h3>
                <p className="text-gray-600">Images for this vehicle are currently being updated</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Pricing & Charges Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Pricing & Charges</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Complete transparent pricing with all charges included</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pricing Cards */}
            {pricing && pricing.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg className="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  Rates & Packages
                </h3>
                <div className="space-y-4">
                  {pricing.map((p) => (
                    <div key={p.pricingId} className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200 p-6 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-gray-900">{p.rateType}</h4>
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-white bg-opacity-70 rounded-xl p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 font-medium">Rate per KM</span>
                            <span className="text-lg font-bold text-blue-600">₹{p.ratePerKm}</span>
                          </div>
                        </div>
                        <div className="bg-white bg-opacity-70 rounded-xl p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 font-medium">Min KM/Day</span>
                            <span className="text-lg font-bold text-blue-600">{p.minKmPerDay}</span>
                          </div>
                        </div>
                      </div>
                      
                      {p.packageHours && (
                        <div className="bg-white bg-opacity-70 rounded-xl p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 font-medium">Package Hours</span>
                            <span className="text-lg font-bold text-blue-600">{p.packageHours} hrs</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Charges Cards */}
            {charges && charges.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg className="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Additional Charges
                </h3>
                <div className="space-y-4">
                  {charges.map((c) => (
                    <div key={c.chargeId} className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl border border-green-200 p-6 hover:shadow-lg transition-all duration-300">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white bg-opacity-70 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600 font-medium">Driver Allowance</span>
                              <span className="text-lg font-bold text-green-600">₹{c.driverAllowance}</span>
                            </div>
                          </div>
                          <div className="bg-white bg-opacity-70 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600 font-medium">Night Charge</span>
                              <span className="text-lg font-bold text-green-600">₹{c.nightCharge}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white bg-opacity-70 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600 font-medium">Fuel Included</span>
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                c.fuelIncluded ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {c.fuelIncluded ? 'Yes' : 'No'}
                              </span>
                            </div>
                          </div>
                          <div className="bg-white bg-opacity-70 rounded-xl p-4">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600 font-medium">Toll Included</span>
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                c.tollIncluded ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {c.tollIncluded ? 'Yes' : 'No'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* No Data State */}
          {(!pricing || pricing.length === 0) && (!charges || charges.length === 0) && (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 max-w-lg mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Pricing Information</h3>
                <p className="text-gray-600 mb-6">Contact us for detailed pricing and special offers</p>
                <a
                  href="https://wa.me/919850748273?text=Hi, I want to know about pricing for this vehicle"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-300"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  Get Pricing on WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Terms Section */}
      {terms && terms.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Important information for your booking and travel</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-xl border border-gray-200 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {terms.map((t, index) => (
                  <div key={t.termId} className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm text-gray-700 leading-relaxed">{t.termText}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Ready to Book This Vehicle?
          </h2>
          <p className="text-base text-blue-100 mb-6 max-w-2xl mx-auto">
            Contact us now to book {vehicle.name} for your next journey and experience premium travel
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/booking"
              className="inline-flex items-center bg-yellow-400 text-blue-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-500 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Book Now
            </Link>
            <a
              href="https://wa.me/919850748273?text=Hi, I want to book this vehicle"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <img src="/sairaj_logo.png" alt="Sairaj Travels" className="h-12 w-auto" />
            </div>
            <p className="text-gray-400 text-sm mb-4">
              © 2025 Sairaj Travels. All rights reserved.
            </p>
            <div className="flex items-center justify-center space-x-6">
              <a href="tel:+919850748273" className="text-gray-400 hover:text-white transition-colors">
                📞 +91 98507 48273
              </a>
              <a href="https://wa.me/919850748273" className="text-gray-400 hover:text-white transition-colors">
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}