import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaBriefcase,
  FaPrayingHands,
  FaPlane,
  FaShuttleVan,
  FaUserTie,
  FaShieldAlt,
  FaClock,
  FaSmile,
  FaCheckCircle,
  FaStar,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function Services() {
  const navigate = useNavigate();

  const services = [
    {
      image: "/Serv_family.avif",
      icon: <FaUsers className="text-2xl text-white" />,
      title: "Family Trips",
      desc: "Luxury buses for weddings, vacations, and weekend getaways with complete comfort and safety.",
      features: ["Luxury AC Buses", "Experienced Drivers", "Family-Friendly", "Safe Travel"],
      color: "from-blue-500 to-blue-600"
    },
    {
      image: "/Serv_corp.avif",
      icon: <FaBriefcase className="text-2xl text-white" />,
      title: "Corporate Tours",
      desc: "Professional office travel, conferences & team outings with punctual and reliable service.",
      features: ["Professional Service", "On-Time Delivery", "Corporate Comfort", "Reliable Transport"],
      color: "from-green-500 to-green-600"
    },
    {
      image: "/serv_pilgrimage.avif",
      icon: <FaPrayingHands className="text-2xl text-white" />,
      title: "Pilgrimage Tours",
      desc: "Peaceful and comfortable trips to Shirdi, Nashik, Pandharpur and other sacred destinations.",
      features: ["Sacred Destinations", "Comfortable Journey", "Spiritual Experience", "Safe Travel"],
      color: "from-purple-500 to-purple-600"
    },
    {
      image: "/serv_airport_trans.avif",
      icon: <FaPlane className="text-2xl text-white" />,
      title: "Airport Transfers",
      desc: "On-time and comfortable transfers between Pune, Mumbai, Goa airports with luxury vehicles.",
      features: ["On-Time Service", "Airport Pickup", "Luxury Vehicles", "24/7 Available"],
      color: "from-orange-500 to-orange-600"
    },
    {
      image: "/serv_bus.jpg",
      icon: <FaShuttleVan className="text-2xl text-white" />,
      title: "Rental Fleet",
      desc: "17-seater Urbania and premium cars available for any occasion with professional drivers.",
      features: ["Premium Vehicles", "Flexible Rental", "Professional Drivers", "Any Occasion"],
      color: "from-red-500 to-red-600"
    },
    {
      image: "/Serv_driver.avif",
      icon: <FaUserTie className="text-2xl text-white" />,
      title: "Skilled Drivers",
      desc: "Courteous, safe and experienced professional drivers at your service for all your travel needs.",
      features: ["Experienced Drivers", "Safe Driving", "Professional Service", "Licensed & Verified"],
      color: "from-indigo-500 to-indigo-600"
    },
  ];

  const features = [
    {
      icon: <FaShieldAlt className="text-3xl text-blue-600" />,
      title: "Safe & Secure",
      desc: "Your safety is our top priority with well-maintained vehicles and experienced drivers.",
      color: "bg-blue-50 border-blue-200"
    },
    {
      icon: <FaClock className="text-3xl text-green-600" />,
      title: "On-Time Service",
      desc: "Punctual pickups & drop-offs to ensure zero travel stress and timely arrivals.",
      color: "bg-green-50 border-green-200"
    },
    {
      icon: <FaSmile className="text-3xl text-yellow-600" />,
      title: "Comfort & Joy",
      desc: "Luxury interiors designed for maximum comfort and relaxation during your journey.",
      color: "bg-yellow-50 border-yellow-200"
    },
    {
      icon: <FaStar className="text-3xl text-purple-600" />,
      title: "Premium Quality",
      desc: "High-quality vehicles and exceptional service standards for your satisfaction.",
      color: "bg-purple-50 border-purple-200"
    },
    {
      icon: <FaCheckCircle className="text-3xl text-indigo-600" />,
      title: "Reliable Service",
      desc: "Consistent and dependable service you can count on for all your travel needs.",
      color: "bg-indigo-50 border-indigo-200"
    },
    {
      icon: <FaPhone className="text-3xl text-red-600" />,
      title: "24/7 Support",
      desc: "Round-the-clock customer support to assist you with any travel requirements.",
      color: "bg-red-50 border-red-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Consistent with App theme */}
      <section className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-12 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-white opacity-10 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white opacity-10 rounded-full animate-pulse delay-2000"></div>
          <div className="absolute bottom-10 right-1/3 w-24 h-24 bg-white opacity-10 rounded-full animate-pulse delay-3000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Discover Our
                <span className="block text-yellow-300">Premium Services</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                From family trips to corporate tours, we provide exceptional travel experiences with comfort, safety, and reliability.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => navigate("/booking")}
                  className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Book Now
                </button>
                <button
                  onClick={() => navigate("/enquiry")}
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
                >
                  Get Quote
                </button>
              </div>
            </motion.div>

            {/* Right Content - Service Highlights */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: <FaUsers className="text-2xl" />, text: "Family Trips", color: "bg-yellow-400" },
                { icon: <FaBriefcase className="text-2xl" />, text: "Corporate", color: "bg-green-400" },
                { icon: <FaPrayingHands className="text-2xl" />, text: "Pilgrimage", color: "bg-purple-400" },
                { icon: <FaPlane className="text-2xl" />, text: "Airport", color: "bg-orange-400" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                  className={`${item.color} p-6 rounded-2xl text-center text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}
                >
                  <div className="mb-3">{item.icon}</div>
                  <p className="font-semibold">{item.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              Our <span className="text-blue-600">Services</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Experience premium travel services tailored to your every need
            </motion.p>
          </div>

          {/* Services Grid with Alternating Layout */}
          <div className="space-y-16">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center`}
              >
                {/* Image */}
                <div className="w-full lg:w-1/2">
                  <div className="relative group">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-80 object-cover rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                    <div className={`absolute top-6 right-6 w-16 h-16 bg-gradient-to-r ${service.color} rounded-full flex items-center justify-center shadow-xl`}>
                      {service.icon}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="w-full lg:w-1/2">
                  <div className="bg-white p-8 rounded-2xl shadow-xl">
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">{service.title}</h3>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">{service.desc}</p>
                    
                    {/* Features */}
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Features:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-gray-700">
                            <FaCheckCircle className="text-green-500 mr-3 text-sm" />
                            <span className="font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={() => navigate("/booking")}
                        className="bg-blue-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      >
                        Book This Service
                      </button>
                      <button
                        onClick={() => navigate("/enquiry")}
                        className="bg-gray-100 text-gray-700 py-4 px-8 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all duration-300 border-2 border-gray-200"
                      >
                        Get Quote
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 opacity-20 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-200 opacity-20 rounded-full translate-y-40 -translate-x-40"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              Why Choose <span className="text-blue-600">Sairaj Travels?</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              We are committed to providing exceptional service with safety, comfort, and reliability at the core of everything we do.
            </motion.p>
          </div>

          {/* Features in Hexagonal Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className={`p-8 rounded-3xl ${feature.color} hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-200`}>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-700 leading-relaxed text-lg">{feature.desc}</p>
                  </div>
                  
                  {/* Decorative Element */}
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full opacity-60"></div>
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-yellow-400 rounded-full opacity-40"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white opacity-5 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-white opacity-5 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-white opacity-5 rounded-full animate-pulse delay-2000"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-white opacity-5 rounded-full animate-pulse delay-3000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="text-center lg:text-left"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Start Your
                <span className="block text-yellow-300">Journey?</span>
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Experience the difference with Sairaj Travels. Book your ride today and let us make your travel dreams come true!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => navigate("/booking")}
                  className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Book Your Ride
                </button>
                <button
                  onClick={() => navigate("/enquiry")}
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
                >
                  Get Free Quote
                </button>
              </div>
            </motion.div>

            {/* Right Content - Stats */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-8"
            >
              {[
                { number: "500+", label: "Happy Customers", color: "bg-yellow-400" },
                { number: "1000+", label: "Successful Trips", color: "bg-green-400" },
                { number: "24/7", label: "Customer Support", color: "bg-purple-400" },
                { number: "5★", label: "Service Rating", color: "bg-orange-400" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                  className={`${stat.color} p-6 rounded-2xl text-center text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}
                >
                  <div className="text-3xl font-bold mb-2">{stat.number}</div>
                  <div className="text-sm font-semibold">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}