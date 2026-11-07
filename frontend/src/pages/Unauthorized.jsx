import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';

const Unauthorized = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSwitchToAdmin = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="auth-wrapper" style={{ minHeight: '60vh' }}>
      <div className="auth-card" style={{ textAlign: 'center', borderColor: '#fca5a5' }}>
        <div style={{ display: 'inline-flex', padding: '1rem', background: '#fee2e2', borderRadius: '50%', color: '#b91c1c', marginBottom: '1.5rem' }}>
          <ShieldAlert size={48} />
        </div>

        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#991b1b', marginBottom: '0.75rem' }}>
          403 - Forbidden: Access Restricted
        </h2>

        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          You have successfully authenticated, but your account role (
          <span className="badge badge-user" style={{ verticalAlign: 'middle' }}>
            {user?.role || 'user'}
          </span>
          ) does not have sufficient administrative privileges to access this resource.
        </p>

        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.85rem' }}>
          <div style={{ fontWeight: 700, color: '#991b1b', marginBottom: '0.25rem' }}>
            Role-Based Access Control (RBAC) Enforcement:
          </div>
          <div style={{ color: '#7f1d1d' }}>
            • Protected Route: <code>/admin/*</code><br />
            • Required Role: <code>admin</code><br />
            • Current User: <code>{user?.email || 'N/A'}</code> (Role: <code>{user?.role || 'N/A'}</code>)
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-outline">
            <ArrowLeft size={16} />
            <span>Return to Safety</span>
          </Link>
          <button onClick={handleSwitchToAdmin} className="btn btn-primary">
            <LogIn size={16} />
            <span>Sign In as Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;

