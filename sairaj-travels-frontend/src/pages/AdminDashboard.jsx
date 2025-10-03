import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    totalEnquiries: 0,
    pendingEnquiries: 0,
    totalVehicles: 0,
    activeVehicles: 0,
    totalDrivers: 0,
    activeDrivers: 0,
    totalPackages: 0,
    activePackages: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    loadDashboardData();
  }, []);

  // Check if user needs to change password
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
  const mustChangePassword = adminUser.mustChangePassword;
  
  // Role-based access control
  const userRole = adminUser.role?.name || 'VIEWER';
  const userPermissions = adminUser.role?.permissions || {};
  
  // Permission check functions
  const canAccess = (feature) => {
    if (userRole === 'SUPER_ADMIN') return true;
    return userPermissions[feature] === true;
  };

  // Add beforeunload warning for admin pages
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to leave the admin panel? Any unsaved changes may be lost.';
      return 'Are you sure you want to leave the admin panel? Any unsaved changes may be lost.';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const checkAuth = () => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
    }
  };

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load statistics with better error handling
            const [bookingsRes, enquiriesRes, vehiclesRes, driversRes, packagesRes] = await Promise.allSettled([
              api.get('/vehicle-bookings'),
              api.get('/enquiries'),
              api.get('/vehicles'),
              api.get('/drivers'),
              api.get('/packages')
            ]);

      const bookings = bookingsRes.status === 'fulfilled' ? (bookingsRes.value.data || []) : [];
      const enquiries = enquiriesRes.status === 'fulfilled' ? (enquiriesRes.value.data || []) : [];
      const vehicles = vehiclesRes.status === 'fulfilled' ? (vehiclesRes.value.data || []) : [];
      const drivers = driversRes.status === 'fulfilled' ? (driversRes.value.data || []) : [];
      const packages = packagesRes.status === 'fulfilled' ? (packagesRes.value.data || []) : [];


      setStats({
        totalBookings: bookings.length,
        pendingBookings: bookings.filter(b => b.status === 'PENDING').length,
        totalEnquiries: enquiries.length,
        pendingEnquiries: enquiries.filter(e => e.status === 'PENDING').length,
        totalVehicles: vehicles.length,
        activeVehicles: vehicles.filter(v => v.isActive !== false).length,
        totalDrivers: drivers.length,
        activeDrivers: drivers.filter(d => d.isActive !== false).length,
        totalPackages: packages.length,
        activePackages: packages.filter(p => p.isActive).length
      });

      // Load recent data (dashboard limits)
      setRecentBookings(bookings.slice(0, 5)); // Show 5 recent bookings
      setRecentEnquiries(enquiries.slice(0, 5)); // Show 5 recent enquiries
      

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Show error message to user
      alert('Error loading dashboard data. Please check if the backend server is running and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Show confirmation dialog
    const confirmed = window.confirm('Are you sure you want to logout from the admin panel?');
    
    if (confirmed) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      navigate('/admin/login');
    }
  };


  const StatCard = ({ title, value, subtitle, icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && (
            <div className="mt-2 flex items-center">
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{subtitle}</span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-2xl ${color} shadow-lg`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center bg-white/10 rounded-lg px-4 py-2">
                <div className="flex items-center bg-white rounded-full p-2 mr-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold">Admin Dashboard</h1>
                  <p className="text-sm text-blue-100">Sairaj Travels Management</p>
                </div>
              </div>
            </div>
            
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/')}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            🌐 View Website
          </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Password Change Warning Banner */}
        {mustChangePassword && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-yellow-700">
                  <strong>🔐 Security Notice:</strong> You are using a temporary password. 
                  <button 
                    onClick={() => window.open('/admin/forgot-password', '_blank')}
                    className="ml-2 underline hover:text-yellow-900 font-medium"
                  >
                    Change your password now for better security
                  </button>
                </p>
              </div>
              <div className="ml-3 flex-shrink-0">
                <button 
                  onClick={() => {
                    // Hide the banner temporarily (until next login)
                    const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
                    user.mustChangePassword = false;
                    localStorage.setItem('adminUser', JSON.stringify(user));
                    window.location.reload();
                  }}
                  className="text-yellow-400 hover:text-yellow-600"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Admin! 👋</h2>
              <p className="text-gray-600 text-lg">Here's what's happening with your travel business today.</p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{new Date().toLocaleDateString()}</div>
                  <div className="text-sm text-gray-500">Today's Date</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings}
            subtitle={`${stats.pendingBookings} pending`}
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
            color="bg-blue-500"
          />
          
          <StatCard
            title="Enquiries"
            value={stats.totalEnquiries}
            subtitle={`${stats.pendingEnquiries} pending`}
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
            color="bg-green-500"
          />
          
          <StatCard
            title="Vehicles"
            value={stats.totalVehicles}
            subtitle={`${stats.activeVehicles} active`}
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>}
            color="bg-purple-500"
          />
          
          <StatCard
            title="Drivers"
            value={stats.totalDrivers}
            subtitle={`${stats.activeDrivers} active`}
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
            color="bg-orange-500"
          />
        </div>


        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Bookings */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-xl mr-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Recent Bookings</h3>
              </div>
              <button
                onClick={() => navigate('/admin/bookings')}
                className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                View All →
              </button>
            </div>
            <div className="space-y-4">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{booking.customerName}</p>
                      <p className="text-sm text-gray-600 mt-1">{booking.pickupLocation} → {booking.dropLocation}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(booking.requestedAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                      booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📋</div>
                  <p className="text-gray-500 font-medium">No recent bookings</p>
                  <p className="text-sm text-gray-400 mt-1">Bookings will appear here once customers make reservations</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Enquiries */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-xl mr-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Recent Enquiries</h3>
              </div>
              <button
                onClick={() => navigate('/admin/enquiries')}
                className="bg-green-50 hover:bg-green-100 text-green-600 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                View All →
              </button>
            </div>
            <div className="space-y-4">
              {recentEnquiries.length > 0 ? (
                recentEnquiries.map((enquiry, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{enquiry.fullName}</p>
                      <p className="text-sm text-gray-600 mt-1">{enquiry.service}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(enquiry.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      enquiry.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                      enquiry.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {enquiry.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">💬</div>
                  <p className="text-gray-500 font-medium">No recent enquiries</p>
                  <p className="text-sm text-gray-400 mt-1">Customer enquiries will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
            Quick Actions 
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({userRole === 'SUPER_ADMIN' ? 'Full Access' : 'Limited Access'})
            </span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {canAccess('bookings') && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/admin/bookings')}
                className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-blue-200"
              >
                <div className="bg-blue-500 p-3 rounded-xl w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-900">Bookings</p>
              </motion.button>
            )}

            {canAccess('enquiries') && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/admin/enquiries')}
                className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-green-200"
              >
                <div className="bg-green-500 p-3 rounded-xl w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-900">Enquiries</p>
              </motion.button>
            )}

            {canAccess('vehicles') && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/admin/vehicles')}
                className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-purple-200"
              >
                <div className="bg-purple-500 p-3 rounded-xl w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-900">Vehicles</p>
              </motion.button>
            )}

            {canAccess('packages') && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/admin/packages')}
                className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-orange-200"
              >
                <div className="bg-orange-500 p-3 rounded-xl w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-900">Packages</p>
              </motion.button>
            )}

            {canAccess('drivers') && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/admin/drivers')}
                className="p-6 bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-teal-200"
              >
                <div className="bg-teal-500 p-3 rounded-xl w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-900">Drivers</p>
              </motion.button>
            )}

            {canAccess('contact') && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/admin/contact')}
                className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-pink-200"
              >
                <div className="bg-pink-500 p-3 rounded-xl w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-900">Contact</p>
              </motion.button>
            )}

            {canAccess('testimonials') && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/admin/testimonials')}
                className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-yellow-200"
              >
                <div className="bg-yellow-500 p-3 rounded-xl w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-900">Testimonials</p>
              </motion.button>
            )}

            {canAccess('gallery') && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/admin/gallery')}
                className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-purple-200"
              >
                <div className="bg-purple-500 p-3 rounded-xl w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-900">Gallery</p>
              </motion.button>
            )}

            {canAccess('users') && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/admin/users')}
                className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-purple-200"
              >
                <div className="bg-purple-600 p-3 rounded-xl w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-900">User Management</p>
              </motion.button>
            )}

            {canAccess('roles') && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/admin/roles')}
                className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-indigo-200"
              >
                <div className="bg-indigo-600 p-3 rounded-xl w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-900">Role Management</p>
              </motion.button>
            )}

            {canAccess('file_manager') && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/admin/file-manager')}
                className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-gray-200"
              >
                <div className="bg-gray-600 p-3 rounded-xl w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0a2 2 0 012-2h6l2 2h6a2 2 2 0 012 2z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-900">File Manager</p>
              </motion.button>
            )}

            {canAccess('reports') && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/admin/reports')}
                className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-indigo-200"
              >
                <div className="bg-indigo-500 p-3 rounded-xl w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-900">Reports</p>
              </motion.button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
