import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';

const AdminVehicles = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  // Removed statusFilter since vehicles don't have isActive field
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeTab, setActiveTab] = useState('pricing');
  const [vehicleDetails, setVehicleDetails] = useState({
    pricing: [],
    charges: [],
    terms: [],
    images: []
  });
  
  // Form states for different sections
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showChargesModal, setShowChargesModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showImagesModal, setShowImagesModal] = useState(false);
  
  const [pricingForm, setPricingForm] = useState({
    rateType: '',
    ratePerKm: '',
    minKmPerDay: '',
    packageHours: ''
  });
  
  const [chargesForm, setChargesForm] = useState({
    driverAllowance: '',
    nightCharge: '',
    fuelIncluded: false,
    tollIncluded: false
  });
  
  const [termsForm, setTermsForm] = useState({
    termText: ''
  });
  
  const [imagesForm, setImagesForm] = useState({
    imageUrl: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    capacity: '',
    isAC: false,
    description: '',
    mainImageUrl: ''
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Show 12 vehicles per page

  useEffect(() => {
    checkAuth();
    loadVehicles();
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
    filterVehicles();
    setCurrentPage(1); // Reset to first page when filters change
  }, [vehicles, searchTerm]);

  const checkAuth = () => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
    }
  };

  const loadVehicles = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/vehicles');
      setVehicles(response.data || []);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterVehicles = () => {
    let filtered = vehicles;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        vehicle.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status (vehicles don't have isActive field, so we'll show all for now)
    // TODO: Add isActive field to Vehicle entity if needed

    setFilteredVehicles(filtered);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVehicles = filteredVehicles.slice(startIndex, endIndex);
  

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

  const handleCreateVehicle = async (e) => {
    e.preventDefault();
    try {
      await api.post('/vehicles', formData);
      await loadVehicles();
      setShowCreateModal(false);
      resetForm();
      alert('Vehicle created successfully!');
    } catch (error) {
      console.error('Error creating vehicle:', error);
      alert(`Error creating vehicle: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleUpdateVehicle = async (vehicleId, updates) => {
    try {
      await api.put(`/vehicles/${vehicleId}`, updates);
      await loadVehicles();
      setShowModal(false);
      alert('Vehicle updated successfully!');
    } catch (error) {
      console.error('Error updating vehicle:', error);
      alert(`Error updating vehicle: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await api.delete(`/vehicles/${vehicleId}`);
        await loadVehicles();
        alert('Vehicle deleted successfully!');
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        alert(`Error deleting vehicle: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const loadVehicleDetails = async (vehicleId) => {
    try {
      console.log('Loading vehicle details for vehicle ID:', vehicleId);
      
      // Test if backend is running first
      try {
        const testResponse = await api.get('/vehicles');
        console.log('Backend is running, vehicles count:', testResponse.data?.length);
      } catch (testError) {
        console.error('Backend connection failed:', testError);
        alert('Backend server is not running. Please start the backend server first.');
        return;
      }
      
      const [pricingResponse, chargesResponse, termsResponse, imagesResponse] = await Promise.all([
        api.get(`/vehicle-pricing/vehicle/${vehicleId}`).catch((err) => {
          console.log('Pricing API error:', err.response?.status, err.response?.data);
          return { data: [] };
        }),
        api.get(`/vehicle-charges/vehicle/${vehicleId}`).catch((err) => {
          console.log('Charges API error:', err.response?.status, err.response?.data);
          return { data: [] };
        }),
        api.get(`/vehicle-terms/vehicle/${vehicleId}`).catch((err) => {
          console.log('Terms API error:', err.response?.status, err.response?.data);
          return { data: [] };
        }),
        api.get(`/vehicle-images/vehicle/${vehicleId}`).catch((err) => {
          console.log('Images API error:', err.response?.status, err.response?.data);
          return { data: [] };
        })
      ]);
      
      console.log('API Responses:', {
        pricing: pricingResponse.data,
        charges: chargesResponse.data,
        terms: termsResponse.data,
        images: imagesResponse.data
      });
      
      setVehicleDetails({
        pricing: pricingResponse.data || [],
        charges: chargesResponse.data || [],
        terms: termsResponse.data || [],
        images: imagesResponse.data || []
      });
    } catch (error) {
      console.error('Error loading vehicle details:', error);
      alert('Error loading vehicle details. Check console for details.');
    }
  };

  const handleManageDetails = (vehicle) => {
    setSelectedVehicle(vehicle);
    loadVehicleDetails(vehicle.vehicleId);
    setShowDetailsModal(true);
  };

  // Save functions for different sections
  const handleSavePricing = async (e) => {
    e.preventDefault();
    try {
      const pricingData = {
        ...pricingForm,
        vehicleId: selectedVehicle.vehicleId
      };
      await api.post('/vehicle-pricing', pricingData);
      await loadVehicleDetails(selectedVehicle.vehicleId);
      setShowPricingModal(false);
      setPricingForm({ rateType: '', ratePerKm: '', minKmPerDay: '', packageHours: '' });
      alert('Pricing added successfully!');
    } catch (error) {
      console.error('Error saving pricing:', error);
      alert(`Error saving pricing: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeletePricing = async (pricingId) => {
    console.log('Attempting to delete pricing with ID:', pricingId);
    
    if (!window.confirm('Are you sure you want to delete this pricing?')) {
      console.log('Delete cancelled by user');
      return;
    }
    
    try {
      console.log('Sending delete request to:', `/vehicle-pricing/${pricingId}`);
      const response = await api.delete(`/vehicle-pricing/${pricingId}`);
      console.log('Delete response:', response);
      
      console.log('Reloading vehicle details...');
      await loadVehicleDetails(selectedVehicle.vehicleId);
      console.log('Vehicle details reloaded');
      
      alert('Pricing deleted successfully!');
    } catch (error) {
      console.error('Error deleting pricing:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      alert(`Error deleting pricing: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleSaveCharges = async (e) => {
    e.preventDefault();
    try {
      const chargesData = {
        ...chargesForm,
        vehicleId: selectedVehicle.vehicleId
      };
      await api.post('/vehicle-charges', chargesData);
      await loadVehicleDetails(selectedVehicle.vehicleId);
      setShowChargesModal(false);
      setChargesForm({ driverAllowance: '', nightCharge: '', fuelIncluded: false, tollIncluded: false });
      alert('Charges added successfully!');
    } catch (error) {
      console.error('Error saving charges:', error);
      alert(`Error saving charges: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleSaveTerms = async (e) => {
    e.preventDefault();
    try {
      const termsData = {
        ...termsForm,
        vehicleId: selectedVehicle.vehicleId
      };
      await api.post('/vehicle-terms', termsData);
      await loadVehicleDetails(selectedVehicle.vehicleId);
      setShowTermsModal(false);
      setTermsForm({ termText: '' });
      alert('Terms added successfully!');
    } catch (error) {
      console.error('Error saving terms:', error);
      alert(`Error saving terms: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleSaveImages = async (e) => {
    e.preventDefault();
    try {
      const imagesData = {
        ...imagesForm,
        vehicleId: selectedVehicle.vehicleId
      };
      await api.post('/vehicle-images', imagesData);
      await loadVehicleDetails(selectedVehicle.vehicleId);
      setShowImagesModal(false);
      setImagesForm({ imageUrl: '' });
      alert('Image added successfully!');
    } catch (error) {
      console.error('Error saving image:', error);
      alert(`Error saving image: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeleteCharges = async (chargeId) => {
    if (!window.confirm('Are you sure you want to delete this charge?')) return;
    
    try {
      await api.delete(`/vehicle-charges/${chargeId}`);
      await loadVehicleDetails(selectedVehicle.vehicleId);
      alert('Charge deleted successfully!');
    } catch (error) {
      console.error('Error deleting charge:', error);
      alert(`Error deleting charge: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeleteTerms = async (termId) => {
    if (!window.confirm('Are you sure you want to delete this term?')) return;
    
    try {
      await api.delete(`/vehicle-terms/${termId}`);
      await loadVehicleDetails(selectedVehicle.vehicleId);
      alert('Term deleted successfully!');
    } catch (error) {
      console.error('Error deleting term:', error);
      alert(`Error deleting term: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeleteImages = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    
    try {
      await api.delete(`/vehicle-images/${imageId}`);
      await loadVehicleDetails(selectedVehicle.vehicleId);
      alert('Image deleted successfully!');
    } catch (error) {
      console.error('Error deleting image:', error);
      alert(`Error deleting image: ${error.response?.data?.message || error.message}`);
    }
  };

  // Add sample data for testing
  const addSampleData = async () => {
    if (!selectedVehicle) return;
    
    try {
      console.log('Adding sample data for vehicle:', selectedVehicle.vehicleId);
      
      // Test each API endpoint individually
      console.log('Testing pricing API...');
      const pricingResponse = await api.post('/vehicle-pricing', {
        vehicleId: selectedVehicle.vehicleId,
        rateType: 'Per KM',
        ratePerKm: 15,
        minKmPerDay: 100,
        packageHours: 8
      });
      console.log('Pricing response:', pricingResponse.data);
      
      console.log('Testing charges API...');
      const chargesResponse = await api.post('/vehicle-charges', {
        vehicleId: selectedVehicle.vehicleId,
        driverAllowance: 500,
        nightCharge: 200,
        fuelIncluded: true,
        tollIncluded: false
      });
      console.log('Charges response:', chargesResponse.data);
      
      console.log('Testing terms API...');
      const termsResponse = await api.post('/vehicle-terms', {
        vehicleId: selectedVehicle.vehicleId,
        termText: 'Driver will be provided for the entire journey. Fuel charges are included in the package.'
      });
      console.log('Terms response:', termsResponse.data);
      
      console.log('Testing images API...');
      const imagesResponse = await api.post('/vehicle-images', {
        vehicleId: selectedVehicle.vehicleId,
        imageUrl: '/images/urbania1.avif'
      });
      console.log('Images response:', imagesResponse.data);
      
      // Reload data
      console.log('Reloading vehicle details...');
      await loadVehicleDetails(selectedVehicle.vehicleId);
      console.log('Vehicle details reloaded successfully');
      alert('Sample data added successfully! Please check the tabs to see the new data.');
    } catch (error) {
      console.error('Error adding sample data:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      let errorMessage = 'Error adding sample data: ';
      if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.response?.data) {
        errorMessage += JSON.stringify(error.response.data);
      } else {
        errorMessage += error.message;
      }
      
      alert(errorMessage);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      capacity: '',
      isAC: false,
      description: '',
      mainImageUrl: ''
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
    return 'bg-green-100 text-green-800'; // All vehicles are considered active
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vehicles...</p>
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
                <h1 className="text-xl font-bold text-gray-900">Vehicle Management</h1>
                <p className="text-sm text-gray-600">Manage your fleet of vehicles</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Vehicle
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
                placeholder="Search by vehicle name, type, or description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Status filter removed since vehicles don't have isActive field */}
            
            <div className="flex items-end">
              <button
                onClick={loadVehicles}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentVehicles.length > 0 ? (
            currentVehicles.map((vehicle) => (
              <div key={vehicle.vehicleId} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={(() => {
                    const imageSrc = vehicle.mainImageUrl
                      ? `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}${vehicle.mainImageUrl}` // use backend URL like FleetPage
                      : "/images/Kia_carnival.avif"; // fallback
                    return imageSrc;
                  })()}
                  alt={vehicle.name || 'Vehicle'}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = "/images/Kia_carnival.avif"; // fallback on error
                  }}
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{vehicle.name}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor()}`}>
                      Active
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Type:</span>
                      <span className="text-gray-900">{vehicle.type}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Capacity:</span>
                      <span className="text-gray-900">{vehicle.capacity} seats</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">AC:</span>
                      <span className="text-gray-900">{vehicle.isAC ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                  
                  {vehicle.description && (
                    <p className="text-sm text-gray-700 mb-4 line-clamp-3">{vehicle.description}</p>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Created: {formatDate(vehicle.createdAt)}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedVehicle(vehicle);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleManageDetails(vehicle)}
                        className="text-green-600 hover:text-green-900 text-sm"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleDeleteVehicle(vehicle.vehicleId)}
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
              No vehicles found
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredVehicles.length > 0 && (
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
                  <span className="font-medium">{Math.min(endIndex, filteredVehicles.length)}</span> of{' '}
                  <span className="font-medium">{filteredVehicles.length}</span> results
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

        {/* Create Vehicle Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Add New Vehicle</h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleCreateVehicle} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Vehicle Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Type</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Type</option>
                        <option value="Bus">Bus</option>
                        <option value="Car">Car</option>
                        <option value="Van">Van</option>
                        <option value="Tempo">Tempo</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Capacity (Seats)</label>
                      <input
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                        required
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-center pt-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.isAC}
                          onChange={(e) => setFormData({...formData, isAC: e.target.checked})}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Air Conditioning</span>
                      </label>
                    </div>
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
                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input
                      type="text"
                      value={formData.mainImageUrl}
                      onChange={(e) => setFormData({...formData, mainImageUrl: e.target.value})}
                      placeholder="Enter image URL or path (e.g., /images/vehicle.jpg or https://example.com/image.jpg)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter a full URL (https://...) or a relative path (/images/...)
                    </p>
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
                      Add Vehicle
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Vehicle Modal */}
        {showModal && selectedVehicle && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" style={{zIndex: 9999}}>
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Edit Vehicle</h3>
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
                    name: formData.get('name'),
                    type: formData.get('type'),
                    capacity: parseInt(formData.get('capacity')),
                    isAC: formData.get('isAC') === 'true',
                    description: formData.get('description'),
                    mainImageUrl: formData.get('mainImageUrl')
                  };
                  handleUpdateVehicle(selectedVehicle.vehicleId, updates);
                }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Vehicle Name</label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={selectedVehicle.name}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Type</label>
                      <select
                        name="type"
                        defaultValue={selectedVehicle.type}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Type</option>
                        <option value="Car">Car</option>
                        <option value="Van">Van</option>
                        <option value="Bus">Bus</option>
                        <option value="SUV">SUV</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Capacity</label>
                      <input
                        type="number"
                        name="capacity"
                        defaultValue={selectedVehicle.capacity}
                        min="1"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">AC</label>
                      <select
                        name="isAC"
                        defaultValue={selectedVehicle.isAC ? 'true' : 'false'}
                        required
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
                      defaultValue={selectedVehicle.description}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input
                      type="text"
                      name="mainImageUrl"
                      defaultValue={selectedVehicle.mainImageUrl}
                      placeholder="Enter image URL or path (e.g., /images/vehicle.jpg or https://example.com/image.jpg)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter a full URL (https://...) or a relative path (/images/...)
                    </p>
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
                      Update Vehicle
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Vehicle Details Modal */}
        {showDetailsModal && selectedVehicle && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" style={{zIndex: 9999}}>
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Vehicle Details - {selectedVehicle.name}
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
                  {/* Tabs */}
                  <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                      <button 
                        onClick={() => setActiveTab('pricing')}
                        className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === 'pricing' 
                            ? 'border-blue-500 text-blue-600' 
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Pricing
                      </button>
                      <button 
                        onClick={() => setActiveTab('charges')}
                        className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === 'charges' 
                            ? 'border-blue-500 text-blue-600' 
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Charges
                      </button>
                      <button 
                        onClick={() => setActiveTab('terms')}
                        className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === 'terms' 
                            ? 'border-blue-500 text-blue-600' 
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Terms
                      </button>
                      <button 
                        onClick={() => setActiveTab('images')}
                        className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                          activeTab === 'images' 
                            ? 'border-blue-500 text-blue-600' 
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Images
                      </button>
                    </nav>
                  </div>

                  {/* Tab Content */}
                  {activeTab === 'pricing' && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-md font-medium text-gray-900">Pricing Information</h4>
                        <button 
                          onClick={() => setShowPricingModal(true)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          Add Pricing
                        </button>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        {vehicleDetails.pricing.length > 0 ? (
                          <div className="space-y-3">
                            {vehicleDetails.pricing.map((pricing, index) => (
                              <div key={index} className="bg-white p-3 rounded border">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm flex-1">
                                    <div>
                                      <span className="text-gray-600">Rate Type:</span>
                                      <span className="ml-2 font-medium">{pricing.rateType}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Rate/Km:</span>
                                      <span className="ml-2 font-medium">₹{pricing.ratePerKm}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Min Km/Day:</span>
                                      <span className="ml-2 font-medium">{pricing.minKmPerDay}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Package Hours:</span>
                                      <span className="ml-2 font-medium">{pricing.packageHours}</span>
                                    </div>
                                  </div>
                                  <div className="flex space-x-2 ml-4">
                                    <button
                                      onClick={() => {
                                        console.log('Edit button clicked for pricing:', pricing);
                                        console.log('Setting pricing form with data:', {
                                          rateType: pricing.rateType,
                                          ratePerKm: pricing.ratePerKm,
                                          minKmPerDay: pricing.minKmPerDay,
                                          packageHours: pricing.packageHours
                                        });
                                        setPricingForm({
                                          rateType: pricing.rateType,
                                          ratePerKm: pricing.ratePerKm,
                                          minKmPerDay: pricing.minKmPerDay,
                                          packageHours: pricing.packageHours
                                        });
                                        console.log('Opening pricing modal...');
                                        setShowPricingModal(true);
                                      }}
                                      className="text-blue-600 hover:text-blue-800 text-xs"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeletePricing(pricing.pricingId)}
                                      className="text-red-600 hover:text-red-800 text-xs"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center py-4">No pricing information available</p>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'charges' && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-md font-medium text-gray-900">Additional Charges</h4>
                        <button 
                          onClick={() => setShowChargesModal(true)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          Add Charges
                        </button>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        {vehicleDetails.charges.length > 0 ? (
                          <div className="space-y-3">
                            {vehicleDetails.charges.map((charge, index) => (
                              <div key={index} className="bg-white p-3 rounded border">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm flex-1">
                                    <div>
                                      <span className="text-gray-600">Driver Allowance:</span>
                                      <span className="ml-2 font-medium">₹{charge.driverAllowance}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Night Charge:</span>
                                      <span className="ml-2 font-medium">₹{charge.nightCharge}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Fuel Included:</span>
                                      <span className="ml-2 font-medium">{charge.fuelIncluded ? 'Yes' : 'No'}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Toll Included:</span>
                                      <span className="ml-2 font-medium">{charge.tollIncluded ? 'Yes' : 'No'}</span>
                                    </div>
                                  </div>
                                  <div className="flex space-x-2 ml-4">
                                    <button
                                      onClick={() => {
                                        setChargesForm({
                                          driverAllowance: charge.driverAllowance,
                                          nightCharge: charge.nightCharge,
                                          fuelIncluded: charge.fuelIncluded,
                                          tollIncluded: charge.tollIncluded
                                        });
                                        setShowChargesModal(true);
                                      }}
                                      className="text-blue-600 hover:text-blue-800 text-xs"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteCharges(charge.chargeId)}
                                      className="text-red-600 hover:text-red-800 text-xs"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center py-4">No additional charges configured</p>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'terms' && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-md font-medium text-gray-900">Terms & Conditions</h4>
                        <button 
                          onClick={() => setShowTermsModal(true)}
                          className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                        >
                          Add Terms
                        </button>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        {vehicleDetails.terms.length > 0 ? (
                          <div className="space-y-3">
                            {vehicleDetails.terms.map((term, index) => (
                              <div key={index} className="bg-white p-3 rounded border">
                                <div className="flex justify-between items-start">
                                  <p className="text-sm text-gray-700 flex-1">{term.termText}</p>
                                  <div className="flex space-x-2 ml-4">
                                    <button
                                      onClick={() => {
                                        setTermsForm({
                                          termText: term.termText
                                        });
                                        setShowTermsModal(true);
                                      }}
                                      className="text-blue-600 hover:text-blue-800 text-xs"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteTerms(term.termId)}
                                      className="text-red-600 hover:text-red-800 text-xs"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center py-4">No terms and conditions available</p>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'images' && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-md font-medium text-gray-900">Vehicle Images</h4>
                        <button 
                          onClick={() => setShowImagesModal(true)}
                          className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700"
                        >
                          Add Images
                        </button>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        {vehicleDetails.images.length > 0 ? (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {vehicleDetails.images.map((image, index) => (
                              <div key={index} className="bg-white p-2 rounded border relative">
                                <img 
                                  src={`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}${image.imageUrl}`} 
                                  alt={`Vehicle image ${index + 1}`}
                                  className="w-full h-24 object-cover rounded"
                                />
                                <p className="text-xs text-gray-600 mt-1 text-center">Image {index + 1}</p>
                                <div className="absolute top-1 right-1 flex space-x-1">
                                  <button
                                    onClick={() => {
                                      setImagesForm({
                                        imageUrl: image.imageUrl
                                      });
                                      setShowImagesModal(true);
                                    }}
                                    className="bg-blue-500 text-white p-1 rounded text-xs hover:bg-blue-600"
                                    title="Edit"
                                  >
                                    ✏️
                                  </button>
                                  <button
                                    onClick={() => handleDeleteImages(image.imageId)}
                                    className="bg-red-500 text-white p-1 rounded text-xs hover:bg-red-600"
                                    title="Delete"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center py-4">No additional images available</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end items-center pt-4 border-t mt-6">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Form Modal */}
        {showPricingModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-[9999]">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Add Pricing Information</h3>
                  <button
                    onClick={() => setShowPricingModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleSavePricing} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rate Type</label>
                    <input
                      type="text"
                      value={pricingForm.rateType}
                      onChange={(e) => setPricingForm({...pricingForm, rateType: e.target.value})}
                      placeholder="e.g., Per KM, Package, Hourly"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Rate per KM (₹)</label>
                      <input
                        type="number"
                        value={pricingForm.ratePerKm}
                        onChange={(e) => setPricingForm({...pricingForm, ratePerKm: e.target.value})}
                        placeholder="0"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Min KM per Day</label>
                      <input
                        type="number"
                        value={pricingForm.minKmPerDay}
                        onChange={(e) => setPricingForm({...pricingForm, minKmPerDay: e.target.value})}
                        placeholder="0"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Package Hours</label>
                    <input
                      type="number"
                      value={pricingForm.packageHours}
                      onChange={(e) => setPricingForm({...pricingForm, packageHours: e.target.value})}
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setShowPricingModal(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Save Pricing
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Charges Form Modal */}
        {showChargesModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-[9999]">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Add Additional Charges</h3>
                  <button
                    onClick={() => setShowChargesModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleSaveCharges} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Driver Allowance (₹)</label>
                      <input
                        type="number"
                        value={chargesForm.driverAllowance}
                        onChange={(e) => setChargesForm({...chargesForm, driverAllowance: e.target.value})}
                        placeholder="0"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Night Charge (₹)</label>
                      <input
                        type="number"
                        value={chargesForm.nightCharge}
                        onChange={(e) => setChargesForm({...chargesForm, nightCharge: e.target.value})}
                        placeholder="0"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={chargesForm.fuelIncluded}
                        onChange={(e) => setChargesForm({...chargesForm, fuelIncluded: e.target.checked})}
                        className="mr-2"
                      />
                      <label className="text-sm text-gray-700">Fuel Included</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={chargesForm.tollIncluded}
                        onChange={(e) => setChargesForm({...chargesForm, tollIncluded: e.target.checked})}
                        className="mr-2"
                      />
                      <label className="text-sm text-gray-700">Toll Included</label>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setShowChargesModal(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Save Charges
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Terms Form Modal */}
        {showTermsModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-[9999]">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Add Terms & Conditions</h3>
                  <button
                    onClick={() => setShowTermsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleSaveTerms} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Term Text</label>
                    <textarea
                      value={termsForm.termText}
                      onChange={(e) => setTermsForm({...termsForm, termText: e.target.value})}
                      rows="4"
                      placeholder="Enter terms and conditions..."
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setShowTermsModal(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                    >
                      Save Terms
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Images Form Modal */}
        {showImagesModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-[9999]">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Add Vehicle Image</h3>
                  <button
                    onClick={() => setShowImagesModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleSaveImages} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input
                      type="text"
                      value={imagesForm.imageUrl}
                      onChange={(e) => setImagesForm({...imagesForm, imageUrl: e.target.value})}
                      placeholder="/images/vehicle.jpg or https://example.com/image.jpg"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter a full URL (https://...) or a relative path (/images/...)
                    </p>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setShowImagesModal(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
                    >
                      Save Image
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminVehicles;
