import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';

const AdminReports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState({
    bookings: {
      total: 0,
      pending: 0,
      confirmed: 0,
      cancelled: 0,
      thisMonth: 0,
      lastMonth: 0
    },
    enquiries: {
      total: 0,
      pending: 0,
      resolved: 0,
      thisMonth: 0,
      lastMonth: 0
    },
    revenue: {
      total: 0,
      thisMonth: 0,
      lastMonth: 0,
      growth: 0
    },
    vehicles: {
      total: 0,
      active: 0,
      inactive: 0
    },
    drivers: {
      total: 0,
      active: 0,
      inactive: 0,
      verified: 0
    },
    packages: {
      total: 0,
      active: 0,
      inactive: 0,
      featured: 0
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    checkAuth();
    loadReports();
  }, []);

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

  const loadReports = async () => {
    try {
      setIsLoading(true);
      
      // Load all data in parallel
      const [bookingsRes, enquiriesRes, vehiclesRes, driversRes, packagesRes] = await Promise.all([
        api.get('/vehicle-bookings'),
        api.get('/enquiries'),
        api.get('/vehicles'),
        api.get('/drivers'),
        api.get('/packages')
      ]);

      const bookings = bookingsRes.data || [];
      const enquiries = enquiriesRes.data || [];
      const vehicles = vehiclesRes.data || [];
      const drivers = driversRes.data || [];
      const packages = packagesRes.data || [];

      // Calculate booking statistics
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
      const sixtyDaysAgo = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));

      const thisMonthBookings = bookings.filter(b => new Date(b.requestedAt) >= thirtyDaysAgo);
      const lastMonthBookings = bookings.filter(b => {
        const date = new Date(b.requestedAt);
        return date >= sixtyDaysAgo && date < thirtyDaysAgo;
      });

      const thisMonthEnquiries = enquiries.filter(e => new Date(e.createdAt) >= thirtyDaysAgo);
      const lastMonthEnquiries = enquiries.filter(e => {
        const date = new Date(e.createdAt);
        return date >= sixtyDaysAgo && date < thirtyDaysAgo;
      });

      setReports({
        bookings: {
          total: bookings.length,
          pending: bookings.filter(b => b.status === 'PENDING').length,
          confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
          cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
          thisMonth: thisMonthBookings.length,
          lastMonth: lastMonthBookings.length
        },
        enquiries: {
          total: enquiries.length,
          pending: enquiries.filter(e => e.status === 'PENDING').length,
          resolved: enquiries.filter(e => e.status === 'RESOLVED').length,
          thisMonth: thisMonthEnquiries.length,
          lastMonth: lastMonthEnquiries.length
        },
        revenue: {
          total: bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
          thisMonth: thisMonthBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
          lastMonth: lastMonthBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
          growth: 0 // Calculate growth percentage
        },
        vehicles: {
          total: vehicles.length,
          active: vehicles.filter(v => v.isActive !== false).length,
          inactive: vehicles.filter(v => v.isActive === false).length
        },
        drivers: {
          total: drivers.length,
          active: drivers.filter(d => d.isActive !== false).length,
          inactive: drivers.filter(d => d.isActive === false).length,
          verified: drivers.filter(d => d.policeVerified && d.aadhaarVerified).length
        },
        packages: {
          total: packages.length,
          active: packages.filter(p => p.isActive).length,
          inactive: packages.filter(p => !p.isActive).length,
          featured: packages.filter(p => p.isFeatured).length
        }
      });

      // Generate chart data for bookings over time
      generateChartData(bookings);

    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateChartData = (bookings) => {
    const last30Days = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      const dateStr = date.toISOString().split('T')[0];
      
      const dayBookings = bookings.filter(b => {
        const bookingDate = new Date(b.requestedAt).toISOString().split('T')[0];
        return bookingDate === dateStr;
      });

      last30Days.push({
        date: dateStr,
        bookings: dayBookings.length,
        confirmed: dayBookings.filter(b => b.status === 'CONFIRMED').length,
        pending: dayBookings.filter(b => b.status === 'PENDING').length
      });
    }

    setChartData(last30Days);
  };

  const StatCard = ({ title, value, subtitle, icon, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'
            }`}>
              <span className="mr-1">{trend > 0 ? '↗' : trend < 0 ? '↘' : '→'}</span>
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="mr-4 text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Reports & Analytics</h1>
                <p className="text-sm text-gray-600">Business insights and performance metrics</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                View Website
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Bookings"
            value={reports.bookings.total}
            subtitle={`${reports.bookings.thisMonth} this month`}
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
            color="bg-blue-500"
          />
          
          <StatCard
            title="Total Revenue"
            value={formatCurrency(reports.revenue.total)}
            subtitle={`${formatCurrency(reports.revenue.thisMonth)} this month`}
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>}
            color="bg-green-500"
          />
          
          <StatCard
            title="Active Vehicles"
            value={reports.vehicles.active}
            subtitle={`${reports.vehicles.total} total`}
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>}
            color="bg-purple-500"
          />
          
          <StatCard
            title="Verified Drivers"
            value={reports.drivers.verified}
            subtitle={`${reports.drivers.total} total`}
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
            color="bg-orange-500"
          />
        </div>

        {/* Detailed Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Bookings Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${(reports.bookings.pending / reports.bookings.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{reports.bookings.pending}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Confirmed</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(reports.bookings.confirmed / reports.bookings.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{reports.bookings.confirmed}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cancelled</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${(reports.bookings.cancelled / reports.bookings.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{reports.bookings.cancelled}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enquiries Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Enquiry Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${(reports.enquiries.pending / reports.enquiries.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{reports.enquiries.pending}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Resolved</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(reports.enquiries.resolved / reports.enquiries.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{reports.enquiries.resolved}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fleet Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fleet Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active Vehicles</span>
                <span className="text-sm font-medium">{reports.vehicles.active}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Inactive Vehicles</span>
                <span className="text-sm font-medium">{reports.vehicles.inactive}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Vehicles</span>
                <span className="text-sm font-medium">{reports.vehicles.total}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Driver Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active Drivers</span>
                <span className="text-sm font-medium">{reports.drivers.active}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Verified Drivers</span>
                <span className="text-sm font-medium">{reports.drivers.verified}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Drivers</span>
                <span className="text-sm font-medium">{reports.drivers.total}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Package Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active Packages</span>
                <span className="text-sm font-medium">{reports.packages.active}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Featured Packages</span>
                <span className="text-sm font-medium">{reports.packages.featured}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Packages</span>
                <span className="text-sm font-medium">{reports.packages.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/admin/bookings')}
              className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center"
            >
              <div className="text-2xl mb-2">📋</div>
              <div className="text-sm font-medium text-gray-900">Manage Bookings</div>
            </button>
            
            <button
              onClick={() => navigate('/admin/enquiries')}
              className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center"
            >
              <div className="text-2xl mb-2">💬</div>
              <div className="text-sm font-medium text-gray-900">View Enquiries</div>
            </button>
            
            <button
              onClick={() => navigate('/admin/vehicles')}
              className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center"
            >
              <div className="text-2xl mb-2">🚌</div>
              <div className="text-sm font-medium text-gray-900">Manage Fleet</div>
            </button>
            
            <button
              onClick={() => navigate('/admin/packages')}
              className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-center"
            >
              <div className="text-2xl mb-2">📦</div>
              <div className="text-sm font-medium text-gray-900">Manage Packages</div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminReports;
