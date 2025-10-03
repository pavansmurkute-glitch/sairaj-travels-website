
// React Imports
import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";

// Context & Components
import { useOverlay } from "./context/OverlayContext";
import ProcessingOverlay from "./components/ProcessingOverlay";

// API
import { apiMethods } from "./services/api";

// Page Components
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";
import FleetPage from "./pages/FleetPage";
import BookingPage from "./pages/BookingPage";
import VehicleDetailsPage from "./pages/VehicleDetailsPage";
import DriverExpertisePage from "./pages/DriverExpertisePage";
import DriverDetailsPage from "./pages/DriverDetailsPage";
import TripPlanner from "./pages/TripPlanner";
import ContactUs from "./pages/ContactUs";
import Enquiry from "./pages/Enquiry";
import GalleryPage from "./pages/GalleryPage";
import PackagesPage from "./pages/PackagesPage";

// Admin Components
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBookings from "./pages/AdminBookings";
import AdminEnquiries from "./pages/AdminEnquiries";
import AdminPackages from "./pages/AdminPackages";
import AdminVehicles from "./pages/AdminVehicles";
import AdminDrivers from "./pages/AdminDrivers";
import AdminContact from "./pages/AdminContact";
import AdminTestimonials from "./pages/AdminTestimonials";
import AdminReports from "./pages/AdminReports";

// Assets
import heroCar from "./assets/hero_car_photo.avif";







export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showBooking, setShowBooking] = useState(false);
  
  // Check if current route is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [isClosing, setIsClosing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { processing, setProcessing } = useOverlay();

  // Package state management
  const [topPackages, setTopPackages] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(false);

  // Testimonials state management
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(false);

  // Contact info state management
  const [contactInfo, setContactInfo] = useState(null);
  const [contactLoading, setContactLoading] = useState(false);

// Fetch top packages for Popular Routes section
const fetchTopPackages = async () => {
  try {
    setPackagesLoading(true);
    const response = await apiMethods.get('/packages');
    const allPackages = response.data || [];
    
    // Get top 3 packages - prioritize featured packages, then by sort order
    const sortedPackages = allPackages
      .filter(pkg => pkg.isActive)
      .sort((a, b) => {
        // First sort by featured status
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        // Then by sort order
        if (a.sortOrder !== null && b.sortOrder !== null) {
          return a.sortOrder - b.sortOrder;
        }
        if (a.sortOrder !== null) return -1;
        if (b.sortOrder !== null) return 1;
        // Finally by package ID
        return a.packageId - b.packageId;
      })
      .slice(0, 3);
    
    setTopPackages(sortedPackages);
  } catch (error) {
    console.error('Error fetching top packages:', error);
    // Fallback to default packages if API fails
    setTopPackages([
      {
        packageId: 1,
        packageName: "Pune → Mumbai Airport",
        packageDescription: "Pickup/Drop service with professional drivers and comfortable journey",
        packagePrice: 2500,
        packageImageUrl: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=800&q=80",
        isFeatured: true
      },
      {
        packageId: 2,
        packageName: "Pune → Goa Trip",
        packageDescription: "Complete package for your beach vacation with accommodation",
        packagePrice: 8500,
        packageImageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        isFeatured: true
      },
      {
        packageId: 3,
        packageName: "Pune → Shirdi Darshan",
        packageDescription: "Spiritual journey with experienced drivers and comfortable travel",
        packagePrice: 3200,
        packageImageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        isFeatured: true
      }
    ]);
  } finally {
    setPackagesLoading(false);
  }
};

// Fetch testimonials for What Our Customers Say section
const fetchTestimonials = async () => {
  try {
    setTestimonialsLoading(true);
    const response = await apiMethods.get('/testimonials/active');
    setTestimonials(response.data || []);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    // Fallback to default testimonials if API fails
    setTestimonials([
      {
        id: 1,
        customerName: "Rajesh Kumar",
        customerType: "Family Trip Customer",
        testimonialText: "Excellent service! The driver was professional and the vehicle was spotless. Highly recommended for family trips.",
        rating: 5,
        avatarLetter: "R"
      },
      {
        id: 2,
        customerName: "Priya Sharma",
        customerType: "Corporate Client",
        testimonialText: "Perfect for corporate events. Punctual, reliable, and accommodating. Our team was very satisfied.",
        rating: 5,
        avatarLetter: "P"
      },
      {
        id: 3,
        customerName: "Suresh Patel",
        customerType: "Pilgrimage Customer",
        testimonialText: "Used their services for pilgrimage tours. Comfortable and safe journey. Will definitely use again.",
        rating: 5,
        avatarLetter: "S"
      }
    ]);
  } finally {
    setTestimonialsLoading(false);
  }
};

