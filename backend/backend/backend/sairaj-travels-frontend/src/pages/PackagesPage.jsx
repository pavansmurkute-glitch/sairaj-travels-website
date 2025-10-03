import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { apiMethods } from "../services/api";
import {
  FaUsers,
  FaBriefcase,
  FaPrayingHands,
  FaPlane,
  FaMapMarkerAlt,
  FaClock,
  FaStar,
  FaCheckCircle,
  FaPhone,
  FaWhatsapp,
  FaCalendarAlt,
  FaBus,
  FaShieldAlt,
  FaUtensils,
  FaHotel,
  FaCamera,
  FaGift,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

export default function PackagesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [packages, setPackages] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const packageCategories = [
    {
      id: "family",
      title: "Family Packages",
      icon: <FaUsers className="text-3xl text-blue-600" />,
      description: "Perfect for family vacations and weekend getaways",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      id: "corporate",
      title: "Corporate Packages",
      icon: <FaBriefcase className="text-3xl text-green-600" />,
      description: "Professional travel solutions for business needs",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      id: "pilgrimage",
      title: "Pilgrimage Packages",
      icon: <FaPrayingHands className="text-3xl text-purple-600" />,
      description: "Spiritual journeys to sacred destinations",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      id: "airport",
      title: "Airport Transfers",
      icon: <FaPlane className="text-3xl text-orange-600" />,
      description: "Reliable airport pickup and drop services",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    }
  ];

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Try to fetch packages from the new packages API first
        try {
          const packagesResponse = await apiMethods.get('/packages');
          setPackages(packagesResponse.data);
        } catch (packagesError) {
          console.log('Packages API not available, falling back to vehicles and routes');
          // Fallback to vehicles and routes if packages API is not available
          const [vehiclesResponse, routesResponse] = await Promise.all([
            apiMethods.get('/vehicles'),
            apiMethods.get('/routes')
          ]);
          
          setVehicles(vehiclesResponse.data);
          setRoutes(routesResponse.data);
          
          // Generate packages from database data
          const generatedPackages = generatePackagesFromData(vehiclesResponse.data, routesResponse.data);
          setPackages(generatedPackages);
        }
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load packages. Please try again later.');
        // Fallback to static packages if API fails
        setPackages(popularPackages);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to generate packages from database data
  const generatePackagesFromData = (vehiclesData, routesData) => {
    const generatedPackages = [];
    
    // Create packages based on vehicles and routes
    vehiclesData.forEach((vehicle, index) => {
      routesData.forEach((route, routeIndex) => {
        if (index < 6 && routeIndex < 3) { // Limit to 6 packages
          const packageId = generatedPackages.length + 1;
          const basePrice = Math.floor(Math.random() * 5000) + 2000; // Random price between 2000-7000
          const discount = Math.floor(Math.random() * 20) + 10; // Random discount 10-30%
          const originalPrice = Math.floor(basePrice / (1 - discount / 100));
          
          // Determine category based on vehicle type
          let categoryId = "family";
          let category = "Family Package";
          if (vehicle.type?.toLowerCase().includes("bus") || vehicle.capacity > 15) {
            categoryId = "corporate";
            category = "Corporate Package";
          } else if (vehicle.type?.toLowerCase().includes("van")) {
            categoryId = "airport";
            category = "Airport Transfer";
          }
          
          // Special packages for specific routes
          if (route.destination?.toLowerCase().includes("shirdi")) {
            categoryId = "pilgrimage";
            category = "Pilgrimage Package";
          }
          
          const packageData = {
            id: packageId,
            title: `${route.source} to ${route.destination} ${vehicle.name}`,
            category: category,
            categoryId: categoryId,
            duration: route.durationHrs ? `${Math.round(route.durationHrs)} Hours` : "3-4 Hours",
            price: `₹${basePrice.toLocaleString()}`,
            originalPrice: `₹${originalPrice.toLocaleString()}`,
            discount: `${discount}%`,
            priceValue: basePrice,
            image: vehicle.mainImageUrl || `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80`,
            features: [
              vehicle.isAC ? "AC Vehicle" : "Non-AC Vehicle",
              `${vehicle.capacity} Seater`,
              "Professional Driver",
              "On-Time Service",
              "24/7 Support"
            ],
            highlights: ["Popular", "Best Value"],
            rating: (4.5 + Math.random() * 0.5).toFixed(1),
            reviews: Math.floor(Math.random() * 200) + 50,
            description: `${vehicle.description || `Comfortable ${vehicle.name} for your journey from ${route.source} to ${route.destination}.`}`,
            vehicle: vehicle,
            route: route
          };
          
          generatedPackages.push(packageData);
        }
      });
    });
    
    return generatedPackages.slice(0, 6); // Return max 6 packages
  };

  const popularPackages = [
    {
      id: 1,
      title: "Pune to Mumbai Airport Transfer",
      category: "Airport Transfer",
      categoryId: "airport",
      duration: "3-4 Hours",
      price: "₹2,500",
      originalPrice: "₹3,000",
      discount: "17%",
      priceValue: 2500,
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      features: [
        "Professional Driver",
        "AC Vehicle",
        "On-Time Service",
        "Luggage Assistance",
        "24/7 Support"
      ],
      highlights: ["Popular", "Best Value"],
      rating: 4.9,
      reviews: 150,
      description: "Comfortable and reliable airport transfer service with experienced drivers and modern vehicles."
    },
    {
      id: 2,
      title: "Goa Beach Vacation Package",
      category: "Family Package",
      categoryId: "family",
      duration: "3 Days / 2 Nights",
      price: "₹8,500",
      originalPrice: "₹10,000",
      discount: "15%",
      priceValue: 8500,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
      features: [
        "Transportation",
        "Hotel Accommodation",
        "Sightseeing",
        "Meals Included",
        "Beach Activities"
      ],
      highlights: ["Family Friendly", "All Inclusive"],
      rating: 4.8,
      reviews: 89,
      description: "Complete beach vacation package with accommodation, meals, and transportation included."
    },
    {
      id: 3,
      title: "Shirdi Darshan Package",
      category: "Pilgrimage",
      categoryId: "pilgrimage",
      duration: "2 Days / 1 Night",
      price: "₹3,200",
      originalPrice: "₹3,800",
      discount: "16%",
      priceValue: 3200,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
      features: [
        "Temple Darshan",
        "Accommodation",
        "Meals",
        "Transportation",
        "Guide Service"
      ],
      highlights: ["Spiritual", "Comfortable"],
      rating: 4.9,
      reviews: 120,
      description: "Peaceful spiritual journey with comfortable accommodation and temple darshan arrangements."
    },
    {
      id: 4,
      title: "Corporate Team Outing",
      category: "Corporate Package",
      categoryId: "corporate",
      duration: "1 Day",
      price: "₹4,500",
      originalPrice: "₹5,000",
      discount: "10%",
      priceValue: 4500,
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
      features: [
        "Professional Service",
        "Team Building Activities",
        "Refreshments",
        "Photography",
        "Flexible Schedule"
      ],
      highlights: ["Corporate", "Team Building"],
      rating: 4.7,
      reviews: 65,
      description: "Perfect for corporate team outings with professional service and team building activities."
    },
    {
      id: 5,
      title: "Lonavala Hill Station Package",
      category: "Family Package",
      categoryId: "family",
      duration: "2 Days / 1 Night",
      price: "₹5,800",
      originalPrice: "₹6,500",
      discount: "11%",
      priceValue: 5800,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
      features: [
        "Hill Station Visit",
        "Scenic Views",
        "Local Cuisine",
        "Photography Spots",
        "Comfortable Stay"
      ],
      highlights: ["Scenic", "Relaxing"],
      rating: 4.6,
      reviews: 95,
      description: "Escape to the beautiful hill station with scenic views and comfortable accommodation."
    },
    {
      id: 6,
      title: "Mumbai City Tour Package",
      category: "Family Package",
      categoryId: "family",
      duration: "1 Day",
      price: "₹3,500",
      originalPrice: "₹4,000",
      discount: "13%",
      priceValue: 3500,
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      features: [
        "City Sightseeing",
        "Local Guide",
        "Photography",
        "Local Food",
        "Shopping"
      ],
      highlights: ["City Tour", "Cultural"],
      rating: 4.8,
      reviews: 110,
      description: "Explore the vibrant city of Mumbai with our comprehensive city tour package."
    }
  ];

  const specialOffers = [
    {
      title: "Early Bird Discount",
      description: "Book 15 days in advance and get 20% off",
      icon: <FaCalendarAlt className="text-2xl text-green-600" />,
      color: "bg-green-100 border-green-300"
    },
    {
      title: "Group Booking",
      description: "Groups of 10+ get special rates",
      icon: <FaUsers className="text-2xl text-blue-600" />,
      color: "bg-blue-100 border-blue-300"
    },
    {
      title: "Weekend Special",
      description: "Extra 10% off on weekend bookings",
      icon: <FaGift className="text-2xl text-purple-600" />,
      color: "bg-purple-100 border-purple-300"
    }
  ];

  // Filter packages based on search term, category, and price range
  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.packageName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.packageDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.packageCategory?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || pkg.packageCategoryId === selectedCategory;
    
    const priceValue = pkg.packagePrice || 0;
    const matchesPrice = priceRange === "all" || 
                        (priceRange === "under-3000" && priceValue < 3000) ||
                        (priceRange === "3000-5000" && priceValue >= 3000 && priceValue <= 5000) ||
                        (priceRange === "5000-8000" && priceValue > 5000 && priceValue <= 8000) ||
                        (priceRange === "above-8000" && priceValue > 8000);
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-16 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-white opacity-10 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white opacity-10 rounded-full animate-pulse delay-2000"></div>
          <div className="absolute bottom-10 right-1/3 w-24 h-24 bg-white opacity-10 rounded-full animate-pulse delay-3000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Travel <span className="text-yellow-300">Packages</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto"
            >
              Discover our curated travel packages designed for every occasion - from family vacations to corporate trips and spiritual journeys.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => navigate("/booking")}
                className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Book Now
              </button>
              <button
                onClick={() => window.open("https://wa.me/919850748273?text=Hi, I want to know about your travel packages", "_blank")}
                className="bg-green-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <FaWhatsapp className="inline mr-2" />
                WhatsApp
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="flex-1 w-full lg:w-auto">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search packages by name, description, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="w-full lg:w-auto">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full lg:w-48 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="family">Family Packages</option>
                  <option value="corporate">Corporate Packages</option>
                  <option value="pilgrimage">Pilgrimage Packages</option>
                  <option value="airport">Airport Transfers</option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="w-full lg:w-auto">
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full lg:w-48 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Prices</option>
                  <option value="under-3000">Under ₹3,000</option>
                  <option value="3000-5000">₹3,000 - ₹5,000</option>
                  <option value="5000-8000">₹5,000 - ₹8,000</option>
                  <option value="above-8000">Above ₹8,000</option>
                </select>
              </div>

              {/* Clear Filters Button */}
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setPriceRange("all");
                }}
                className="w-full lg:w-auto bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-300 flex items-center justify-center"
              >
                <FaFilter className="mr-2" />
                Clear Filters
              </button>
            </div>

            {/* Results Count */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-blue-600">{filteredPackages.length}</span> of <span className="font-semibold">{packages.length}</span> packages
              </p>
              {filteredPackages.length === 0 && (
                <p className="text-red-500 font-medium">No packages found matching your criteria</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Package Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Package <span className="text-blue-600">Categories</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our diverse range of travel packages tailored to your needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packageCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`${category.bgColor} ${category.borderColor} border-2 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer`}
              >
                <div className="text-center">
                  <div className="mb-4">{category.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{category.title}</h3>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Packages */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {filteredPackages.length === packages.length ? "Popular" : "Filtered"} <span className="text-blue-600">Packages</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {filteredPackages.length === packages.length 
                ? "Our most requested travel packages with competitive pricing and premium service"
                : `Found ${filteredPackages.length} packages matching your search criteria`
              }
            </p>
          </div>
          
          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading packages...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-600 font-medium">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Packages Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPackages.map((pkg, index) => (
              <motion.div
                key={pkg.packageId}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
              >
                {/* Package Image */}
                <div className="relative">
                  <img
                    src={pkg.packageImageUrl}
                    alt={pkg.packageName}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    {pkg.packageHighlights && pkg.packageHighlights.map((highlight, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
                    {pkg.discountPercentage}% OFF
                  </div>
                </div>
                
                {/* Package Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">{pkg.packageCategory}</span>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="text-sm font-semibold">{pkg.rating}</span>
                      <span className="text-sm text-gray-500 ml-1">({pkg.reviewsCount})</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.packageName}</h3>
                  <p className="text-gray-600 text-sm mb-4">{pkg.packageDescription}</p>
                  
                  <div className="flex items-center mb-4">
                    <FaClock className="text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{pkg.packageDuration}</span>
                  </div>
                  
                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Package Includes:</h4>
                    <div className="grid grid-cols-1 gap-1">
                      {pkg.packageFeatures && pkg.packageFeatures.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-600">
                          <FaCheckCircle className="text-green-500 mr-2 text-xs" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Pricing */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">₹{pkg.packagePrice?.toLocaleString()}</span>
                      {pkg.originalPrice && (
                        <span className="text-sm text-gray-500 ml-2 line-through">₹{pkg.originalPrice?.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate("/booking")}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 text-sm"
                    >
                      Book Now
                    </button>
                    <button
                      onClick={() => window.open("https://wa.me/919850748273?text=Hi, I want to know about " + pkg.packageName, "_blank")}
                      className="bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition-all duration-300 text-sm"
                    >
                      <FaWhatsapp />
                    </button>
                  </div>
                </div>
              </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Special <span className="text-blue-600">Offers</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Don't miss out on these exclusive deals and discounts
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {specialOffers.map((offer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`${offer.color} border-2 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}
              >
                <div className="text-center">
                  <div className="mb-4">{offer.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{offer.title}</h3>
                  <p className="text-gray-600">{offer.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Choose from our wide range of packages and let us make your travel dreams come true!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/booking")}
                className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Book Your Package
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}