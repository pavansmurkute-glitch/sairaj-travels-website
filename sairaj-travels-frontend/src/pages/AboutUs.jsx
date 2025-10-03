import { useNavigate } from "react-router-dom";

export default function AboutUs() {
  const navigate = useNavigate(); // ✅ enables navigation

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(-3deg); }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up-delayed {
          0% { opacity: 0; transform: translateY(30px); }
          50% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up-delayed-2 {
          0% { opacity: 0; transform: translateY(30px); }
          66% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes count-up {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes slide-in-left {
          0% { transform: translateX(-50px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes slide-in-right {
          0% { transform: translateX(50px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); opacity: 0.8; }
          70% { transform: scale(0.9); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
        .animate-fade-in-up { animation: fade-in-up 1s ease-out; }
        .animate-fade-in-up-delayed { animation: fade-in-up-delayed 1.5s ease-out; }
        .animate-fade-in-up-delayed-2 { animation: fade-in-up-delayed-2 2s ease-out; }
        .animate-count-up { animation: count-up 0.8s ease-out; }
        .animate-slide-in-left { animation: slide-in-left 0.8s ease-out; }
        .animate-slide-in-right { animation: slide-in-right 0.8s ease-out; }
        .animate-bounce-in { animation: bounce-in 0.8s ease-out; }
      `}</style>
    <div className="bg-gray-50 text-gray-800">
      {/* Hero Banner - Consistent with App theme */}
      <section className="relative py-8 md:py-12 flex items-center justify-center bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6 lg:px-8">
          <div className="animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
              About <span className="text-yellow-400 drop-shadow-lg">Sairaj Travels</span>
            </h1>
            <div className="w-12 h-1 bg-gradient-to-r from-yellow-400 to-yellow-300 mx-auto mb-3 animate-pulse"></div>
          </div>
          
          <div className="animate-fade-in-up-delayed">
            <p className="text-base md:text-lg font-medium mb-4 text-blue-100 leading-relaxed max-w-2xl mx-auto">
              Founded by an <span className="text-yellow-300 font-bold">Ex-Army Officer</span> - Your trusted partner for <span className="text-yellow-300 font-bold">disciplined</span>, <span className="text-yellow-300 font-bold">safe</span>, and <span className="text-yellow-300 font-bold">reliable</span> journeys across Maharashtra
            </p>
          </div>
          
          <div className="animate-fade-in-up-delayed-2 flex flex-wrap justify-center gap-2 text-xs">
            <div className="flex items-center bg-gradient-to-r from-yellow-400 to-yellow-300 text-blue-900 px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform duration-300">
              <span className="mr-2 text-lg">🎖️</span>
              <span>Military Discipline</span>
            </div>
            <div className="flex items-center bg-gradient-to-r from-yellow-400 to-yellow-300 text-blue-900 px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform duration-300">
              <span className="mr-2 text-lg">🛡️</span>
              <span>Safety First</span>
            </div>
            <div className="flex items-center bg-gradient-to-r from-yellow-400 to-yellow-300 text-blue-900 px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform duration-300">
              <span className="mr-2 text-lg">⭐</span>
              <span>Service Excellence</span>
            </div>
          </div>
        </div>
      </section>

      {/* Creative Company Statistics */}
      <section className="bg-gray-50 py-8 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600 to-yellow-400"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 animate-fade-in-up">
              Our <span className="text-blue-600">Achievements</span> in Numbers
            </h2>
            <p className="text-base text-gray-600 animate-fade-in-up-delayed max-w-2xl mx-auto">
              Trusted by thousands of satisfied customers across Maharashtra
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-blue-500 animate-bounce-in">
              <div className="text-2xl mb-2">😊</div>
              <div className="text-2xl font-bold text-blue-600 mb-1 animate-count-up">500+</div>
              <div className="text-xs text-gray-600">Happy Customers</div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-green-500 animate-bounce-in">
              <div className="text-2xl mb-2">🚌</div>
              <div className="text-2xl font-bold text-green-600 mb-1 animate-count-up">1000+</div>
              <div className="text-xs text-gray-600">Successful Trips</div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-yellow-500 animate-bounce-in">
              <div className="text-2xl mb-2">⭐</div>
              <div className="text-2xl font-bold text-yellow-600 mb-1 animate-count-up">5+</div>
              <div className="text-xs text-gray-600">Years Experience</div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-purple-500 animate-bounce-in">
              <div className="text-2xl mb-2">📞</div>
              <div className="text-2xl font-bold text-purple-600 mb-1 animate-count-up">24/7</div>
              <div className="text-xs text-gray-600">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Creative Who We Are */}
      <section className="bg-white py-10 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 opacity-10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-200 opacity-10 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 animate-fade-in-up">
              Who <span className="bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent">We Are</span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-yellow-400 mx-auto mb-4 animate-pulse"></div>
            <p className="text-base text-gray-600 animate-fade-in-up-delayed max-w-2xl mx-auto">
              Your trusted travel partner with a passion for excellence
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="animate-slide-in-left">
              <div className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-lg">🚌</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Our Story</h3>
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-4 text-sm">
                  <span className="text-blue-700 font-bold">Sairaj Travels</span> was founded by an 
                  <span className="font-semibold text-gray-900 bg-green-100 px-2 py-1 rounded text-xs">Ex-Army Officer</span> who 
                  brought military values of <span className="text-green-700 font-bold">discipline, punctuality, and integrity</span> 
                  into the travel industry. After serving the nation with honor, our founder channeled his leadership experience 
                  into creating a travel service that prioritizes{" "}
                  <span className="font-semibold text-gray-900 bg-yellow-100 px-2 py-1 rounded text-xs">
                    safety, reliability, and customer satisfaction
                  </span>.
                </p>
                
                <p className="text-gray-700 leading-relaxed mb-4 text-sm">
                  We specialize in <span className="font-semibold text-gray-900 bg-blue-100 px-2 py-1 rounded text-xs">
                  luxury buses, corporate tours, family trips, pilgrimages, and airport transfers</span> across Maharashtra and beyond.
                  Our military-inspired approach ensures{" "}
                  <span className="font-semibold text-gray-900 bg-red-100 px-2 py-1 rounded text-xs">zero-compromise on safety</span>,
                  professional service standards, and operational excellence in every journey.
                </p>
                
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-gradient-to-r from-green-50 to-green-100 px-2 py-2 rounded-lg text-green-700 font-medium text-xs text-center">
                    <div className="text-lg mb-1">🎖️</div>
                    <div>Military Values</div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-2 py-2 rounded-lg text-blue-700 font-medium text-xs text-center">
                    <div className="text-lg mb-1">⏰</div>
                    <div>Punctuality</div>
                  </div>
                  <div className="bg-gradient-to-r from-red-50 to-red-100 px-2 py-2 rounded-lg text-red-700 font-medium text-xs text-center">
                    <div className="text-lg mb-1">🛡️</div>
                    <div>Safety First</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="animate-slide-in-right">
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-lg p-6 text-white shadow-xl transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-900 text-lg">⭐</span>
                    </div>
                    <h3 className="text-xl font-bold">Our Commitment</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center p-2 bg-white bg-opacity-10 rounded-lg">
                      <span className="text-yellow-400 mr-3 text-sm">★</span>
                      <span className="font-medium text-sm">100% Safe & Reliable Service</span>
                    </div>
                    <div className="flex items-center p-2 bg-white bg-opacity-10 rounded-lg">
                      <span className="text-yellow-400 mr-3 text-sm">★</span>
                      <span className="font-medium text-sm">Modern, Well-Maintained Fleet</span>
                    </div>
                    <div className="flex items-center p-2 bg-white bg-opacity-10 rounded-lg">
                      <span className="text-yellow-400 mr-3 text-sm">★</span>
                      <span className="font-medium text-sm">Experienced & Professional Drivers</span>
                    </div>
                    <div className="flex items-center p-2 bg-white bg-opacity-10 rounded-lg">
                      <span className="text-yellow-400 mr-3 text-sm">★</span>
                      <span className="font-medium text-sm">Competitive Pricing</span>
                    </div>
                    <div className="flex items-center p-2 bg-white bg-opacity-10 rounded-lg">
                      <span className="text-yellow-400 mr-3 text-sm">★</span>
                      <span className="font-medium text-sm">24/7 Customer Support</span>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Creative Owner Section */}
      <section className="bg-gray-50 py-10 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 opacity-5 rounded-full -translate-x-36 -translate-y-36"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-200 opacity-5 rounded-full translate-x-48 translate-y-48"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 animate-fade-in-up">
              Meet Our <span className="bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent">Founder</span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-yellow-400 mx-auto mb-4 animate-pulse"></div>
            <p className="text-base text-gray-600 animate-fade-in-up-delayed max-w-2xl mx-auto">
              The visionary leader behind Sairaj Travels
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto border border-blue-100 hover:shadow-xl transition-all duration-300">
            <div className="md:flex">
              {/* Owner Image */}
              <div className="md:w-2/5 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-6 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-300 opacity-10"></div>
                <div className="relative z-10 text-center">
                  <div className="relative mb-4">
          <img
            src="/Owner_photo.jpg"
            alt="Mr. Sachin Kanawade"
                      className="w-24 h-24 rounded-full shadow-lg object-cover border-2 border-white object-top mx-auto hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                      Founder
                    </div>
                  </div>
                  
                  <div className="text-white">
                    <h3 className="text-lg font-bold mb-1">Mr. Sachin Kanawade</h3>
                    <p className="text-yellow-300 font-semibold text-sm">Ex-Army Officer & Founder</p>
                    <p className="text-blue-200 text-xs">Sairaj Travels</p>
                    <div className="mt-2 flex justify-center">
                      <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                        🎖️ Veteran
                      </span>
                    </div>
                  </div>
                </div>
                
        </div>

              {/* Owner Content */}
              <div className="md:w-3/5 p-6">
                <div className="mb-4">
                  <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                    <span className="w-6 h-6 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-xs">🎖️</span>
                    </span>
                    From Service to Service
                  </h4>
                  
                  <p className="text-gray-700 leading-relaxed mb-4 text-sm">
                    After an honorable career serving the nation in the <span className="font-bold text-green-700">Indian Army</span>, 
                    Mr. Sachin Kanawade transitioned from defending the country to serving its people through safe and reliable travel. 
                    His military background instilled values of <span className="font-bold text-blue-700">discipline, integrity, and commitment</span> 
                    that became the foundation of Sairaj Travels. What started as a post-retirement venture has grown into a trusted brand 
                    for families, corporates, and pilgrims across Maharashtra.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="flex items-center p-2 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                    <span className="text-green-600 mr-2 text-sm">🎖️</span>
                    <span className="text-gray-700 font-medium text-xs">Military Discipline</span>
                  </div>
                  <div className="flex items-center p-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                    <span className="text-blue-600 mr-2 text-sm">🛡️</span>
                    <span className="text-gray-700 font-medium text-xs">Honor & Integrity</span>
                  </div>
                  <div className="flex items-center p-2 bg-gradient-to-r from-red-50 to-red-100 rounded-lg">
                    <span className="text-red-600 mr-2 text-sm">⏰</span>
                    <span className="text-gray-700 font-medium text-xs">Punctuality</span>
                  </div>
                  <div className="flex items-center p-2 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
                    <span className="text-yellow-600 mr-2 text-sm">🎯</span>
                    <span className="text-gray-700 font-medium text-xs">Mission-Focused</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border-l-4 border-green-600">
                  <blockquote className="text-gray-700 italic text-sm leading-relaxed">
                    "After serving the nation in uniform, I now serve families and travelers with the same dedication. 
                    Every journey is a mission - to ensure safety, comfort, and trust. That's the military way, 
                    and that's the Sairaj way."
                  </blockquote>
                  <div className="mt-2 text-right">
                    <span className="text-green-600 font-semibold text-xs">- Mr. Sachin Kanawade, Ex-Army Officer</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Military Values Section */}
      <section className="bg-white py-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-50 to-blue-50 opacity-50"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 animate-fade-in-up">
              Military Values, <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Business Excellence</span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-green-600 to-blue-600 mx-auto mb-4 animate-pulse"></div>
            <p className="text-base text-gray-600 animate-fade-in-up-delayed max-w-2xl mx-auto">
              How military discipline translates to superior travel service
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-green-600 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-xl">🎖️</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Discipline & Order</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                Military precision in vehicle maintenance, route planning, and time management ensures 
                every journey is executed flawlessly.
              </p>
              <div className="flex items-center text-green-600 text-sm font-semibold">
                <span className="mr-2">✓</span>
                <span>Zero tolerance for delays</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-blue-600 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-xl">🛡️</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Safety Protocol</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                Military-grade safety standards with thorough vehicle inspections, 
                emergency preparedness, and risk assessment for every route.
              </p>
              <div className="flex items-center text-blue-600 text-sm font-semibold">
                <span className="mr-2">✓</span>
                <span>Mission-critical safety</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-lg border-l-4 border-red-600 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-xl">🎯</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Mission Focus</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                Every trip is treated as a mission with clear objectives: 
                safe departure, comfortable journey, and timely arrival.
              </p>
              <div className="flex items-center text-red-600 text-sm font-semibold">
                <span className="mr-2">✓</span>
                <span>Mission accomplished</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-gradient-to-r from-green-600 via-blue-600 to-green-600 rounded-lg p-6 text-white text-center">
            <h3 className="text-xl font-bold mb-3">The Military Advantage</h3>
            <p className="text-sm leading-relaxed max-w-3xl mx-auto">
              When you choose Sairaj Travels, you're not just booking a ride - you're enlisting the services 
              of a veteran who understands that <span className="font-bold text-yellow-300">every passenger is a VIP</span>, 
              every journey is a mission, and <span className="font-bold text-yellow-300">failure is not an option</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Our Vision & Mission</h2>
            <div className="w-12 h-1 bg-blue-600 mx-auto mb-4"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-blue-600">
              <div className="flex items-center mb-4">
                <div className="bg-blue-600 p-3 rounded-full mr-3">
                  <span className="text-white text-lg">🌍</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900">Our Vision</h4>
              </div>
              <p className="text-gray-700 leading-relaxed">
            To be the most trusted and preferred travel partner, connecting people
                to their destinations with safety, style, and comfort. We envision a future
                where every journey is memorable and every customer feels valued.
          </p>
        </div>
            
            <div className="bg-white rounded-lg p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-blue-600">
              <div className="flex items-center mb-4">
                <div className="bg-blue-600 p-3 rounded-full mr-3">
                  <span className="text-white text-lg">🚌</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900">Our Mission</h4>
              </div>
              <p className="text-gray-700 leading-relaxed">
            To provide seamless travel solutions that meet the needs of families,
            corporates, and pilgrims while ensuring customer satisfaction through
                reliable service, professional drivers, and modern fleet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="bg-white py-8">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">What Our Customers Say</h2>
            <div className="w-12 h-1 bg-blue-600 mx-auto mb-4"></div>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">Hear from our satisfied customers</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border">
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400 text-xs">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
              </div>
              <p className="text-gray-700 mb-3 italic text-xs">
                "Excellent service! The driver was professional and the vehicle was spotless. 
                Highly recommended for family trips."
              </p>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-2 text-xs">
                  R
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-xs">Rajesh Kumar</div>
                  <div className="text-gray-600 text-xs">Family Trip Customer</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border">
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400 text-xs">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
              </div>
              <p className="text-gray-700 mb-3 italic text-xs">
                "Perfect for corporate events. Punctual, reliable, and the team was very 
                accommodating to our schedule changes."
              </p>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold mr-2 text-xs">
                  P
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-xs">Priya Sharma</div>
                  <div className="text-gray-600 text-xs">Corporate Client</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 border">
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400 text-xs">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
              </div>
              <p className="text-gray-700 mb-3 italic text-xs">
                "Used their services for pilgrimage tours. The driver knew all the routes 
                and made our spiritual journey comfortable and safe."
              </p>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-2 text-xs">
                  S
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-xs">Suresh Patel</div>
                  <div className="text-gray-600 text-xs">Pilgrimage Customer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Why Choose Sairaj Travels?</h2>
            <div className="w-12 h-1 bg-blue-600 mx-auto mb-4"></div>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">Discover what makes us the preferred choice</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center group border border-gray-200">
              <div className="bg-blue-600 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white text-lg">🚌</span>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3">Modern Fleet</h4>
              <p className="text-gray-700 leading-relaxed">
                Well-maintained 17-seater Urbania and premium vehicles equipped with modern amenities.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center group border border-gray-200">
              <div className="bg-blue-600 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white text-lg">👨‍✈️</span>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3">Experienced Drivers</h4>
              <p className="text-gray-700 leading-relaxed">
                Trained, courteous, and professional drivers with extensive knowledge of routes.
            </p>
          </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center group border border-gray-200">
              <div className="bg-blue-600 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white text-lg">⭐</span>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3">Trusted Service</h4>
              <p className="text-gray-700 leading-relaxed">
              Thousands of satisfied customers who trust us for every trip.
            </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center group border border-gray-200">
              <div className="bg-blue-600 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white text-lg">🛡️</span>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3">Safety First</h4>
              <p className="text-gray-700 leading-relaxed">
                All vehicles are regularly inspected and drivers are trained in safety protocols.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center group border border-gray-200">
              <div className="bg-blue-600 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white text-lg">💰</span>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3">Competitive Pricing</h4>
              <p className="text-gray-700 leading-relaxed">
                Transparent pricing with no hidden charges. Get the best value for your money.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center group border border-gray-200">
              <div className="bg-blue-600 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white text-lg">📞</span>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3">24/7 Support</h4>
              <p className="text-gray-700 leading-relaxed">
                Round-the-clock customer support to assist you with bookings and queries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-6">
        <div className="absolute inset-0 bg-black opacity-5"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Start Your Journey?
        </h2>
          <p className="text-base md:text-lg mb-6 leading-relaxed max-w-3xl mx-auto">
            Whether it's a family vacation, a corporate tour, or a pilgrimage,{" "}
            <span className="font-bold text-yellow-400">Sairaj Travels</span> is here to serve you with excellence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-4">
            <button
              onClick={() => navigate("/booking")}
              className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-bold text-sm shadow-lg hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105"
            >
              Book Your Trip Now
            </button>
        <button
              onClick={() => navigate("/contact")}
              className="bg-transparent border-2 border-white text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-white hover:text-blue-900 transition-all duration-300 transform hover:scale-105"
        >
              Contact Us
        </button>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-3">
              <div className="text-lg mb-1">📞</div>
              <h3 className="font-bold text-xs mb-1">Call Us</h3>
              <p className="text-xs opacity-90">24/7 Support</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-3">
              <div className="text-lg mb-1">💬</div>
              <h3 className="font-bold text-xs mb-1">WhatsApp</h3>
              <p className="text-xs opacity-90">Quick Booking</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-3">
              <div className="text-lg mb-1">🌐</div>
              <h3 className="font-bold text-xs mb-1">Online</h3>
              <p className="text-xs opacity-90">Book Anytime</p>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
