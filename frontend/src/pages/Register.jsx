import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Mail, Lock, User, UserPlus, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      await api.post('/register', formData);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <ShieldCheck size={40} />
          </div>
          <h1>Create Account</h1>
          <p>Join SuperMart IMS today</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label><User size={16} /> Full Name</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              placeholder="John Doe"
              required 
            />
          </div>

          <div className="form-group">
            <label><Mail size={16} /> Email Address</label>
            <input 
              type="email" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              placeholder="john@example.com"
              required 
            />
          </div>

          <div className="form-group">
            <label><Lock size={16} /> Password</label>
            <input 
              type="password" 
              value={formData.password} 
              onChange={e => setFormData({...formData, password: e.target.value})} 
              placeholder="••••••••"
              required 
            />
          </div>

          <div className="form-group">
            <label><Lock size={16} /> Confirm Password</label>
            <input 
              type="password" 
              value={formData.password_confirmation} 
              onChange={e => setFormData({...formData, password_confirmation: e.target.value})} 
              placeholder="••••••••"
              required 
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating account...' : <><UserPlus size={18} /> Sign Up</>}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>

      <style>{`
        /* Reuse same styles as Login.jsx */
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          padding: 20px;
        }
        .auth-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          width: 100%;
          max-width: 450px;
          padding: 40px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          color: white;
        }
        .auth-header { text-align: center; margin-bottom: 32px; }
        .auth-logo { width: 80px; height: 80px; background: #818cf8; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: white; }
        .auth-header h1 { font-size: 2rem; font-weight: 800; margin-bottom: 8px; background: linear-gradient(to right, #818cf8, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .auth-header p { color: #94a3b8; }
        .auth-form { display: flex; flex-direction: column; gap: 15px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-size: 0.875rem; color: #cbd5e1; display: flex; align-items: center; gap: 8px; }
        .form-group input { background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255, 255, 255, 0.1); color: white; padding: 12px 16px; border-radius: 12px; }
        .form-group input:focus { border-color: #818cf8; outline: none; }
        .auth-btn { background: #818cf8; color: white; padding: 14px; border-radius: 12px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; transition: 0.2s; }
        .auth-btn:hover { background: #6366f1; transform: translateY(-2px); }
        .auth-footer { margin-top: 32px; text-align: center; color: #94a3b8; }
        .auth-footer a { color: #818cf8; text-decoration: none; font-weight: 600; }
      `}</style>
    </div>
  );
};

export default Register;
