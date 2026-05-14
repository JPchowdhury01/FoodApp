import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

export function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = async e => {
    e.preventDefault();
    const result = await login(form.email, form.password);
    if (result.success) navigate('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-card card fade-in">
        <div className="auth-header">
          <div className="auth-logo">🍕</div>
          <h2>Welcome back!</h2>
          <p>Sign in to continue to FoodApp</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" name="email" className="form-control" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-control" placeholder="••••••••" value={form.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-demo">
          <p>Demo credentials:</p>
          <div className="demo-creds">
            <div><strong>User:</strong> john@example.com / password123</div>
            <div><strong>Admin:</strong> admin@foodapp.com / admin123</div>
          </div>
        </div>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Sign up for free</Link>
        </p>
      </div>
    </div>
  );
}

export function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = async e => {
    e.preventDefault();
    const result = await register(form.name, form.email, form.password, form.phone);
    if (result.success) navigate('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-card card fade-in">
        <div className="auth-header">
          <div className="auth-logo">🍕</div>
          <h2>Create Account</h2>
          <p>Join thousands of food lovers today</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" name="name" className="form-control" placeholder="John Doe" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" name="email" className="form-control" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Phone (optional)</label>
            <input type="tel" name="phone" className="form-control" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-control" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required minLength={6} />
          </div>
          <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
