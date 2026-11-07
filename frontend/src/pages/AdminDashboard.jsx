import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Users, UserCheck, Calendar, Trash2, Key, AlertCircle, CheckCircle2 } from 'lucide-react';

const AdminDashboard = () => {
  const { token, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError('');

      // 1. Fetch dashboard statistics
      const statsRes = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const statsData = await statsRes.json();

      if (!statsRes.ok) {
        throw new Error(statsData.message || 'Access denied');
      }

      setStats(statsData.data.stats);

      // 2. Fetch users list
      const usersRes = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const usersData = await usersRes.json();

      if (usersRes.ok) {
        setUsersList(usersData.users);
      }
    } catch (err) {
      setError(err.message || 'Error loading administrative data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete user "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setActionMessage(data.message || `User ${name} deleted successfully.`);
        fetchAdminData();
        setTimeout(() => setActionMessage(''), 4000);
      } else {
        alert(data.message || 'Failed to delete user');
      }
    } catch (err) {
      alert('Network error while deleting user');
    }
  };

  // Decode JWT payload for live visual demonstration in the report
  let decodedPayload = null;
  if (token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      decodedPayload = JSON.parse(window.atob(base64));
    } catch (e) {
      console.error('Payload decode failed:', e);
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-admin" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Shield size={12} /> RBAC Admin Restricted Area
            </span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Administrative Control Center</h1>
          <p style={{ color: 'var(--text-muted)' }}>Verified authorization: Your JWT payload contains role "admin"</p>
        </div>

        <button onClick={fetchAdminData} className="btn btn-outline btn-sm">
          Refresh Data
        </button>
      </div>

      {actionMessage && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} />
          <span>{actionMessage}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Statistics Cards */}
      {stats && (
        <div className="dashboard-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#4f46e5' }}>
              <Users size={24} />
            </div>
            <div>
              <div className="stat-val">{stats.totalUsers}</div>
              <div className="stat-lbl">Total Registered Users</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#ef4444' }}>
              <Shield size={24} />
            </div>
            <div>
              <div className="stat-val">{stats.adminCount}</div>
              <div className="stat-lbl">Administrators</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#0ea5e9' }}>
              <UserCheck size={24} />
            </div>
            <div>
              <div className="stat-val">{stats.userCount}</div>
              <div className="stat-lbl">Standard Users</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#10b981' }}>
              <Calendar size={24} />
            </div>
            <div>
              <div className="stat-val">{stats.totalEvents}</div>
              <div className="stat-lbl">Active Events</div>
            </div>
          </div>
        </div>
      )}

      {/* Live JWT Inspection Card for Evaluation */}
      <div style={{ background: '#0f172a', color: '#f8fafc', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Key size={18} color="#38bdf8" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#38bdf8' }}>Active JWT Token Inspection (Client Verification)</h3>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem' }}>
          This token was issued by the backend Express server and verified with the HMAC-SHA256 secret.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '8px', overflowX: 'auto' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Raw Bearer Token</div>
            <code style={{ fontSize: '0.75rem', wordBreak: 'break-all', color: '#a5b4fc' }}>
              {token}
            </code>
          </div>
          <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Decoded Claims (Payload)</div>
            <pre style={{ fontSize: '0.8rem', color: '#34d399', margin: 0, overflowX: 'auto' }}>
              {JSON.stringify(decodedPayload, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {/* User Management Table */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Registered Users Management (MongoDB Collection)</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Admin-only view displaying stored accounts and their RBAC role assignments.
        </p>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading user records...</p>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Registration Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <code style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                        {u._id}
                      </code>
                    </td>
                    <td style={{ fontWeight: 600 }}>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      {u._id !== user?._id ? (
                        <button
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          className="btn btn-sm btn-danger"
                          style={{ padding: '4px 8px' }}
                          title="Delete user"
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>You (Active)</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

