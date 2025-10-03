import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Try new user management system first
      const response = await fetch('http://localhost:8080/api/admin/auth/login-enhanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          // Store enhanced user data with role information
          localStorage.setItem('adminToken', data.token);
          localStorage.setItem('adminUser', JSON.stringify({
            id: data.user.id,
            username: data.user.username,
            email: data.user.email,
            fullName: data.user.fullName,
            role: data.user.role,
            mustChangePassword: data.user.mustChangePassword,
            loginTime: new Date().toISOString()
          }));

          // Allow login but show password change requirement on dashboard
          navigate('/admin/dashboard');
          
          // Show password change prompt after successful login
          if (data.user.mustChangePassword) {
            setTimeout(() => {
              const changePassword = confirm(
                '🔐 SECURITY NOTICE\n\n' +
                'You are using a temporary password. For security reasons, you should change it now.\n\n' +
                'Click "OK" to change your password or "Cancel" to change it later.\n\n' +
                '(You can always change it later from the User Management section)'
              );
              if (changePassword) {
                window.open('/admin/forgot-password', '_blank');
              }
            }, 2000); // Show after 2 seconds to let dashboard load
          }
        } else {
          setError(data.message || 'Login failed');
        }
      } else {
        // Fallback to old system if new system fails
        if (formData.username === 'admin' && formData.password === 'admin123') {
          localStorage.setItem('adminToken', 'admin-logged-in');
          localStorage.setItem('adminUser', JSON.stringify({
            username: formData.username,
            role: { name: 'SUPER_ADMIN', displayName: 'Administrator' },
            loginTime: new Date().toISOString()
          }));
          navigate('/admin/dashboard');
        } else {
          setError('Invalid credentials. Please try again.');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      // Fallback to old system on network error
      if (formData.username === 'admin' && formData.password === 'admin123') {
        localStorage.setItem('adminToken', 'admin-logged-in');
        localStorage.setItem('adminUser', JSON.stringify({
          username: formData.username,
          role: { name: 'SUPER_ADMIN', displayName: 'Administrator' },
          loginTime: new Date().toISOString()
        }));
        navigate('/admin/dashboard');
      } else {
        setError('Login failed. Please check your connection and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 rounded-full p-3">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-600">Sairaj Travels Admin Panel</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing In...
            </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/admin/forgot-password')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            Forgot your password?
          </button>
        </div>


        {/* Back to Website */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            ← Back to Website
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