// Fetch contact info for footer and WhatsApp links
const fetchContactInfo = async () => {
  try {
    setContactLoading(true);
    console.log('🔍 Fetching contact info...');
    const response = await apiMethods.get('/contact');
    console.log('✅ Contact info received:', response.data);
    setContactInfo(response.data);
  } catch (error) {
    console.error('❌ Error fetching contact info:', error);
    // Fallback to default contact info if API fails
    setContactInfo({
      phoneOffice: '+91 9850748273',
      phoneMobile: '+91 9850748273',
      emailPrimary: 'info@sairajtravels.com',
      addressLine1: 'Pune',
      addressLine2: 'Maharashtra'
    });
  } finally {
    setContactLoading(false);
  }
};

useEffect(() => {
  setProcessing(true);
  const timer = setTimeout(() => setProcessing(false), 500);
  return () => clearTimeout(timer);
}, [location]); // ✅ only location

// Fetch top packages, testimonials, and contact info when component mounts
useEffect(() => {
  fetchTopPackages();
  fetchTestimonials();
  fetchContactInfo();
}, []);

  return (

    <div className="font-sans text-gray-800 flex flex-col min-h-screen bg-gray-50">

              {/* 🔹 Processing Overlay */}
              {processing && <ProcessingOverlay />}
      {/* Simple Professional Navbar - Hide on admin routes */}
      {!isAdminRoute && (
      <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Brand */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex items-center bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full p-1.5 sm:p-2 shadow-lg">
                <img src="/bus.png" alt="Sairaj Travels Logo" className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900">SAIRAJ TRAVELS</h1>
                <p className="text-xs text-gray-500 -mt-1">Your Trusted Travel Partner</p>
              </div>
              <div className="block sm:hidden">
                <h1 className="text-lg font-bold text-gray-900">SAIRAJ</h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === "/" 
                    ? "text-blue-600 bg-blue-50" 
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === "/about" 
                    ? "text-blue-600 bg-blue-50" 
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                About Us
              </Link>
              <Link 
                to="/services" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === "/services" 
                    ? "text-blue-600 bg-blue-50" 
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                Services
              </Link>
              <Link 
                to="/gallery" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === "/gallery" 
                    ? "text-blue-600 bg-blue-50" 
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                Gallery
              </Link>
              <Link 
                to="/packages" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === "/packages" 
                    ? "text-blue-600 bg-blue-50" 
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                Packages
              </Link>
              <Link 
                to="/contact" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === "/contact" 
                    ? "text-blue-600 bg-blue-50" 
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                Contact
              </Link>
              <Link 
                to="/trip-planner" 
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Trip Planner
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 bg-white">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link 
                  to="/" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === "/" 
                      ? "text-blue-600 bg-blue-50" 
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  Home
                </Link>
                <Link 
                  to="/about" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === "/about" 
                      ? "text-blue-600 bg-blue-50" 
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  About Us
                </Link>
                <Link 
                  to="/services" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === "/services" 
                      ? "text-blue-600 bg-blue-50" 
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  Services
                </Link>
                <Link 
                  to="/gallery" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === "/gallery" 
                      ? "text-blue-600 bg-blue-50" 
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  Gallery
                </Link>
                <Link 
                  to="/packages" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === "/packages" 
                      ? "text-blue-600 bg-blue-50" 
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  Packages
                </Link>
                <Link 
                  to="/contact" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === "/contact" 
                      ? "text-blue-600 bg-blue-50" 
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  Contact
                </Link>
                <Link 
                  to="/trip-planner" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-base font-semibold text-center"
                >
                  Trip Planner
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-grow">
        {/* ROUTES for secondary pages */}
        <Routes>

            <Route path="/about" element={<AboutUs />} />
            <Route path="/services" element={<Services />} />
            <Route path="/fleet" element={<FleetPage />} />
            <Route path="/vehicles/:id" element={<VehicleDetailsPage />} />
            <Route path="/drivers" element={<DriverExpertisePage />} />
            <Route path="/drivers/:id" element={<DriverDetailsPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/booking/:vehicleId" element={<BookingPage />} />
            <Route path="/trip-planner" element={<TripPlanner />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/enquiry" element={<Enquiry />} />
             <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/packages" element={<PackagesPage />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/enquiries" element={<AdminEnquiries />} />
            <Route path="/admin/packages" element={<AdminPackages />} />
            <Route path="/admin/vehicles" element={<AdminVehicles />} />
            <Route path="/admin/drivers" element={<AdminDrivers />} />
            <Route path="/admin/contact" element={<AdminContact />} />
            <Route path="/admin/testimonials" element={<AdminTestimonials />} />
            <Route path="/admin/reports" element={<AdminReports />} />

          {/* add other routes here later */}
        </Routes>

        {/* Hero + Homepage Sections only show on Home */}
        {location.pathname === "/" && (
          <>
            {/* Professional Hero Section */}
            <section
              className="relative h-screen bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${heroCar})` }}
            >
              {/* Professional gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="max-w-4xl mx-auto"
                >
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent drop-shadow-2xl">
                  Comfort on Every Journey
                  </h1>
                  <p className="text-lg md:text-2xl lg:text-3xl text-gray-100 max-w-4xl mb-8 leading-relaxed font-light">
                    Travel in style with our premium 17-seater Urbania bus – 
                    <span className="text-yellow-300 font-semibold"> Pune, Mumbai, Shirdi, and Goa</span> trips.
                  </p>
                  
                  {/* Trust Indicators */}
                  <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm md:text-base">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white">
                      <span className="mr-2">⭐</span>
                      <span>4.9/5 Rating</span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white">
                      <span className="mr-2">🛡️</span>
                      <span>Licensed & Insured</span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white">
                      <span className="mr-2">🚌</span>
                      <span>Premium Fleet</span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white">
                      <span className="mr-2">⏰</span>
                      <span>24/7 Service</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center w-full max-w-md sm:max-w-none">
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                              onClick={() => navigate("/booking")}
                      className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 px-8 sm:px-10 py-4 rounded-xl font-bold text-base sm:text-lg shadow-2xl hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 hover:shadow-3xl min-h-[48px]"
                    >
                      🚌 Book Your Ride
                    </motion.button>
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6, duration: 0.6 }}
                    onClick={() => {
                      const phoneNumber = contactInfo?.phoneMobile || contactInfo?.phoneOffice || '919850748273';
                      const cleanPhone = phoneNumber.replace(/[^\d]/g, '');
                      window.open(
                        `https://wa.me/${cleanPhone}?text=Hi, I want to know about your travel services`,
                        "_blank"
                      );
                    }}
                      className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 text-white px-8 sm:px-10 py-4 rounded-xl font-bold text-base sm:text-lg shadow-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 hover:shadow-3xl min-h-[48px]"
                  >
                      💬 WhatsApp Now
                    </motion.button>
                </div>
                </motion.div>

              </div>

              {/* Booking Dialog */}
              {showBooking && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-40 flex justify-end items-end z-50"
                  onClick={() => setIsClosing(true)} // click outside closes
                >
                  <div
                    className={`bg-white w-full sm:w-96 rounded-t-xl shadow-xl transform
                      ${isClosing ? "animate-slide-out" : "animate-slide-in"}`}
                    style={{ maxHeight: "80vh" }}
                    onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
                    onAnimationEnd={() => {
                      if (isClosing) {
                        setShowBooking(false);
                        setIsClosing(false);
                      }
                    }}
                  >
                    {/* Header */}
                    <div className="flex justify-between items-center px-4 py-3 border-b">
                      <h3 className="text-lg font-bold text-gray-800">Book Your Trip</h3>
                      <button
                        onClick={() => setIsClosing(true)}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                      >
                        ✖
                      </button>
                    </div>

                    {/* Form */}
                    <div className="p-4 space-y-4 overflow-y-auto">
                      <input type="text" placeholder="Destination" className="w-full border rounded-lg p-2" />
                      <input type="date" className="w-full border rounded-lg p-2" />
                      <input type="date" className="w-full border rounded-lg p-2" />
                      <input type="number" placeholder="Passengers" className="w-full border rounded-lg p-2" />
                      <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Key Features Section */}
            <section className="relative -mt-20 z-10">
              <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="bg-white shadow-lg rounded-xl p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                      Why Choose <span className="text-blue-600">Sairaj Travels</span>?
                    </h2>
                    <p className="text-base text-gray-600 max-w-2xl mx-auto">Experience the difference with our premium travel services</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl">🛡️</span>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mb-2">100% Safe</h3>
                      <p className="text-sm text-gray-600">Licensed & insured with experienced drivers</p>
                    </div>
                    
                    <div className="text-center p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl">🚌</span>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mb-2">Premium Fleet</h3>
                      <p className="text-sm text-gray-600">17-seater Urbania with modern amenities</p>
                    </div>
                    
                    <div className="text-center p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl">⭐</span>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mb-2">5+ Years</h3>
                      <p className="text-sm text-gray-600">Trusted experience across Maharashtra</p>
                    </div>
                    
                    <div className="text-center p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl">📞</span>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mb-2">24/7 Support</h3>
                      <p className="text-sm text-gray-600">Round-the-clock customer assistance</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Customer Testimonials */}
            <section className="py-16 bg-gray-50">
              <div className="max-w-6xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">What Our Customers Say</h2>
                  <p className="text-base text-gray-600 max-w-2xl mx-auto">Trusted by hundreds of satisfied customers across Maharashtra</p>
                </div>
                
                {testimonialsLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading testimonials...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial) => (
                      <div key={testimonial.id} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-blue-600">
                        <div className="flex items-center mb-4">
                          <div className="flex text-yellow-400 text-lg">
                            {Array.from({ length: testimonial.rating }, (_, i) => (
                              <span key={i}>★</span>
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-4 text-sm italic leading-relaxed">
                          "{testimonial.testimonialText}"
                        </p>
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3 text-sm">
                            {testimonial.avatarLetter}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 text-sm">{testimonial.customerName}</div>
                            <div className="text-gray-600 text-xs">{testimonial.customerType}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Fleet Section */}
            <section id="fleet" className="py-16 bg-white">
              <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Our Fleet & Services</h2>
                  <p className="text-base text-gray-600 max-w-2xl mx-auto">Premium vehicles and professional drivers for your comfort</p>
                </div>
                
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                    <div className="relative overflow-hidden">
                      <img src="/public/select_car.jpg" alt="Available Rental Vehicles" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Premium Fleet</h3>
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">17-seater Urbania with modern amenities, comfortable seating, and climate control</p>
                      <button
                        onClick={() => navigate("/fleet")}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 text-sm"
                      >
                        View Fleet
                      </button>
                    </div>
                  </div>
                  
                  <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                    <div className="relative overflow-hidden">
                      <img src="/driver_skill.jpg" alt="Driver Expertise" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Expert Drivers</h3>
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">Professional drivers with extensive route knowledge and safety training</p>
                      <button
                        onClick={() => navigate("/drivers")}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 text-sm"
                      >
                        Meet Drivers
                      </button>
                    </div>
                  </div>
                  
                  <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                    <div className="relative overflow-hidden">
                      <img src="/public/our_services.jpg" alt="Our Services" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Complete Services</h3>
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">End-to-end travel solutions including booking, planning, and support</p>
                      <button
                        onClick={() => navigate("/services")}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 text-sm"
                      >
                        View Services
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Featured Packages */}
            <section className="py-16 bg-gray-50">
              <div className="max-w-6xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Popular Packages</h2>
                  <p className="text-base text-gray-600 max-w-2xl mx-auto">Most requested travel packages with competitive pricing and premium service</p>
                </div>
                
                {packagesLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading packages...</span>
                  </div>
                ) : (
                  <div className="grid lg:grid-cols-3 gap-8">
                    {topPackages.map((pkg, index) => {
                      // Determine badge text based on package category or position
                      const getBadgeText = () => {
                        if (pkg.packageCategoryId === 'airport') return 'Popular';
                        if (pkg.packageCategoryId === 'family') return 'Best Value';
                        if (pkg.packageCategoryId === 'pilgrimage') return 'Spiritual';
                        if (index === 0) return 'Popular';
                        if (index === 1) return 'Best Value';
                        return 'Featured';
                      };

                      return (
                        <div key={pkg.packageId} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                          <div className="relative">
                            <img 
                              src={pkg.packageImageUrl || "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=800&q=80"} 
                              alt={pkg.packageName} 
                              className="w-full h-48 object-cover" 
                            />
                            <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                              {getBadgeText()}
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{pkg.packageName}</h3>
                            <p className="text-gray-600 mb-4 text-sm leading-relaxed">{pkg.packageDescription}</p>
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="text-2xl font-bold text-blue-600">₹{pkg.packagePrice?.toLocaleString()}</span>
                                <span className="text-gray-500 text-xs ml-2">
                                  {pkg.packageCategoryId === 'family' ? 'per person' : 'per trip'}
                                </span>
                              </div>
                              <button 
                                onClick={() => navigate("/booking")}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 text-sm"
                              >
                                Book Now
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-12 bg-gradient-to-r from-blue-800 to-blue-700 text-white">
              <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
                <h2 className="text-xl md:text-2xl font-bold mb-3">
                  Ready to Start Your Journey?
                </h2>
                <p className="text-base text-blue-100 mb-6 max-w-2xl mx-auto">
                  Book your next trip with Sairaj Travels and experience premium service
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <button
                    onClick={() => navigate("/booking")}
                    className="bg-yellow-400 text-blue-900 px-6 py-2 rounded-lg font-bold text-base hover:bg-yellow-500 transition-all duration-300 shadow-lg"
                  >
                    🚌 Book Now
                  </button>
                  <button
                    onClick={() => {
                      const phoneNumber = contactInfo?.phoneMobile || contactInfo?.phoneOffice || '919850748273';
                      const cleanPhone = phoneNumber.replace(/[^\d]/g, '');
                      window.open(`https://wa.me/${cleanPhone}?text=Hi, I want to know about your travel services`, "_blank");
                    }}
                    className="bg-green-500 text-white px-6 py-2 rounded-lg font-bold text-base hover:bg-green-600 transition-all duration-300 shadow-lg"
                  >
                    💬 WhatsApp
                  </button>
                </div>
                <div className="flex items-center justify-center space-x-4 text-xs mt-4">
                  <span className="flex items-center">📞 {contactInfo?.phoneMobile || contactInfo?.phoneOffice || '+91 9850748273'}</span>
                  <span className="flex items-center">✉️ {contactInfo?.emailPrimary || 'info@sairajtravels.com'}</span>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Enhanced Professional Footer - Hide on admin routes */}
      {!isAdminRoute && (
      <footer className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full p-2 shadow-lg">
                  <img src="/bus.png" alt="Sairaj Travels Logo" className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">SAIRAJ TRAVELS</h3>
                  <p className="text-blue-200 text-sm">Your Trusted Travel Partner Since 2019</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4 max-w-md">
                Experience premium travel services with our modern fleet and professional drivers. 
                Your comfort and safety are our top priorities.
              </p>
              <div className="flex space-x-4">
                <div className="flex items-center text-sm text-gray-300">
                  <span className="mr-2">⭐</span>
                  <span>4.9/5 Rating</span>
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <span className="mr-2">🛡️</span>
                  <span>Licensed & Insured</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-yellow-400">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">About Us</Link></li>
                <li><Link to="/services" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">Our Services</Link></li>
                <li><Link to="/fleet" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">Our Fleet</Link></li>
                <li><Link to="/gallery" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">Gallery</Link></li>
                <li><Link to="/contact" className="text-gray-300 hover:text-yellow-400 transition-colors text-sm">Contact Us</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-yellow-400">Contact Info</h4>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-300">
                  <span className="mr-3">📞</span>
                  <span>{contactInfo?.phoneMobile || contactInfo?.phoneOffice || '+91 9850748273'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <span className="mr-3">✉️</span>
                  <span>{contactInfo?.emailPrimary || 'info@sairajtravels.com'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <span className="mr-3">📍</span>
                  <span>{contactInfo?.addressCity && contactInfo?.addressState ? `${contactInfo.addressCity}, ${contactInfo.addressState}` : 'Pune, Maharashtra'}</span>
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <span className="mr-3">🕒</span>
                  <span>24/7 Service Available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-blue-800 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
              <p className="text-sm text-gray-400">
                © 2024 Sairaj Travels. All rights reserved. | Licensed Travel Operator
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>Privacy Policy</span>
                <span>•</span>
                <span>Terms of Service</span>
                <span>•</span>
                <Link to="/admin/login" className="text-yellow-400 hover:text-yellow-300 transition-colors">
                  🔐 Admin Login
                </Link>
                <span>•</span>
                <span>Powered by <span className="text-yellow-400 font-semibold">SanjTiksha Roots & Wings</span></span>
              </div>
            </div>
          </div>
        </div>
      </footer>
      )}
    </div>
  );
}
