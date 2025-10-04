import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminContact = () => {
  const navigate = useNavigate();
  const [contactInfo, setContactInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    phoneOffice: '',
    phoneMobile: '',
    phoneWhatsapp: '',
    emailPrimary: '',
    emailBookings: '',
    emailSupport: '',
    addressLine1: '',
    addressLine2: '',
    addressCity: '',
    addressState: '',
    addressPincode: '',
    businessHoursWeekdays: '',
    businessHoursSunday: '',
    socialFacebook: '',
    socialInstagram: '',
    socialLinkedin: ''
  });

  useEffect(() => {
    checkAuth();
    loadContactInfo();
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

  const loadContactInfo = async () => {
    try {
      setIsLoading(true);
      // Since ContactInfo is typically a singleton, we'll get the first record
      const response = await api.get('/contact');
      if (response.data) {
        const info = response.data;
        setContactInfo(info);
        setFormData({
          phoneOffice: info.phoneOffice || '',
          phoneMobile: info.phoneMobile || '',
          phoneWhatsapp: info.phoneWhatsapp || '',
          emailPrimary: info.emailPrimary || '',
          emailBookings: info.emailBookings || '',
          emailSupport: info.emailSupport || '',
          addressLine1: info.addressLine1 || '',
          addressLine2: info.addressLine2 || '',
          addressCity: info.addressCity || '',
          addressState: info.addressState || '',
          addressPincode: info.addressPincode || '',
          businessHoursWeekdays: info.businessHoursWeekdays || '',
          businessHoursSunday: info.businessHoursSunday || '',
          socialFacebook: info.socialFacebook || '',
          socialInstagram: info.socialInstagram || '',
          socialLinkedin: info.socialLinkedin || ''
        });
      } else {
        // Show sample data for demonstration
        const sampleData = {
          id: 1,
          phoneOffice: '+91 98765 43210',
          phoneMobile: '+91 91234 56789',
          phoneWhatsapp: '+91 99887 76655',
          emailPrimary: 'info@sairajtravels.com',
          emailBookings: 'bookings@sairajtravels.com',
          emailSupport: 'support@sairajtravels.com',
          addressLine1: '123 Travel Street',
          addressLine2: 'Shivaji Nagar',
          addressCity: 'Pune',
          addressState: 'Maharashtra',
          addressPincode: '411046',
          businessHoursWeekdays: 'Mon - Sat: 9:00 AM – 9:00 PM',
          businessHoursSunday: 'Sunday: 10:00 AM – 6:00 PM',
          socialFacebook: 'https://facebook.com/sairajtravels',
          socialInstagram: 'https://instagram.com/sairajtravels',
          socialLinkedin: 'https://linkedin.com/company/sairajtravels'
        };
        setContactInfo(sampleData);
        setFormData({
          phoneOffice: sampleData.phoneOffice,
          phoneMobile: sampleData.phoneMobile,
          phoneWhatsapp: sampleData.phoneWhatsapp,
          emailPrimary: sampleData.emailPrimary,
          emailBookings: sampleData.emailBookings,
          emailSupport: sampleData.emailSupport,
          addressLine1: sampleData.addressLine1,
          addressLine2: sampleData.addressLine2,
          addressCity: sampleData.addressCity,
          addressState: sampleData.addressState,
          addressPincode: sampleData.addressPincode,
          businessHoursWeekdays: sampleData.businessHoursWeekdays,
          businessHoursSunday: sampleData.businessHoursSunday,
          socialFacebook: sampleData.socialFacebook,
          socialInstagram: sampleData.socialInstagram,
          socialLinkedin: sampleData.socialLinkedin
        });
      }
    } catch (error) {
      console.error('Error loading contact info:', error);
      // Show sample data even if API fails
      const sampleData = {
        id: 1,
        phoneOffice: '+91 98765 43210',
        phoneMobile: '+91 91234 56789',
        phoneWhatsapp: '+91 99887 76655',
        emailPrimary: 'info@sairajtravels.com',
        emailBookings: 'bookings@sairajtravels.com',
        emailSupport: 'support@sairajtravels.com',
        addressLine1: '123 Travel Street',
        addressLine2: 'Shivaji Nagar',
        addressCity: 'Pune',
        addressState: 'Maharashtra',
        addressPincode: '411046',
        businessHoursWeekdays: 'Mon - Sat: 9:00 AM – 9:00 PM',
        businessHoursSunday: 'Sunday: 10:00 AM – 6:00 PM',
        socialFacebook: 'https://facebook.com/sairajtravels',
        socialInstagram: 'https://instagram.com/sairajtravels',
        socialLinkedin: 'https://linkedin.com/company/sairajtravels'
      };
      setContactInfo(sampleData);
      setFormData({
        phoneOffice: sampleData.phoneOffice,
        phoneMobile: sampleData.phoneMobile,
        phoneWhatsapp: sampleData.phoneWhatsapp,
        emailPrimary: sampleData.emailPrimary,
        emailBookings: sampleData.emailBookings,
        emailSupport: sampleData.emailSupport,
        addressLine1: sampleData.addressLine1,
        addressLine2: sampleData.addressLine2,
        addressCity: sampleData.addressCity,
        addressState: sampleData.addressState,
        addressPincode: sampleData.addressPincode,
        businessHoursWeekdays: sampleData.businessHoursWeekdays,
        businessHoursSunday: sampleData.businessHoursSunday,
        socialFacebook: sampleData.socialFacebook,
        socialInstagram: sampleData.socialInstagram,
        socialLinkedin: sampleData.socialLinkedin
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateContact = async (e) => {
    e.preventDefault();
    try {
      if (contactInfo) {
        await api.put(`/contact/${contactInfo.id}`, formData);
      } else {
        await api.post('/contact', formData);
      }
      await loadContactInfo();
      setShowEditModal(false);
      alert('Contact information updated successfully!');
    } catch (error) {
      console.error('Error updating contact info:', error);
      alert(`Error updating contact info: ${error.response?.data?.message || error.message}`);
    }
  };

  const resetForm = () => {
    if (contactInfo) {
      setFormData({
        phoneOffice: contactInfo.phoneOffice || '',
        phoneMobile: contactInfo.phoneMobile || '',
        phoneWhatsapp: contactInfo.phoneWhatsapp || '',
        emailPrimary: contactInfo.emailPrimary || '',
        emailBookings: contactInfo.emailBookings || '',
        emailSupport: contactInfo.emailSupport || '',
        addressLine1: contactInfo.addressLine1 || '',
        addressLine2: contactInfo.addressLine2 || '',
        addressCity: contactInfo.addressCity || '',
        addressState: contactInfo.addressState || '',
        addressPincode: contactInfo.addressPincode || '',
        businessHoursWeekdays: contactInfo.businessHoursWeekdays || '',
        businessHoursSunday: contactInfo.businessHoursSunday || '',
        socialFacebook: contactInfo.socialFacebook || '',
        socialInstagram: contactInfo.socialInstagram || '',
        socialLinkedin: contactInfo.socialLinkedin || ''
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contact information...</p>
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
                <h1 className="text-xl font-bold text-gray-900">Contact Information Management</h1>
                <p className="text-sm text-gray-600">Manage company contact details and business information</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowEditModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                {contactInfo ? 'Edit Contact Info' : 'Add Contact Info'}
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
        {contactInfo ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Phone Numbers Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Phone Numbers</h3>
                </div>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Edit
                </button>
              </div>
              <div className="space-y-3">
                {contactInfo.phoneOffice && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Office:</span>
                    <div className="text-blue-600 font-medium">{contactInfo.phoneOffice}</div>
                  </div>
                )}
                {contactInfo.phoneMobile && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Mobile:</span>
                    <div className="text-blue-600 font-medium">{contactInfo.phoneMobile}</div>
                  </div>
                )}
                {contactInfo.phoneWhatsapp && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">WhatsApp:</span>
                    <div className="text-green-600 font-medium">{contactInfo.phoneWhatsapp}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Email Addresses Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Email Addresses</h3>
                </div>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Edit
                </button>
              </div>
              <div className="space-y-3">
                {contactInfo.emailPrimary && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">General Inquiries:</span>
                    <div className="text-red-600 font-medium">{contactInfo.emailPrimary}</div>
                  </div>
                )}
                {contactInfo.emailBookings && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Bookings:</span>
                    <div className="text-red-600 font-medium">{contactInfo.emailBookings}</div>
                  </div>
                )}
                {contactInfo.emailSupport && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Support:</span>
                    <div className="text-red-600 font-medium">{contactInfo.emailSupport}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Business Hours Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Business Hours</h3>
                </div>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                >
                  Edit
                </button>
              </div>
              <div className="space-y-3">
                {contactInfo.businessHoursWeekdays && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Monday - Saturday:</span>
                    <div className="text-gray-900 font-medium">{contactInfo.businessHoursWeekdays}</div>
                  </div>
                )}
                {contactInfo.businessHoursSunday && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Sunday:</span>
                    <div className="text-gray-900 font-medium">{contactInfo.businessHoursSunday}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Office Address Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Office Address</h3>
                </div>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  Edit
                </button>
              </div>
              <div className="space-y-2">
                {contactInfo.addressLine1 && (
                  <div className="text-gray-900">{contactInfo.addressLine1}</div>
                )}
                {contactInfo.addressLine2 && (
                  <div className="text-gray-900">{contactInfo.addressLine2}</div>
                )}
                {(contactInfo.addressCity || contactInfo.addressState || contactInfo.addressPincode) && (
                  <div className="text-gray-900">
                    {[contactInfo.addressCity, contactInfo.addressState, contactInfo.addressPincode].filter(Boolean).join(', ')}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No contact information</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding your company contact details.</p>
              <div className="mt-6">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Contact Information
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Contact Info Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {contactInfo ? 'Edit Contact Information' : 'Add Contact Information'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleUpdateContact} className="space-y-6">
                  {/* Phone Numbers */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Phone Numbers</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Office Phone</label>
                        <input
                          type="tel"
                          value={formData.phoneOffice}
                          onChange={(e) => setFormData({...formData, phoneOffice: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Mobile Phone</label>
                        <input
                          type="tel"
                          value={formData.phoneMobile}
                          onChange={(e) => setFormData({...formData, phoneMobile: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">WhatsApp</label>
                        <input
                          type="tel"
                          value={formData.phoneWhatsapp}
                          onChange={(e) => setFormData({...formData, phoneWhatsapp: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email Addresses */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Email Addresses</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Primary Email</label>
                        <input
                          type="email"
                          value={formData.emailPrimary}
                          onChange={(e) => setFormData({...formData, emailPrimary: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Bookings Email</label>
                        <input
                          type="email"
                          value={formData.emailBookings}
                          onChange={(e) => setFormData({...formData, emailBookings: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Support Email</label>
                        <input
                          type="email"
                          value={formData.emailSupport}
                          onChange={(e) => setFormData({...formData, emailSupport: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Address</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
                        <input
                          type="text"
                          value={formData.addressLine1}
                          onChange={(e) => setFormData({...formData, addressLine1: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Address Line 2</label>
                        <input
                          type="text"
                          value={formData.addressLine2}
                          onChange={(e) => setFormData({...formData, addressLine2: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">City</label>
                          <input
                            type="text"
                            value={formData.addressCity}
                            onChange={(e) => setFormData({...formData, addressCity: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">State</label>
                          <input
                            type="text"
                            value={formData.addressState}
                            onChange={(e) => setFormData({...formData, addressState: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Pincode</label>
                          <input
                            type="text"
                            value={formData.addressPincode}
                            onChange={(e) => setFormData({...formData, addressPincode: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Business Hours</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Weekdays</label>
                        <input
                          type="text"
                          value={formData.businessHoursWeekdays}
                          onChange={(e) => setFormData({...formData, businessHoursWeekdays: e.target.value})}
                          placeholder="e.g., 9:00 AM - 6:00 PM"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Sunday</label>
                        <input
                          type="text"
                          value={formData.businessHoursSunday}
                          onChange={(e) => setFormData({...formData, businessHoursSunday: e.target.value})}
                          placeholder="e.g., 10:00 AM - 4:00 PM"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Social Media */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Social Media</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Facebook URL</label>
                        <input
                          type="url"
                          value={formData.socialFacebook}
                          onChange={(e) => setFormData({...formData, socialFacebook: e.target.value})}
                          placeholder="https://facebook.com/yourpage"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Instagram URL</label>
                        <input
                          type="url"
                          value={formData.socialInstagram}
                          onChange={(e) => setFormData({...formData, socialInstagram: e.target.value})}
                          placeholder="https://instagram.com/yourpage"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                        <input
                          type="url"
                          value={formData.socialLinkedin}
                          onChange={(e) => setFormData({...formData, socialLinkedin: e.target.value})}
                          placeholder="https://linkedin.com/company/yourcompany"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
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
                      {contactInfo ? 'Update Contact Info' : 'Add Contact Info'}
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

export default AdminContact;
