import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Simple icons
const SimpleIcon = ({ type, className = "w-5 h-5" }) => {
  const icons = {
    email: "📧",
    lock: "🔒",
    back: "←",
    check: "✅",
    x: "❌",
    loading: "⏳"
  };
  return <span className={`inline-block ${className}`} style={{fontSize: '1.2em'}}>{icons[type] || "📄"}</span>;
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  // States for forgot password
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // States for reset password (when token is present)
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [tokenValid, setTokenValid] = useState(null);
  const [resetLoading, setResetLoading] = useState(false);

  // Check token validity when component mounts
  React.useEffect(() => {
    if (token) {
      validateToken();
    }
  }, [token]);

  const validateToken = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/auth/validate-reset-token?token=${token}`);
      const data = await response.json();
      setTokenValid(data.valid);
      if (!data.valid) {
        setError(data.message);
      }
    } catch (error) {
      setTokenValid(false);
      setError('Error validating reset token');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/admin/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setEmail('');
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setResetLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/admin/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setTimeout(() => {
          navigate('/admin/login');
        }, 3000);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <SimpleIcon type={token ? "lock" : "email"} className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {token ? 'Reset Password' : 'Forgot Password'}
          </h2>
          <p className="text-gray-600 mt-2">
            {token 
              ? 'Enter your new password below' 
              : 'Enter your email to receive a password reset link'
            }
          </p>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <SimpleIcon type="check" className="text-green-600 mr-2" />
              <span className="text-green-700 text-sm">{message}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <SimpleIcon type="x" className="text-red-600 mr-2" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Forms */}
        {!token ? (
          // Forgot Password Form
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email address"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <SimpleIcon type="loading" className="mr-2" />
                  Sending...
                </div>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        ) : tokenValid === false ? (
          // Invalid Token
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <SimpleIcon type="x" className="w-12 h-12 mx-auto mb-2" />
              <p className="font-medium">Invalid or Expired Token</p>
              <p className="text-sm text-gray-600 mt-2">
                This password reset link is invalid or has expired.
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/login')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Back to Login
            </button>
          </div>
        ) : tokenValid === true ? (
          // Reset Password Form
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={resetLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {resetLoading ? (
                <div className="flex items-center justify-center">
                  <SimpleIcon type="loading" className="mr-2" />
                  Resetting...
                </div>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        ) : (
          // Loading token validation
          <div className="text-center py-8">
            <SimpleIcon type="loading" className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="text-gray-600">Validating reset token...</p>
          </div>
        )}

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/admin/login')}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <SimpleIcon type="back" className="mr-1" />
            Back to Login
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
