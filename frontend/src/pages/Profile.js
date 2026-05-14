import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import './Profile.css';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: { street: user?.address?.street || '', city: user?.address?.city || '', state: user?.address?.state || '', zipCode: user?.address?.zipCode || '' }
  });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/auth/profile', form);
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePwChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error('Passwords do not match'); return; }
    setChangingPw(true);
    try {
      await api.put('/auth/change-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPw(false);
    }
  };

  return (
    <div className="profile-page fade-in">
      <div className="container">
        <h1 className="profile-title">My Profile</h1>
        <div className="profile-grid">
          {/* Avatar card */}
          <div className="profile-avatar-card card">
            <div className="profile-avatar-circle">{user?.name?.charAt(0)?.toUpperCase()}</div>
            <h3>{user?.name}</h3>
            <p>{user?.email}</p>
            <span className={`profile-role-badge ${user?.role}`}>{user?.role}</span>
          </div>

          <div className="profile-forms">
            {/* Profile form */}
            <div className="card profile-form-card">
              <h3>Personal Information</h3>
              <form onSubmit={handleProfileSave}>
                <div className="form-row-2">
                  <div className="form-group"><label className="form-label">Full Name</label>
                    <input className="form-control" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
                  <div className="form-group"><label className="form-label">Phone</label>
                    <input className="form-control" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 98765 43210" /></div>
                </div>
                <h4 className="subsection-heading">Default Delivery Address</h4>
                <div className="form-group"><label className="form-label">Street Address</label>
                  <input className="form-control" value={form.address.street} onChange={e => setForm(p => ({ ...p, address: { ...p.address, street: e.target.value } }))} /></div>
                <div className="form-row-2">
                  <div className="form-group"><label className="form-label">City</label>
                    <input className="form-control" value={form.address.city} onChange={e => setForm(p => ({ ...p, address: { ...p.address, city: e.target.value } }))} /></div>
                  <div className="form-group"><label className="form-label">ZIP Code</label>
                    <input className="form-control" value={form.address.zipCode} onChange={e => setForm(p => ({ ...p, address: { ...p.address, zipCode: e.target.value } }))} /></div>
                </div>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
              </form>
            </div>

            {/* Password form */}
            <div className="card profile-form-card">
              <h3>Change Password</h3>
              <form onSubmit={handlePwChange}>
                <div className="form-group"><label className="form-label">Current Password</label>
                  <input type="password" className="form-control" value={pwForm.currentPassword} onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))} required /></div>
                <div className="form-row-2">
                  <div className="form-group"><label className="form-label">New Password</label>
                    <input type="password" className="form-control" value={pwForm.newPassword} onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))} minLength={6} required /></div>
                  <div className="form-group"><label className="form-label">Confirm New Password</label>
                    <input type="password" className="form-control" value={pwForm.confirmPassword} onChange={e => setPwForm(p => ({ ...p, confirmPassword: e.target.value }))} required /></div>
                </div>
                <button type="submit" className="btn btn-secondary" disabled={changingPw}>{changingPw ? 'Changing...' : 'Change Password'}</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
