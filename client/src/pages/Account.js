import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Account.css';

const Account = () => {
  const navigate = useNavigate();
  const { user, updateUser, logout, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postalCode || '',
      });
    }
  }, [user, isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!formData.firstName || !formData.lastName) {
      setError('First name and last name are required');
      return;
    }

    try {
      setLoading(true);
      await updateUser(formData);
      setMessage('Profile updated successfully');
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="account-page">
      <div className="container">
        <div className="account-layout">
          <aside className="account-sidebar">
            <h2>My Account</h2>
            <nav className="account-nav">
              <button className="nav-item active">Profile</button>
              <button className="nav-item" onClick={() => navigate('/orders')}>
                Orders
              </button>
              <button className="nav-item logout" onClick={handleLogout}>
                Sign Out
              </button>
            </nav>
          </aside>

          <div className="account-content">
            <div className="account-header">
              <h1>Profile Information</h1>
              {!editing && (
                <button className="btn btn-outline" onClick={() => setEditing(true)}>
                  Edit Profile
                </button>
              )}
            </div>

            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            {editing ? (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="postalCode">Postal Code</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        firstName: user.firstName || '',
                        lastName: user.lastName || '',
                        phone: user.phone || '',
                        address: user.address || '',
                        city: user.city || '',
                        postalCode: user.postalCode || '',
                      });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-view">
                <div className="profile-item">
                  <span className="profile-label">Email</span>
                  <span className="profile-value">{user.email}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Name</span>
                  <span className="profile-value">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Phone</span>
                  <span className="profile-value">{user.phone || 'Not provided'}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Address</span>
                  <span className="profile-value">{user.address || 'Not provided'}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">City</span>
                  <span className="profile-value">{user.city || 'Not provided'}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Postal Code</span>
                  <span className="profile-value">{user.postalCode || 'Not provided'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
