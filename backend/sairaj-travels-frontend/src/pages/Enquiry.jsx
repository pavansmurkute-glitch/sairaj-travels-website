import { useState, useCallback } from "react";
import { FaUser, FaPhone, FaEnvelope, FaList, FaComments, FaPaperPlane, FaCheckCircle, FaClock, FaShieldAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { apiMethods } from "../services/api";

export default function Enquiry() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    service: "Family Trips",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone) {
      setFeedback("⚠️ Please fill in required fields.");
      return;
    }

    setSubmitting(true);
    setFeedback("");

    try {
      const response = await apiMethods.post("/enquiries", formData, {
        showSuccessMessage: false
      });

      setFeedback("✅ Enquiry submitted successfully!");
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        service: "Family Trips",
        message: "",
      });
    } catch (err) {
      console.error("Error submitting enquiry:", err);
      setFeedback("⚠️ Something went wrong. Please try again later.");
    }

    setSubmitting(false);
  };

  const services = [
    "Family Trips",
    "Corporate Tours", 
    "Pilgrimage",
    "Airport Transfers",
    "Rental Fleet",
    "Skilled Drivers"
  ];

  const benefits = [
    {
      icon: <FaCheckCircle className="text-2xl text-green-600" />,
      title: "Quick Response",
      desc: "We respond to all enquiries within 2 hours"
    },
    {
      icon: <FaClock className="text-2xl text-blue-600" />,
      title: "24/7 Support",
      desc: "Round-the-clock customer service available"
    },
    {
      icon: <FaShieldAlt className="text-2xl text-purple-600" />,
      title: "Secure & Safe",
      desc: "Your information is protected and secure"
    }
  ];

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-6 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black opacity-5"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent"
          >
            Get Your Free Quote
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-lg text-blue-100 max-w-3xl mx-auto leading-relaxed"
          >
            Tell us about your travel needs and we'll provide you with a personalized quote. No obligations, just great service!
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Benefits Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Us?</h3>
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                      {benefit.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                      <p className="text-gray-600">{benefit.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Enquiry Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Send Us Your Enquiry</h2>
                <p className="text-gray-600">Fill out the form below and we'll get back to you with a personalized quote</p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>

          <InputField
            icon={FaEnvelope}
            type="email"
            name="email"
                  placeholder="Email Address (Optional)"
            value={formData.email}
            onChange={handleChange}
          />

          {/* Service Dropdown */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative"
                >
                  <FaList className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-600 text-lg" />
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
                    className="w-full border-2 border-gray-200 p-4 pl-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-700"
                  >
                    {services.map((service) => (
                      <option key={service} value={service}>{service}</option>
                    ))}
            </select>
                </motion.div>

          {/* Message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="relative"
                >
                  <FaComments className="absolute left-4 top-4 text-blue-600 text-lg" />
            <textarea
              name="message"
                    placeholder="Tell us about your travel requirements, dates, number of passengers, and any special requests..."
              value={formData.message}
              onChange={handleChange}
                    rows="5"
                    className="w-full border-2 border-gray-200 p-4 pl-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-700 placeholder-gray-500 resize-none"
                  />
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
            type="submit"
            disabled={submitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
          >
                  <FaPaperPlane className="text-lg" />
                  {submitting ? "Submitting Enquiry..." : "Submit Enquiry"}
                </motion.button>
        </form>

        {/* Feedback */}
        {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-6 p-4 rounded-xl text-center font-medium ${
                    feedback.includes("✅") 
                      ? "bg-green-50 text-green-700 border border-green-200" 
                      : feedback.includes("❌") 
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                  }`}
                >
            {feedback}
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Additional Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Immediate Assistance?</h3>
            <p className="text-gray-600 mb-6">For urgent bookings or immediate assistance, feel free to call us directly</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+919876543210"
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <FaPhone className="text-sm" />
                Call Now: +91 98765 43210
              </a>
              <a
                href="mailto:info@sairajtravels.com"
                className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 border-2 border-gray-200 flex items-center justify-center gap-2"
              >
                <FaEnvelope className="text-sm" />
                Email Us
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}