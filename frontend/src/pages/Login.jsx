import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@ims.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login({ email, password });
    setLoading(false);
    
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <ShieldCheck size={40} />
          </div>
          <h1>SuperMart IMS</h1>
          <p>Sign in to manage your inventory</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label><Mail size={16} /> Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="admin@ims.com"
              required 
            />
          </div>

          <div className="form-group">
            <label><Lock size={16} /> Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="••••••••"
              required 
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Signing in...' : <><LogIn size={18} /> Sign In</>}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Create one</Link></p>
        </div>
      </div>

      <style>{`
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

        .auth-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .auth-logo {
          width: 80px;
          height: 80px;
          background: #38bdf8;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: white;
          box-shadow: 0 0 20px rgba(56, 189, 248, 0.4);
        }

        .auth-header h1 {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 8px;
          background: linear-gradient(to right, #38bdf8, #818cf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .auth-header p {
          color: #94a3b8;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #cbd5e1;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-group input {
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .form-group input:focus {
          border-color: #38bdf8;
          background: rgba(15, 23, 42, 0.8);
          box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.1);
          outline: none;
        }

        .auth-btn {
          background: #38bdf8;
          color: white;
          padding: 14px;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s;
          margin-top: 10px;
        }

        .auth-btn:hover {
          background: #0ea5e9;
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(56, 189, 248, 0.4);
        }

        .auth-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .auth-footer {
          margin-top: 32px;
          text-align: center;
          color: #94a3b8;
          font-size: 0.875rem;
        }

        .auth-footer a {
          color: #38bdf8;
          text-decoration: none;
          font-weight: 600;
        }

        .auth-footer a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Login;
