import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Simple icons for consistency
const SimpleIcon = ({ type, className = "w-5 h-5" }) => {
  const icons = {
    roles: "🎭",
    plus: "➕",
    edit: "✏️",
    save: "💾",
    cancel: "❌",
    back: "←",
    check: "✅",
    x: "❌",
    eye: "👁️",
    eyeSlash: "🙈"
  };
  return <span className={`inline-block ${className}`} style={{fontSize: '1.2em'}}>{icons[type] || "📄"}</span>;
};

const AdminRoleManagement = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRole, setEditingRole] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/roles/active');
      if (response.ok) {
        const data = await response.json();
        // Parse permissions from JSON strings to objects
        const rolesWithParsedPermissions = data.map(role => ({
          ...role,
          permissions: typeof role.permissions === 'string' 
            ? JSON.parse(role.permissions) 
            : role.permissions
        }));
        setRoles(rolesWithParsedPermissions);
      } else {
        // Fallback roles if backend is not available
        setRoles([
          { 
            id: 1, 
            roleName: 'SUPER_ADMIN', 
            displayName: 'Super Administrator',
            description: 'Full system access with all permissions',
            permissions: {
              users: true,
              roles: true,
              bookings: true,
              enquiries: true,
              vehicles: true,
              drivers: true,
              packages: true,
              gallery: true,
              testimonials: true,
              contact: true,
              reports: true,
              file_manager: true
            }
          },
          { 
            id: 2, 
            roleName: 'MANAGER', 
            displayName: 'Manager',
            description: 'Business operations management access',
            permissions: {
              users: false,
              roles: false,
              bookings: true,
              enquiries: true,
              vehicles: true,
              drivers: true,
              packages: true,
              gallery: true,
              testimonials: true,
              contact: true,
              reports: true,
              file_manager: false
            }
          },
          { 
            id: 3, 
            roleName: 'OPERATOR', 
            displayName: 'Operator',
            description: 'Day-to-day operations access',
            permissions: {
              users: false,
              roles: false,
              bookings: true,
              enquiries: true,
              vehicles: false,
              drivers: false,
              packages: false,
              gallery: false,
              testimonials: false,
              contact: true,
              reports: false,
              file_manager: false
            }
          },
          { 
            id: 4, 
            roleName: 'VIEWER', 
            displayName: 'Viewer',
            description: 'Read-only access to reports and data',
            permissions: {
              users: false,
              roles: false,
              bookings: false,
              enquiries: false,
              vehicles: false,
              drivers: false,
              packages: false,
              gallery: false,
              testimonials: false,
              contact: false,
              reports: true,
              file_manager: false
            }
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading roles:', error);
      // Use fallback roles
      setRoles([
        { 
          id: 1, 
          roleName: 'SUPER_ADMIN', 
          displayName: 'Super Administrator',
          description: 'Full system access with all permissions',
          permissions: {
            users: true,
            roles: true,
            bookings: true,
            enquiries: true,
            vehicles: true,
            drivers: true,
            packages: true,
            gallery: true,
            testimonials: true,
            contact: true,
            reports: true,
            file_manager: true
          }
        },
        { 
          id: 2, 
          roleName: 'MANAGER', 
          displayName: 'Manager',
          description: 'Business operations management access',
          permissions: {
            users: false,
            roles: false,
            bookings: true,
            enquiries: true,
            vehicles: true,
            drivers: true,
            packages: true,
            gallery: true,
            testimonials: true,
            contact: true,
            reports: true,
            file_manager: false
          }
        },
        { 
          id: 3, 
          roleName: 'OPERATOR', 
          displayName: 'Operator',
          description: 'Day-to-day operations access',
          permissions: {
            users: false,
            roles: false,
            bookings: true,
            enquiries: true,
            vehicles: false,
            drivers: false,
            packages: false,
            gallery: false,
            testimonials: false,
            contact: true,
            reports: false,
            file_manager: false
          }
        },
        { 
          id: 4, 
          roleName: 'VIEWER', 
          displayName: 'Viewer',
          description: 'Read-only access to reports and data',
          permissions: {
            users: false,
            roles: false,
            bookings: false,
            enquiries: false,
            vehicles: false,
            drivers: false,
            packages: false,
            gallery: false,
            testimonials: false,
            contact: false,
            reports: true,
            file_manager: false
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (role) => {
    setEditingRole(role.id);
    setPermissions({ ...role.permissions });
  };

  const cancelEditing = () => {
    setEditingRole(null);
    setPermissions({});
  };

  const handlePermissionChange = (permission, value) => {
    setPermissions(prev => ({
      ...prev,
      [permission]: value
    }));
  };

  const savePermissions = async () => {
    setSaving(true);
    try {
      const response = await fetch(`http://localhost:8080/api/admin/roles/${editingRole}/permissions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Update local state
          setRoles(prev => prev.map(role => 
            role.id === editingRole 
              ? { ...role, permissions: { ...permissions } }
              : role
          ));
          setEditingRole(null);
          setPermissions({});
          alert('Permissions updated successfully!');
        } else {
          alert(result.message || 'Failed to update permissions');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Failed to update permissions');
      }
    } catch (error) {
      console.error('Error updating permissions:', error);
      alert('Network error: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const permissionLabels = {
    users: 'User Management',
    roles: 'Role Management', 
    bookings: 'Bookings',
    enquiries: 'Enquiries',
    vehicles: 'Vehicles',
    drivers: 'Drivers',
    packages: 'Packages',
    gallery: 'Gallery',
    testimonials: 'Testimonials',
    contact: 'Contact',
    reports: 'Reports',
    file_manager: 'File Manager'
  };

  const getRoleColor = (roleName) => {
    switch (roleName) {
      case 'SUPER_ADMIN': return 'bg-red-100 text-red-800';
      case 'MANAGER': return 'bg-yellow-100 text-yellow-800';
      case 'OPERATOR': return 'bg-green-100 text-green-800';
      case 'VIEWER': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="mr-4 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center text-sm text-gray-600 hover:text-gray-800"
              >
                <SimpleIcon type="back" className="mr-1" />
                Back to Dashboard
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <SimpleIcon type="roles" className="mr-2" />
                  Role Management
                </h1>
                <p className="text-gray-600">Control access permissions for each role</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading roles...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {roles.map((role) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
              >
                {/* Role Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(role.roleName)}`}>
                        {role.displayName}
                      </span>
                      <span className="ml-3 text-sm text-gray-600">{role.description}</span>
                    </div>
                    {editingRole !== role.id && (
                      <button
                        onClick={() => startEditing(role)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
                      >
                        <SimpleIcon type="edit" className="mr-1" />
                        Edit Permissions
                      </button>
                    )}
                  </div>
                </div>

                {/* Permissions Grid */}
                <div className="p-6">
                  {editingRole === role.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Object.entries(permissionLabels).map(([key, label]) => (
                          <div key={key} className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              id={`${role.id}-${key}`}
                              checked={permissions[key] || false}
                              onChange={(e) => handlePermissionChange(key, e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`${role.id}-${key}`} className="text-sm font-medium text-gray-700">
                              {label}
                            </label>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                          onClick={cancelEditing}
                          disabled={saving}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors flex items-center text-sm"
                        >
                          <SimpleIcon type="cancel" className="mr-1" />
                          Cancel
                        </button>
                        <button
                          onClick={savePermissions}
                          disabled={saving}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center text-sm disabled:opacity-50"
                        >
                          {saving ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <SimpleIcon type="save" className="mr-1" />
                              Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {Object.entries(permissionLabels).map(([key, label]) => (
                        <div key={key} className="flex items-center space-x-3">
                          <SimpleIcon 
                            type={role.permissions[key] ? "check" : "x"} 
                            className={`${role.permissions[key] ? "text-green-600" : "text-red-600"}`}
                          />
                          <span className={`text-sm font-medium ${
                            role.permissions[key] ? "text-green-700" : "text-red-700"
                          }`}>
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRoleManagement;
