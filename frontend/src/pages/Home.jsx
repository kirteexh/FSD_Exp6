import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Users, CalendarCheck, KeyRound, ArrowRight } from 'lucide-react';

const Home = () => {
  const { isAuthenticated, user, isAdmin } = useAuth();

  return (
    <div>
      {/* Hero */}
      <div className="hero">
        <div className="status-pill">
          <ShieldCheck size={16} />
          <span>FSD Lab Experiment 6: JWT Authentication & RBAC</span>
        </div>
        <h1>Event Management & Role-Based Access Control</h1>
        <p>
          Secure full-stack MERN application demonstrating stateless JWT authentication,
          password hashing using bcrypt, Bearer token authorization, and role-based route protection.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/events" className="btn btn-primary">
            Explore Events <ArrowRight size={16} />
          </Link>
          {!isAuthenticated ? (
            <Link to="/login" className="btn btn-outline">
              Sign In to Demo
            </Link>
          ) : isAdmin ? (
            <Link to="/admin" className="btn btn-outline">
              Open Admin Dashboard
            </Link>
          ) : (
            <Link to="/create-event" className="btn btn-outline">
              Host an Event
            </Link>
          )}
        </div>
      </div>

      {/* Auth Status Banner */}
      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <KeyRound size={20} color="var(--primary)" />
          Current Session Authentication State
        </h3>
        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                You are currently logged in as <strong>{user?.name}</strong> (<code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{user?.email}</code>).
              </p>
              <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                Assigned Role: <span className={`badge ${user?.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>{user?.role}</span>
              </p>
            </div>
            <div>
              {isAdmin ? (
                <span style={{ fontSize: '0.85rem', color: '#166534', background: '#dcfce7', padding: '6px 12px', borderRadius: '6px', fontWeight: 600 }}>
                  Full Administrative Privileges Active
                </span>
              ) : (
                <span style={{ fontSize: '0.85rem', color: '#1e40af', background: '#dbeafe', padding: '6px 12px', borderRadius: '6px', fontWeight: 600 }}>
                  Standard User Privileges (Try accessing /admin to verify 403 restriction)
                </span>
              )}
            </div>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No active session detected. Please log in or register to test protected routes, token verification, and role restrictions.
          </p>
        )}
      </div>

      {/* Feature Highlights Grid */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#4f46e5' }}>
            <Lock size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Stateless JWT Auth</div>
            <div className="stat-lbl">Signed Bearer token with expiration & secret</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#0ea5e9' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Role-Based Access</div>
            <div className="stat-lbl">Admin & User roles with 401/403 middleware</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8b5cf6' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Bcrypt Password Hash</div>
            <div className="stat-lbl">10-round salted hashing before persistence</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#10b981' }}>
            <CalendarCheck size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Event Hub Operations</div>
            <div className="stat-lbl">CRUD operations with user ownership check</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

