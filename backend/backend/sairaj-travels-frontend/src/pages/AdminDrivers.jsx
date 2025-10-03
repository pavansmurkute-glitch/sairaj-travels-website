import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';

const AdminDrivers = () => {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  // Removed statusFilter since drivers don't have isActive field
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Show 12 drivers per page
  const [formData, setFormData] = useState({
    fullName: '',
    experienceYears: '',
    licenseType: '',
    licenseNumber: '',
    licenseExpiryDate: '',
    languages: '',
    description: '',
    photoPath: '',
    policeVerified: false,
    aadhaarVerified: false,
    safetyTraining: '',
    emergencyContact: ''
  });

  useEffect(() => {
    checkAuth();
    loadDrivers();
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

  useEffect(() => {
    filterDrivers();
    setCurrentPage(1); // Reset to first page when filters change
  }, [drivers, searchTerm]);

  const checkAuth = () => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
    }
  };

  const loadDrivers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/drivers');
      setDrivers(response.data || []);
    } catch (error) {
      console.error('Error loading drivers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterDrivers = () => {
    let filtered = drivers;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(driver =>
        driver.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.licenseNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.languages?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status removed since drivers don't have isActive field

    setFilteredDrivers(filtered);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDrivers = filteredDrivers.slice(startIndex, endIndex);
  

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleCreateDriver = async (e) => {
    e.preventDefault();
    try {
      await api.post('/drivers', formData);
      await loadDrivers();
      setShowCreateModal(false);
      resetForm();
      alert('Driver created successfully!');
    } catch (error) {
      console.error('Error creating driver:', error);
      alert(`Error creating driver: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleUpdateDriver = async (driverId, updates) => {
    try {
      await api.put(`/drivers/${driverId}`, updates);
      await loadDrivers();
      setShowModal(false);
      alert('Driver updated successfully!');
    } catch (error) {
      console.error('Error updating driver:', error);
      alert(`Error updating driver: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeleteDriver = async (driverId) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      try {
        await api.delete(`/drivers/${driverId}`);
        await loadDrivers();
        alert('Driver deleted successfully!');
      } catch (error) {
        console.error('Error deleting driver:', error);
        alert(`Error deleting driver: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const handleViewDetails = (driver) => {
    setSelectedDriver(driver);
    setShowDetailsModal(true);
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      experienceYears: '',
      licenseType: '',
      licenseNumber: '',
      licenseExpiryDate: '',
      languages: '',
      description: '',
      photoPath: '',
      policeVerified: false,
      aadhaarVerified: false,
      safetyTraining: '',
      emergencyContact: ''
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = () => {
    return 'bg-green-100 text-green-800'; // All drivers are considered active
  };

  const getVerificationStatus = (driver) => {
    const verified = driver.policeVerified && driver.aadhaarVerified;
    return verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading drivers...</p>
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
                <h1 className="text-xl font-bold text-gray-900">Driver Management</h1>
                <p className="text-sm text-gray-600">Manage your team of professional drivers</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Driver
              </button>
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
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, license number, or languages..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Status filter removed since drivers don't have isActive field */}
            
            <div className="flex items-end">
              <button
                onClick={loadDrivers}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Drivers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentDrivers.length > 0 ? (
            currentDrivers.map((driver) => (
              <div key={driver.driverId} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={(() => {
                    const imageSrc = driver.photoPath
                      ? `http://localhost:8080${driver.photoPath}` // use backend URL like FleetPage
                      : "/images/placeholder2.svg"; // fallback for drivers
                    return imageSrc;
                  })()}
                  alt={driver.fullName || 'Driver'}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = "/images/placeholder2.svg"; // fallback on error
                  }}
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{driver.fullName}</h3>
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor()}`}>
                        Active
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getVerificationStatus(driver)}`}>
                        {driver.policeVerified && driver.aadhaarVerified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Experience:</span>
                      <span className="text-gray-900">{driver.experienceYears} years</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">License:</span>
                      <span className="text-gray-900">{driver.licenseType}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Languages:</span>
                      <span className="text-gray-900">{driver.languages}</span>
                    </div>
                    {driver.rating && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Rating:</span>
                        <span className="text-gray-900">{driver.rating}/5</span>
                      </div>
                    )}
                  </div>
                  
                  {driver.description && (
                    <p className="text-sm text-gray-700 mb-4 line-clamp-3">{driver.description}</p>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">ID: {driver.driverId}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(driver)}
                        className="text-green-600 hover:text-green-900 text-sm"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          setSelectedDriver(driver);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteDriver(driver.driverId)}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              No drivers found
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredDrivers.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(endIndex, filteredDrivers.length)}</span> of{' '}
                  <span className="font-medium">{filteredDrivers.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    if (pageNum > totalPages) return null;
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Create Driver Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Add New Driver</h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleCreateDriver} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Experience (Years)</label>
                      <input
                        type="number"
                        value={formData.experienceYears}
                        onChange={(e) => setFormData({...formData, experienceYears: e.target.value})}
                        required
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">License Type</label>
                      <select
                        value={formData.licenseType}
                        onChange={(e) => setFormData({...formData, licenseType: e.target.value})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select License Type</option>
                        <option value="LMV">LMV (Light Motor Vehicle)</option>
                        <option value="HMV">HMV (Heavy Motor Vehicle)</option>
                        <option value="PSV">PSV (Public Service Vehicle)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">License Number</label>
                      <input
                        type="text"
                        value={formData.licenseNumber}
                        onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">License Expiry Date</label>
                      <input
                        type="date"
                        value={formData.licenseExpiryDate}
                        onChange={(e) => setFormData({...formData, licenseExpiryDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                      <input
                        type="tel"
                        value={formData.emergencyContact}
                        onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Languages Spoken</label>
                    <input
                      type="text"
                      value={formData.languages}
                      onChange={(e) => setFormData({...formData, languages: e.target.value})}
                      placeholder="e.g., Hindi, English, Marathi"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Photo Path</label>
                    <input
                      type="text"
                      value={formData.photoPath}
                      onChange={(e) => setFormData({...formData, photoPath: e.target.value})}
                      placeholder="e.g., /images/drivers/driver1.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.policeVerified}
                        onChange={(e) => setFormData({...formData, policeVerified: e.target.checked})}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Police Verified</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.aadhaarVerified}
                        onChange={(e) => setFormData({...formData, aadhaarVerified: e.target.checked})}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Aadhaar Verified</span>
                    </label>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Add Driver
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Driver Modal */}
        {showModal && selectedDriver && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Edit Driver</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const updates = {
                    fullName: formData.get('fullName'),
                    experienceYears: parseInt(formData.get('experienceYears')),
                    licenseType: formData.get('licenseType'),
                    licenseNumber: formData.get('licenseNumber'),
                    licenseExpiryDate: formData.get('licenseExpiryDate'),
                    languages: formData.get('languages'),
                    languagesSpoken: formData.get('languagesSpoken'),
                    description: formData.get('description'),
                    photoPath: formData.get('photoPath'),
                    policeVerified: formData.get('policeVerified') === 'true',
                    aadhaarVerified: formData.get('aadhaarVerified') === 'true',
                    safetyTraining: formData.get('safetyTraining'),
                    emergencyContact: formData.get('emergencyContact')
                  };
                  handleUpdateDriver(selectedDriver.driverId, updates);
                }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        defaultValue={selectedDriver.fullName}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Experience (Years)</label>
                      <input
                        type="number"
                        name="experienceYears"
                        defaultValue={selectedDriver.experienceYears}
                        min="0"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">License Type</label>
                      <select
                        name="licenseType"
                        defaultValue={selectedDriver.licenseType}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select License Type</option>
                        <option value="LMV">LMV (Light Motor Vehicle)</option>
                        <option value="HMV">HMV (Heavy Motor Vehicle)</option>
                        <option value="PSV">PSV (Public Service Vehicle)</option>
                        <option value="MCWG">MCWG (Motor Cycle with Gear)</option>
                        <option value="MCWOG">MCWOG (Motor Cycle without Gear)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">License Number</label>
                      <input
                        type="text"
                        name="licenseNumber"
                        defaultValue={selectedDriver.licenseNumber}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">License Expiry Date</label>
                      <input
                        type="date"
                        name="licenseExpiryDate"
                        defaultValue={selectedDriver.licenseExpiryDate ? selectedDriver.licenseExpiryDate.split('T')[0] : ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Languages</label>
                      <input
                        type="text"
                        name="languages"
                        defaultValue={selectedDriver.languages}
                        placeholder="e.g., Hindi, English, Marathi"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Languages Spoken</label>
                      <input
                        type="text"
                        name="languagesSpoken"
                        defaultValue={selectedDriver.languagesSpoken}
                        placeholder="e.g., Hindi, English, Marathi"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                      <input
                        type="tel"
                        name="emergencyContact"
                        defaultValue={selectedDriver.emergencyContact}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Safety Training</label>
                      <input
                        type="text"
                        name="safetyTraining"
                        defaultValue={selectedDriver.safetyTraining}
                        placeholder="e.g., Defensive Driving, First Aid"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Photo Path</label>
                      <input
                        type="text"
                        name="photoPath"
                        defaultValue={selectedDriver.photoPath}
                        placeholder="e.g., /images/drivers/driver1.jpg"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Police Verified</label>
                      <select
                        name="policeVerified"
                        defaultValue={selectedDriver.policeVerified ? 'true' : 'false'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Aadhaar Verified</label>
                      <select
                        name="aadhaarVerified"
                        defaultValue={selectedDriver.aadhaarVerified ? 'true' : 'false'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      name="description"
                      defaultValue={selectedDriver.description}
                      rows={3}
                      placeholder="Driver's experience, specialties, etc."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Update Driver
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Driver Details Modal */}
        {showDetailsModal && selectedDriver && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-[9999]">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Driver Details - {selectedDriver.fullName}
                  </h3>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Driver Photo */}
                  {selectedDriver.photoPath && (
                    <div className="text-center">
                      <img 
                        src={`http://localhost:8080${selectedDriver.photoPath}`} 
                        alt={selectedDriver.fullName}
                        className="w-32 h-32 object-cover rounded-full mx-auto border-4 border-gray-200"
                      />
                    </div>
                  )}

                  {/* Basic Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-md font-medium text-gray-900 mb-3">Basic Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Full Name:</span>
                        <span className="ml-2 font-medium">{selectedDriver.fullName}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Experience:</span>
                        <span className="ml-2 font-medium">{selectedDriver.experienceYears} years</span>
                      </div>
                      <div>
                        <span className="text-gray-600">License Type:</span>
                        <span className="ml-2 font-medium">{selectedDriver.licenseType}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">License Number:</span>
                        <span className="ml-2 font-medium">{selectedDriver.licenseNumber || 'Not provided'}</span>
                      </div>
                      {selectedDriver.licenseExpiryDate && (
                        <div>
                          <span className="text-gray-600">License Expiry:</span>
                          <span className="ml-2 font-medium">{new Date(selectedDriver.licenseExpiryDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {selectedDriver.emergencyContact && (
                        <div>
                          <span className="text-gray-600">Emergency Contact:</span>
                          <span className="ml-2 font-medium">{selectedDriver.emergencyContact}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Languages & Communication */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-md font-medium text-gray-900 mb-3">Languages & Communication</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {selectedDriver.languages && (
                        <div>
                          <span className="text-gray-600">Languages:</span>
                          <span className="ml-2 font-medium">{selectedDriver.languages}</span>
                        </div>
                      )}
                      {selectedDriver.languagesSpoken && (
                        <div>
                          <span className="text-gray-600">Languages Spoken:</span>
                          <span className="ml-2 font-medium">{selectedDriver.languagesSpoken}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Verification Status */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-md font-medium text-gray-900 mb-3">Verification Status</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <span className="text-gray-600">Police Verified:</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          selectedDriver.policeVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedDriver.policeVerified ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-600">Aadhaar Verified:</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          selectedDriver.aadhaarVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedDriver.aadhaarVerified ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Training & Skills */}
                  {selectedDriver.safetyTraining && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-md font-medium text-gray-900 mb-3">Training & Skills</h4>
                      <div className="text-sm">
                        <span className="text-gray-600">Safety Training:</span>
                        <span className="ml-2 font-medium">{selectedDriver.safetyTraining}</span>
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {selectedDriver.description && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-md font-medium text-gray-900 mb-3">Description</h4>
                      <p className="text-sm text-gray-700">{selectedDriver.description}</p>
                    </div>
                  )}

                  {/* Performance Metrics */}
                  {selectedDriver.rating && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-md font-medium text-gray-900 mb-3">Performance</h4>
                      <div className="text-sm">
                        <span className="text-gray-600">Rating:</span>
                        <span className="ml-2 font-medium">
                          {selectedDriver.rating}/5
                          <div className="inline-flex ml-2">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < selectedDriver.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setShowModal(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Edit Driver
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDrivers;
