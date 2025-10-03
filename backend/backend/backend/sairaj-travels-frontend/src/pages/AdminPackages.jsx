import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';

const AdminPackages = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Show 12 packages per page
  const [formData, setFormData] = useState({
    packageName: '',
    packageCategory: '',
    packageCategoryId: '',
    packageDescription: '',
    packageDuration: '',
    packagePrice: '',
    originalPrice: '',
    discountPercentage: '',
    packageImageUrl: '',
    packageFeatures: '',
    packageHighlights: '',
    isActive: true,
    isFeatured: false
  });

  useEffect(() => {
    checkAuth();
    loadPackages();
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
    filterPackages();
    setCurrentPage(1); // Reset to first page when filters change
  }, [packages, searchTerm, statusFilter]);

  const checkAuth = () => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
    }
  };

  const loadPackages = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/packages/admin');
      setPackages(response.data || []);
    } catch (error) {
      console.error('Error loading packages:', error);
      console.error('Error details:', error.response?.data);
      console.error('Error status:', error.response?.status);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPackages = () => {
    let filtered = packages;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(pkg =>
        pkg.packageName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.packageCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.packageDescription?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'ACTIVE') {
        filtered = filtered.filter(pkg => pkg.isActive);
      } else if (statusFilter === 'INACTIVE') {
        filtered = filtered.filter(pkg => !pkg.isActive);
      }
    }

    setFilteredPackages(filtered);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPackages = filteredPackages.slice(startIndex, endIndex);
  

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

  const handleCreatePackage = async (e) => {
    e.preventDefault();
    try {
      // Transform the form data to match backend expectations
      const packageData = {
        ...formData,
        packageFeatures: formData.packageFeatures ? 
          formData.packageFeatures.split(',').map(item => item.trim()) : [],
        packageHighlights: formData.packageHighlights ? 
          formData.packageHighlights.split(',').map(item => item.trim()) : [],
        packagePrice: parseFloat(formData.packagePrice),
        originalPrice: parseFloat(formData.originalPrice)
      };
      
      await api.post('/packages', packageData);
      await loadPackages();
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating package:', error);
      alert(`Error creating package: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleUpdatePackage = async (packageId, updates) => {
    try {
      await api.put(`/packages/${packageId}`, updates);
      await loadPackages();
      setShowModal(false);
      alert('Package updated successfully!');
    } catch (error) {
      console.error('Error updating package:', error);
      alert(`Error updating package: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeletePackage = async (packageId) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await api.delete(`/packages/${packageId}`);
        await loadPackages();
        alert('Package deleted successfully!');
      } catch (error) {
        console.error('Error deleting package:', error);
        alert(`Error deleting package: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      packageName: '',
      packageCategory: '',
      packageCategoryId: '',
      packageDescription: '',
      packageDuration: '',
      packagePrice: '',
      originalPrice: '',
      discountPercentage: '',
      packageImageUrl: '',
      packageFeatures: '',
      packageHighlights: '',
      isActive: true,
      isFeatured: false
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading packages...</p>
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
                <h1 className="text-xl font-bold text-gray-900">Package Management</h1>
                <p className="text-sm text-gray-600">Manage travel packages and pricing</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Package
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
                placeholder="Search by package name, category, or description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={loadPackages}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPackages.length > 0 ? (
            currentPackages.map((pkg) => (
              <div key={pkg.packageId} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={(() => {
                    // Check if packageImageUrl exists and is not empty
                    if (pkg.packageImageUrl && pkg.packageImageUrl.trim() !== '') {
                      // If it's already a full URL, use it directly
                      if (pkg.packageImageUrl.startsWith('http://') || pkg.packageImageUrl.startsWith('https://')) {
                        return pkg.packageImageUrl;
                      }
                      // If it's a relative path, prepend backend URL
                      return `http://localhost:8080${pkg.packageImageUrl}`;
                    }
                    // No image URL provided, use a default placeholder
                    return "/images/placeholder1.svg";
                  })()}
                  alt={pkg.packageName || 'Package'}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // If image fails to load, use a default placeholder
                    e.target.src = '/images/placeholder1.svg';
                  }}
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{pkg.packageName}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(pkg.isActive)}`}>
                      {pkg.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{pkg.packageCategory}</p>
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">{pkg.packageDescription}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">₹{pkg.packagePrice}</span>
                      {pkg.originalPrice && pkg.originalPrice !== pkg.packagePrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">₹{pkg.originalPrice}</span>
                      )}
                    </div>
                    {pkg.isFeatured && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Created: {formatDate(pkg.createdAt)}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedPackage(pkg);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePackage(pkg.packageId)}
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
              No packages found
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredPackages.length > 0 && (
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
                  <span className="font-medium">{Math.min(endIndex, filteredPackages.length)}</span> of{' '}
                  <span className="font-medium">{filteredPackages.length}</span> results
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

        {/* Create Package Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Create New Package</h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleCreatePackage} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Package Name</label>
                      <input
                        type="text"
                        value={formData.packageName}
                        onChange={(e) => setFormData({...formData, packageName: e.target.value})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <input
                        type="text"
                        value={formData.packageCategory}
                        onChange={(e) => setFormData({...formData, packageCategory: e.target.value})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={formData.packageDescription}
                      onChange={(e) => setFormData({...formData, packageDescription: e.target.value})}
                      required
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Duration</label>
                      <input
                        type="text"
                        value={formData.packageDuration}
                        onChange={(e) => setFormData({...formData, packageDuration: e.target.value})}
                        placeholder="e.g., 3 Days 2 Nights"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                      <input
                        type="number"
                        value={formData.packagePrice}
                        onChange={(e) => setFormData({...formData, packagePrice: e.target.value})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Original Price (₹)</label>
                      <input
                        type="number"
                        value={formData.originalPrice}
                        onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image Path</label>
                    <input
                      type="text"
                      value={formData.packageImageUrl}
                      onChange={(e) => setFormData({...formData, packageImageUrl: e.target.value})}
                      placeholder="e.g., /images/packages/package1.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Active</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Featured</span>
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
                      Create Package
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Package Modal */}
        {showModal && selectedPackage && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Edit Package</h3>
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
                    packageName: formData.get('packageName'),
                    packageDescription: formData.get('packageDescription'),
                    packagePrice: parseFloat(formData.get('packagePrice')),
                    originalPrice: parseFloat(formData.get('originalPrice')),
                    packageDuration: formData.get('packageDuration'),
                    packageCategory: formData.get('packageCategory'),
                    packageImageUrl: formData.get('packageImageUrl'),
                    packageHighlights: formData.get('packageHighlights') ? 
                      formData.get('packageHighlights').split(',').map(item => item.trim()) : [],
                    packageFeatures: formData.get('packageFeatures') ? 
                      formData.get('packageFeatures').split(',').map(item => item.trim()) : [],
                    isActive: formData.get('isActive') === 'true',
                    isFeatured: formData.get('isFeatured') === 'true'
                  };
                  handleUpdatePackage(selectedPackage.packageId, updates);
                }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Package Name</label>
                      <input
                        type="text"
                        name="packageName"
                        defaultValue={selectedPackage.packageName}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Package Price</label>
                      <input
                        type="number"
                        name="packagePrice"
                        defaultValue={selectedPackage.packagePrice}
                        step="0.01"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Original Price</label>
                      <input
                        type="number"
                        name="originalPrice"
                        defaultValue={selectedPackage.originalPrice}
                        step="0.01"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Duration</label>
                      <input
                        type="text"
                        name="packageDuration"
                        defaultValue={selectedPackage.packageDuration}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      name="packageDescription"
                      defaultValue={selectedPackage.packageDescription}
                      rows="3"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <input
                      type="text"
                      name="packageCategory"
                      defaultValue={selectedPackage.packageCategory}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image Path</label>
                    <input
                      type="text"
                      name="packageImageUrl"
                      defaultValue={selectedPackage.packageImageUrl}
                      placeholder="e.g., /images/packages/package1.jpg"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Highlights</label>
                    <textarea
                      name="packageHighlights"
                      defaultValue={selectedPackage.packageHighlights}
                      rows="2"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Features</label>
                    <textarea
                      name="packageFeatures"
                      defaultValue={selectedPackage.packageFeatures}
                      rows="2"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        value="true"
                        defaultChecked={selectedPackage.isActive}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700">Active</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        value="true"
                        defaultChecked={selectedPackage.isFeatured}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700">Featured</label>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                    >
                      Update Package
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

export default AdminPackages;
