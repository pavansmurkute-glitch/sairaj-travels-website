import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function DriverDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/drivers/${id}`)
      .then((response) => {
        setDriver(response.data);
      })
      .catch((err) => {
        setError("Failed to load driver details");
        console.error(err);
      });
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md mx-auto">
          <p className="font-semibold text-sm">Error Loading Driver</p>
          <p className="text-xs">{error}</p>
        </div>
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading driver details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-6 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black opacity-5"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-blue-200 hover:text-white text-sm mb-6 transition-all duration-300 hover:bg-white hover:bg-opacity-10 px-4 py-2 rounded-lg"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Drivers
          </button>
          
          <div className="text-center">
            <div className="inline-block mb-4">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden shadow-xl border-3 border-white">
                <img
                  src={
                    driver.photoPath
                      ? `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}${driver.photoPath}`
                      : "/images/default_driver.jpg"
                  }
                  alt={driver.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              {driver.fullName}
            </h1>
            
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              <div className="flex items-center bg-white bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-semibold shadow-lg border border-white border-opacity-30 hover:bg-opacity-30 transition-all duration-300">
                <span className="mr-2 text-lg">👨‍✈️</span>
                <span>{driver.experienceYears} Years Experience</span>
              </div>
              <div className="flex items-center bg-white bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-semibold shadow-lg border border-white border-opacity-30 hover:bg-opacity-30 transition-all duration-300">
                <span className="mr-2 text-lg">📜</span>
                <span>{driver.licenseType}</span>
              </div>
              <div className="flex items-center bg-white bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 rounded-full font-semibold shadow-lg border border-white border-opacity-30 hover:bg-opacity-30 transition-all duration-300">
                <span className="mr-2 text-lg">⭐</span>
                <span>{driver.rating || "Professional Driver"}</span>
              </div>
            </div>
            
            <p className="text-lg text-blue-100 max-w-3xl mx-auto leading-relaxed font-light">
              {driver.description || "Professional driver with extensive experience in safe and comfortable travel"}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Driver Details Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-3 text-2xl">👨‍💼</span>
                Driver Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-blue-50 rounded-xl">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-blue-600 text-xl">⏰</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Experience</p>
                      <p className="text-lg font-semibold text-gray-800">{driver.experienceYears} years</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-green-50 rounded-xl">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-green-600 text-xl">📜</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">License Type</p>
                      <p className="text-lg font-semibold text-gray-800">{driver.licenseType}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-purple-50 rounded-xl">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-purple-600 text-xl">🔢</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">License Number</p>
                      <p className="text-lg font-semibold text-gray-800">{driver.licenseNumber || "N/A"}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-orange-50 rounded-xl">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-orange-600 text-xl">📅</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">License Expiry</p>
                      <p className="text-lg font-semibold text-gray-800">{driver.licenseExpiry || "N/A"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-pink-50 rounded-xl">
                    <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-pink-600 text-xl">🗣️</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Languages</p>
                      <p className="text-lg font-semibold text-gray-800">{driver.languages || "N/A"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-indigo-50 rounded-xl">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                      <span className="text-indigo-600 text-xl">⭐</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Rating</p>
                      <p className="text-lg font-semibold text-gray-800">{driver.rating || "Not rated yet"}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {driver.description && (
                <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">About the Driver</h3>
                  <p className="text-gray-600 leading-relaxed">{driver.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Safety & Verification Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 sticky top-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="mr-3 text-2xl">🛡️</span>
                Safety & Verification
              </h3>
              
              <div className="space-y-4">
                <div className={`flex items-center p-4 rounded-xl ${driver.policeVerified ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${driver.policeVerified ? 'bg-green-100' : 'bg-red-100'}`}>
                    <span className={`text-xl ${driver.policeVerified ? 'text-green-600' : 'text-red-600'}`}>
                      {driver.policeVerified ? '✅' : '❌'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Police Verified</p>
                    <p className={`text-lg font-semibold ${driver.policeVerified ? 'text-green-800' : 'text-red-800'}`}>
                      {driver.policeVerified ? 'Verified' : 'Not Verified'}
                    </p>
                  </div>
                </div>
                
                <div className={`flex items-center p-4 rounded-xl ${driver.aadhaarVerified ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${driver.aadhaarVerified ? 'bg-green-100' : 'bg-red-100'}`}>
                    <span className={`text-xl ${driver.aadhaarVerified ? 'text-green-600' : 'text-red-600'}`}>
                      {driver.aadhaarVerified ? '✅' : '❌'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Aadhaar Verified</p>
                    <p className={`text-lg font-semibold ${driver.aadhaarVerified ? 'text-green-800' : 'text-red-800'}`}>
                      {driver.aadhaarVerified ? 'Verified' : 'Not Verified'}
                    </p>
                  </div>
                </div>
                
                <div className={`flex items-center p-4 rounded-xl ${driver.safetyTrainingCompleted ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${driver.safetyTrainingCompleted ? 'bg-green-100' : 'bg-yellow-100'}`}>
                    <span className={`text-xl ${driver.safetyTrainingCompleted ? 'text-green-600' : 'text-yellow-600'}`}>
                      {driver.safetyTrainingCompleted ? '✅' : '⏳'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Safety Training</p>
                    <p className={`text-lg font-semibold ${driver.safetyTrainingCompleted ? 'text-green-800' : 'text-yellow-800'}`}>
                      {driver.safetyTrainingCompleted ? 'Completed' : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Contact Button */}
              <div className="mt-8">
                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Contact Driver
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
