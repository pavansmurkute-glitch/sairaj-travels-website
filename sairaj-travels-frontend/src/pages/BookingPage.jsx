import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { apiMethods } from "../services/api";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCar,
  FaSuitcase,
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaCheckCircle,
  FaShieldAlt,
  FaStar,
  FaArrowLeft,
  FaPaperPlane,
  FaWhatsapp,
  FaPhoneAlt
} from "react-icons/fa";
import { motion } from "framer-motion";

// Removed hardcoded API_BASE - using centralized API service

export default function BookingPage() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [vehicle, setVehicle] = useState(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicleId || "");
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    pickup: "",
    drop: "",
    date: new Date().toISOString().split("T")[0],
    returnDate: "",
    time: "",
    passengers: 1,
    vehicleType: "",
    luggage: "",
    notes: "",
    selectedPackage: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const steps = [
    { id: 1, title: "Personal Info", icon: <FaUser /> },
    { id: 2, title: "Trip Details", icon: <FaMapMarkerAlt /> },
    { id: 3, title: "Vehicle Selection", icon: <FaCar /> },
    { id: 4, title: "Review & Book", icon: <FaCheckCircle /> }
  ];

  const resolveImageSrc = (imgPath) => {
    if (!imgPath) return "/images/placeholder.png";
    if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) return imgPath;
    if (imgPath.startsWith("/")) return `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}${imgPath}`;
    return `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/${imgPath}`;
  };

  // Fetch vehicles
  useEffect(() => {
    setLoadingVehicles(true);
    apiMethods.get("/vehicles")
      .then((res) => {
        const mapped = res.data.map((v) => ({
          id: v.id || v.vehicleId,
          name: v.name || v.vehicleName,
          type: v.type || "",
          imageUrl: v.imageUrl || v.photoPath,
          description: v.description || "",
          capacity: v.capacity || "17",
          features: v.features || ["AC", "Comfortable Seats", "Safe Travel"]
        }));
        setVehicles(mapped);
      })
      .catch((err) => {
        console.error("Error fetching vehicles:", err);
        setVehicles([]);
      })
      .finally(() => setLoadingVehicles(false));
  }, []);

  // Fetch vehicle details if vehicleId provided
  useEffect(() => {
    if (!vehicleId) return;
    setSelectedVehicleId(vehicleId);
    apiMethods.get(`/vehicle-details/${vehicleId}`)
      .then((res) => {
        const data = res.data;
        setVehicle({
          id: data.id || data.vehicleId,
          name: data.name || data.vehicleName,
          type: data.type || "",
          imageUrl: data.imageUrl || data.photoPath,
          description: data.description || "",
          capacity: data.capacity || "17",
          features: data.features || ["AC", "Comfortable Seats", "Safe Travel"]
        });
        if (data?.type) {
          setFormData((f) => ({ ...f, vehicleType: data.type }));
        }
      })
      .catch((err) => {
        console.error("Error fetching vehicle details:", err);
      });
  }, [vehicleId]);

  // Update vehicle when selection changes
  useEffect(() => {
    if (!selectedVehicleId) {
      setVehicle(null);
      return;
    }
    const found = vehicles.find((v) => String(v.id) === String(selectedVehicleId));
    if (found) {
      setVehicle(found);
      setFormData((f) => ({ ...f, vehicleType: found.type || found.name || "" }));
    }
  }, [selectedVehicleId, vehicles]);

  // Fetch packages
  useEffect(() => {
    setLoadingPackages(true);
    apiMethods.get('/packages')
      .then((res) => {
        setPackages(res.data || []);
      })
      .catch((err) => {
        console.error("Error fetching packages:", err);
        setPackages([]);
      })
      .finally(() => setLoadingPackages(false));
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  }, [currentStep]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.pickup || !formData.drop) {
      setMessage("⚠️ Please fill all required fields.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const payload = {
        vehicleId: vehicle?.id || selectedVehicleId || null,
        customerName: formData.fullName,
        customerPhone: formData.phone,
        customerEmail: formData.email || null,
        pickupLocation: formData.pickup,
        dropLocation: formData.drop,
        tripDate: formData.date,
        returnDate: formData.returnDate || null,
        tripTime: formData.time || null,
        passengers: formData.passengers || 1,
        luggage: formData.luggage || null,
        specialRequests: formData.notes || null,
        packageId: formData.selectedPackage || null,
        status: "PENDING"
      };

      console.log("Booking payload:", payload);

      // Submit booking to backend
      const response = await apiMethods.post("/vehicle-bookings", payload);
      console.log("Booking response:", response.data);

      setMessage("✅ Booking submitted successfully! We'll contact you shortly.");
      setBookingSubmitted(true);
      
      // Reset form after successful submission
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        pickup: "",
        drop: "",
        date: new Date().toISOString().split("T")[0],
        returnDate: "",
        time: "",
        passengers: 1,
        luggage: "",
        notes: "",
        selectedPackage: ""
      });
      setCurrentStep(1);
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage("");
      }, 5000);
    } catch (err) {
      console.error("Booking submission error:", err);
      setMessage("❌ Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const startNewBooking = useCallback(() => {
    setBookingSubmitted(false);
    setMessage("");
    setCurrentStep(1);
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      pickup: "",
      drop: "",
      date: new Date().toISOString().split("T")[0],
      returnDate: "",
      time: "",
      passengers: 1,
      luggage: "",
      notes: "",
      selectedPackage: ""
    });
  }, []);

  const InputField = useCallback(({ icon: Icon, ...props }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600 text-lg" />
      <input
        {...props}
        className="w-full border-2 border-gray-200 p-4 pl-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-700 placeholder-gray-500"
      />
    </motion.div>
  ), []);

  const renderStepContent = useCallback(() => {
    switch (currentStep) {
      case 1:
  return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h3>
            <InputField
              icon={FaUser}
              type="text"
              name="fullName"
              placeholder="Full Name *"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <InputField
              icon={FaPhone}
              type="tel"
              name="phone"
              placeholder="Phone Number *"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <InputField
              icon={FaEnvelope}
              type="email"
              name="email"
              placeholder="Email Address (Optional)"
              value={formData.email}
              onChange={handleChange}
            />
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Trip Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                icon={FaMapMarkerAlt}
                type="text"
                name="pickup"
                placeholder="Pickup Location *"
                value={formData.pickup}
                onChange={handleChange}
                required
              />
              <InputField
                icon={FaMapMarkerAlt}
                type="text"
                name="drop"
                placeholder="Drop Location *"
                value={formData.drop}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative">
                <FaCalendarAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600 text-lg" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 p-4 pl-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-700"
                  required
                />
              </div>
              <div className="relative">
                <FaClock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600 text-lg" />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 p-4 pl-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-700"
                  required
                />
              </div>
              <div className="relative">
                <FaUsers className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600 text-lg" />
                <select
                  name="passengers"
                  value={formData.passengers}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 p-4 pl-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-700"
                >
                  {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17].map(num => (
                    <option key={num} value={num}>{num} Passenger{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <FaCalendarAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600 text-lg" />
                <input
                  type="date"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleChange}
                  placeholder="Return Date (Optional)"
                  className="w-full border-2 border-gray-200 p-4 pl-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-700"
                />
              </div>
              <div className="relative">
                <FaSuitcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600 text-lg" />
                <input
                  type="text"
                  name="luggage"
                  placeholder="Luggage Details (Optional)"
                  value={formData.luggage}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 p-4 pl-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-700 placeholder-gray-500"
                />
              </div>
            </div>
            
            {/* Package Selection - Optional */}
            <div className="relative">
              <FaStar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600 text-lg" />
              <select
                name="selectedPackage"
                value={formData.selectedPackage}
                onChange={handleChange}
                className="w-full border-2 border-gray-200 p-4 pl-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-700"
              >
                <option value="">Select a Package (Optional)</option>
                {loadingPackages ? (
                  <option disabled>Loading packages...</option>
                ) : (
                  packages.map((pkg) => (
                    <option key={pkg.packageId} value={pkg.packageId}>
                      {pkg.packageName} - {pkg.packageCategory} (₹{pkg.packagePrice?.toLocaleString()})
                    </option>
                  ))
                )}
              </select>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Select Your Vehicle</h3>
            <div className="relative">
              <FaCar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600 text-lg z-10" />
                  <select
                    name="selectedVehicleId"
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="w-full border-2 border-gray-200 p-4 pl-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-700"
                  >
                <option value="">Choose your vehicle</option>
                    {loadingVehicles ? (
                  <option disabled>Loading vehicles...</option>
                    ) : (
                      vehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                      {v.name} - {v.type}
                        </option>
                      ))
                    )}
                  </select>
                </div>

            {vehicle && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={resolveImageSrc(vehicle.imageUrl)}
                    alt={vehicle.name}
                    className="w-20 h-20 object-cover rounded-lg shadow-md"
                  />
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{vehicle.name}</h4>
                    <p className="text-gray-600">{vehicle.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-blue-600 font-medium">
                        Capacity: {vehicle.capacity} passengers
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Review Your Booking</h3>
            <div className="bg-gray-50 p-6 rounded-xl space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Personal Info</h4>
                  <p className="text-gray-600">{formData.fullName}</p>
                  <p className="text-gray-600">{formData.phone}</p>
                  {formData.email && <p className="text-gray-600">{formData.email}</p>}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Trip Details</h4>
                  <p className="text-gray-600">{formData.pickup} → {formData.drop}</p>
                  <p className="text-gray-600">{formData.date} at {formData.time}</p>
                  <p className="text-gray-600">{formData.passengers} passenger{formData.passengers > 1 ? 's' : ''}</p>
                </div>
              </div>
              {vehicle && (
                <div>
                  <h4 className="font-semibold text-gray-900">Selected Vehicle</h4>
                  <p className="text-gray-600">{vehicle.name}</p>
                </div>
              )}
              {formData.selectedPackage && (
                <div>
                  <h4 className="font-semibold text-gray-900">Selected Package</h4>
                  {(() => {
                    const selectedPkg = packages.find(pkg => pkg.packageId == formData.selectedPackage);
                    return selectedPkg ? (
                      <div>
                        <p className="text-gray-600 font-medium">{selectedPkg.packageName}</p>
                        <p className="text-gray-600">{selectedPkg.packageCategory}</p>
                        <p className="text-blue-600 font-semibold">₹{selectedPkg.packagePrice?.toLocaleString()}</p>
                      </div>
                    ) : (
                      <p className="text-gray-600">Package ID: {formData.selectedPackage}</p>
                    );
                  })()}
                </div>
              )}
              {formData.notes && (
                <div>
                  <h4 className="font-semibold text-gray-900">Additional Notes</h4>
                  <p className="text-gray-600">{formData.notes}</p>
                </div>
              )}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  }, [currentStep, formData, packages, loadingPackages, vehicle]);

  // Show success message and new booking button if booking was submitted
  if (bookingSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center"
        >
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-3xl text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600">
              Your booking has been submitted successfully. We'll contact you shortly to confirm the details.
            </p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={startNewBooking}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Make Another Booking
            </button>
            
            <button
              onClick={() => navigate("/")}
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
            >
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-6 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black opacity-5"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors mb-4"
              >
                <FaArrowLeft className="text-sm" />
                Back
              </motion.button>
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent"
              >
                Book Your Journey
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 1 }}
                className="text-lg text-blue-100 max-w-2xl"
              >
                Experience comfortable and safe travel with our premium vehicles and professional drivers.
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
          {/* Progress Steps */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 h-full flex flex-col"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Booking Steps</h3>
              <div className="space-y-6 flex-grow">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
                      currentStep >= step.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-500'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                      currentStep >= step.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step.id}
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{step.title}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {step.id === 1 && "Enter your personal details"}
                        {step.id === 2 && "Tell us about your trip"}
                        {step.id === 3 && "Choose your vehicle"}
                        {step.id === 4 && "Review and confirm"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 h-full flex flex-col"
            >
              <div className="flex-grow">
                {renderStepContent()}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {currentStep < 4 ? (
                  <button
                    onClick={nextStep}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <FaPaperPlane />
                    {submitting ? "Submitting..." : "Confirm Booking"}
                  </button>
  )}
</div>

              {/* Feedback Message */}
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-6 p-4 rounded-xl text-center font-medium ${
                    message.includes("✅") 
                      ? "bg-green-50 text-green-700 border border-green-200" 
                      : message.includes("❌") 
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                  }`}
                >
                  {message}
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Contact Options */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Help with Your Booking?</h3>
            <p className="text-gray-600 mb-6">Our team is here to assist you with any questions or special requirements</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+919876543210"
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <FaPhoneAlt />
                Call Us: +91 98765 43210
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <FaWhatsapp />
                WhatsApp Us
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}