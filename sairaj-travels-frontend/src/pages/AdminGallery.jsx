import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiMethods } from '../services/api';

const AdminGallery = () => {
  const navigate = useNavigate();
  const [gallery, setGallery] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imagePath: '',
    videoUrl: '',
    category: 'Fleet',
    isFeatured: false,
    isActive: true,
    sortOrder: 0
  });
  const [filterCategory, setFilterCategory] = useState('All');
  const [stats, setStats] = useState(null);

  const categories = ['All', 'Fleet', 'Luxury', 'Destinations', 'Happy Customers', 'Interiors', 'Drivers'];

  useEffect(() => {
    checkAuth();
    loadGallery();
    loadStats();
  }, []);

  const checkAuth = () => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
    }
  };

  const loadGallery = async () => {
    try {
      setIsLoading(true);
      const response = await apiMethods.get('/gallery');
      setGallery(response.data || []);
    } catch (error) {
      console.error('Error loading gallery:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await apiMethods.get('/gallery/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await apiMethods.post('/gallery', formData);
      await loadGallery();
      await loadStats();
      setShowAddModal(false);
      resetForm();
      alert('Gallery item added successfully!');
    } catch (error) {
      console.error('Error adding gallery item:', error);
      alert(`Error adding gallery item: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    try {
      await apiMethods.put(`/gallery/${selectedItem.id}`, formData);
      await loadGallery();
      await loadStats();
      setShowEditModal(false);
      setSelectedItem(null);
      resetForm();
      alert('Gallery item updated successfully!');
    } catch (error) {
      console.error('Error updating gallery item:', error);
      alert(`Error updating gallery item: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this gallery item?')) {
      return;
    }
    
    try {
      await apiMethods.delete(`/gallery/${id}`);
      await loadGallery();
      await loadStats();
      alert('Gallery item deleted successfully!');
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      alert(`Error deleting gallery item: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await apiMethods.patch(`/gallery/${id}/toggle-active`);
      await loadGallery();
    } catch (error) {
      console.error('Error toggling active status:', error);
      alert(`Error updating status: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await apiMethods.patch(`/gallery/${id}/toggle-featured`);
      await loadGallery();
    } catch (error) {
      console.error('Error toggling featured status:', error);
      alert(`Error updating featured status: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      imagePath: item.imagePath || '',
      videoUrl: item.videoUrl || '',
      category: item.category || 'Fleet',
      isFeatured: item.isFeatured || false,
      isActive: item.isActive !== undefined ? item.isActive : true,
      sortOrder: item.sortOrder || 0
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imagePath: '',
      videoUrl: '',
      category: 'Fleet',
      isFeatured: false,
      isActive: true,
      sortOrder: 0
    });
  };

  // Separate photos and videos
  const photos = gallery.filter(item => item.imagePath && item.imagePath.trim() !== '');
  const videos = gallery.filter(item => item.videoUrl && item.videoUrl.trim() !== '');
  
  const filteredGallery = filterCategory === 'All' 
    ? gallery 
    : gallery.filter(item => item.category === filterCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="mr-4 text-gray-600 hover:text-gray-900"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
                <p className="text-gray-600">Manage images and videos for your gallery</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add New Item
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-4">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalItems}</div>
              <div className="text-sm text-gray-600">Total Items</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{photos.length}</div>
              <div className="text-sm text-gray-600">Photos</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{videos.length}</div>
              <div className="text-sm text-gray-600">Videos</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.fleetCount}</div>
              <div className="text-sm text-gray-600">Fleet</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.luxuryCount}</div>
              <div className="text-sm text-gray-600">Luxury</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.destinationsCount}</div>
              <div className="text-sm text-gray-600">Destinations</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-pink-600">{stats.happyCustomersCount}</div>
              <div className="text-sm text-gray-600">Happy Customers</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">{stats.interiorsCount}</div>
              <div className="text-sm text-gray-600">Interiors</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-2xl font-bold text-teal-600">{stats.driversCount}</div>
              <div className="text-sm text-gray-600">Drivers</div>
            </div>
          </div>
        </div>
      )}

      {/* Travel Moments in Motion Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Travel Moments in Motion</h2>
              <p className="text-blue-200">Manage videos for the "Travel Moments in Motion" section</p>
            </div>
            <button
              onClick={() => {
                setFormData({
                  title: '',
                  description: '',
                  imagePath: '',
                  videoUrl: '',
                  category: 'Destinations',
                  isFeatured: false,
                  isActive: true,
                  sortOrder: 0
                });
                setShowAddModal(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Video
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gallery.filter(item => item.videoUrl && item.videoUrl.trim() !== '').map((video) => (
              <div key={video.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="aspect-video bg-gray-800 rounded-lg mb-3 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-12 h-12 text-white mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    <p className="text-sm text-white">Video Content</p>
                  </div>
                </div>
                <h3 className="text-white font-semibold mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-blue-200 text-sm mb-3 line-clamp-2">{video.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-300 mb-3">
                  <span className="bg-blue-500/20 text-blue-200 px-2 py-1 rounded">{video.category}</span>
                  <span>Order: {video.sortOrder}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleToggleFeatured(video.id)}
                    className={`px-3 py-1 text-xs rounded ${
                      video.isFeatured 
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {video.isFeatured ? 'Unfeature' : 'Feature'}
                  </button>
                  <button
                    onClick={() => handleToggleActive(video.id)}
                    className={`px-3 py-1 text-xs rounded ${
                      video.isActive 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {video.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleEdit(video)}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(video.id)}
                    className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {gallery.filter(item => item.videoUrl && item.videoUrl.trim() !== '').length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No videos available</h3>
              <p className="text-blue-200 mb-4">Add videos to showcase in the "Travel Moments in Motion" section.</p>
              <button
                onClick={() => {
                  setFormData({
                    title: '',
                    description: '',
                    imagePath: '',
                    videoUrl: '',
                    category: 'Destinations',
                    isFeatured: false,
                    isActive: true,
                    sortOrder: 0
                  });
                  setShowAddModal(true);
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add First Video
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Photos Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Journey Gallery - Photos</h2>
              <p className="text-gray-600">Manage images for the main gallery section</p>
            </div>
            <button
              onClick={() => {
                setFormData({
                  title: '',
                  description: '',
                  imagePath: '',
                  videoUrl: '',
                  category: 'Fleet',
                  isFeatured: false,
                  isActive: true,
                  sortOrder: 0
                });
                setShowAddModal(true);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Add Photo
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="aspect-video bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                  {photo.imagePath ? (
                    <img
                      src={photo.imagePath.startsWith('http') ? photo.imagePath : `http://localhost:8080${photo.imagePath}`}
                      alt={photo.title}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = '/images/placeholder1.svg';
                      }}
                    />
                  ) : (
                    <div className="text-center">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-gray-600">No Image</p>
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{photo.title}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{photo.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{photo.category}</span>
                  <span>Order: {photo.sortOrder}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleToggleFeatured(photo.id)}
                    className={`px-3 py-1 text-xs rounded ${
                      photo.isFeatured 
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {photo.isFeatured ? 'Unfeature' : 'Feature'}
                  </button>
                  <button
                    onClick={() => handleToggleActive(photo.id)}
                    className={`px-3 py-1 text-xs rounded ${
                      photo.isActive 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {photo.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleEdit(photo)}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(photo.id)}
                    className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {photos.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No photos available</h3>
              <p className="text-gray-600 mb-4">Add photos to showcase in the main gallery section.</p>
              <button
                onClick={() => {
                  setFormData({
                    title: '',
                    description: '',
                    imagePath: '',
                    videoUrl: '',
                    category: 'Fleet',
                    isFeatured: false,
                    isActive: true,
                    sortOrder: 0
                  });
                  setShowAddModal(true);
                }}
                className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
              >
                Add First Photo
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filterCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredGallery.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No gallery items found</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first gallery item.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add First Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGallery.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative">
                  {item.imagePath ? (
                    <img
                      src={item.imagePath.startsWith('http') ? item.imagePath : `http://localhost:8080${item.imagePath}`}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = '/images/placeholder1.svg';
                      }}
                    />
                  ) : item.videoUrl ? (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                        <p className="text-sm text-gray-600">Video</p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-gray-600">No Media</p>
                      </div>
                    </div>
                  )}
                  
                  {item.isFeatured && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      ⭐ Featured
                    </div>
                  )}
                  
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{item.category}</span>
                    <span>Order: {item.sortOrder}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleToggleFeatured(item.id)}
                      className={`px-3 py-1 text-xs rounded ${
                        item.isFeatured 
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {item.isFeatured ? 'Unfeature' : 'Feature'}
                    </button>
                    <button
                      onClick={() => handleToggleActive(item.id)}
                      className={`px-3 py-1 text-xs rounded ${
                        item.isActive 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {item.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-[9999]">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add New Gallery Item</h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image Path</label>
                    <input
                      type="text"
                      value={formData.imagePath}
                      onChange={(e) => setFormData({...formData, imagePath: e.target.value})}
                      placeholder="e.g., /images/gallery/image.jpg"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Video URL <span className="text-red-500">*</span>
                      <span className="text-xs text-gray-500 ml-2">(Required for "Travel Moments in Motion")</span>
                    </label>
                    <input
                      type="url"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                      placeholder="e.g., https://youtube.com/watch?v=..."
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Fleet">Fleet</option>
                      <option value="Luxury">Luxury</option>
                      <option value="Destinations">Destinations</option>
                      <option value="Happy Customers">Happy Customers</option>
                      <option value="Interiors">Interiors</option>
                      <option value="Drivers">Drivers</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Sort Order</label>
                    <input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({...formData, sortOrder: parseInt(e.target.value) || 0})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">
                      Featured
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                      Active
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-[9999]">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Edit Gallery Item</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedItem(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleUpdateItem} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image Path</label>
                    <input
                      type="text"
                      value={formData.imagePath}
                      onChange={(e) => setFormData({...formData, imagePath: e.target.value})}
                      placeholder="e.g., /images/gallery/image.jpg"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Video URL <span className="text-red-500">*</span>
                      <span className="text-xs text-gray-500 ml-2">(Required for "Travel Moments in Motion")</span>
                    </label>
                    <input
                      type="url"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                      placeholder="e.g., https://youtube.com/watch?v=..."
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Fleet">Fleet</option>
                      <option value="Luxury">Luxury</option>
                      <option value="Destinations">Destinations</option>
                      <option value="Happy Customers">Happy Customers</option>
                      <option value="Interiors">Interiors</option>
                      <option value="Drivers">Drivers</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Sort Order</label>
                    <input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({...formData, sortOrder: parseInt(e.target.value) || 0})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isFeaturedEdit"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isFeaturedEdit" className="ml-2 block text-sm text-gray-900">
                      Featured
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActiveEdit"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActiveEdit" className="ml-2 block text-sm text-gray-900">
                      Active
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedItem(null);
                      resetForm();
                    }}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Update Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
