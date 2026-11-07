import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Users, PlusCircle, Trash2, Tag, AlertCircle } from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [deleteMessage, setDeleteMessage] = useState('');

  const { isAuthenticated, user, token, isAdmin } = useAuth();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/events');
      const data = await res.json();
      if (res.ok && data.success) {
        setEvents(data.events);
      } else {
        setError(data.message || 'Failed to fetch events');
      }
    } catch (err) {
      setError('Network error while fetching events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setDeleteMessage(`Event "${title}" was deleted successfully.`);
        fetchEvents();
        setTimeout(() => setDeleteMessage(''), 4000);
      } else {
        alert(data.message || 'Error deleting event');
      }
    } catch (err) {
      alert('Network error while deleting event');
    }
  };

  const categories = ['All', 'Workshop', 'Conference', 'Hackathon', 'Webinar', 'Tech Talk'];

  const filteredEvents = filterCategory === 'All'
    ? events
    : events.filter(e => e.category === filterCategory);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Explore Events</h1>
          <p style={{ color: 'var(--text-muted)' }}>Browse community meetups, technical conferences, and workshops</p>
        </div>

        {isAuthenticated && (
          <Link to="/create-event" className="btn btn-primary">
            <PlusCircle size={18} />
            <span>Host New Event</span>
          </Link>
        )}
      </div>

      {deleteMessage && (
        <div className="alert alert-success">
          <span>{deleteMessage}</span>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Category Pills Filter */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`btn btn-sm ${filterCategory === cat ? 'btn-primary' : 'btn-outline'}`}
            style={{ borderRadius: '9999px', fontSize: '0.85rem' }}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
          Loading events...
        </div>
      ) : filteredEvents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No events found for this category.</p>
          {isAuthenticated && (
            <Link to="/create-event" className="btn btn-primary btn-sm">
              Create the First Event
            </Link>
          )}
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map((evt) => {
            const isCreator = user && evt.createdBy && evt.createdBy._id === user._id;
            const canDelete = isAdmin || isCreator;

            return (
              <div key={evt._id} className="event-card">
                <div>
                  <div className="event-card-header">
                    <span className="badge badge-category">
                      <Tag size={12} style={{ marginRight: '4px' }} />
                      {evt.category}
                    </span>
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(evt._id, evt.title)}
                        className="btn btn-sm"
                        style={{ color: '#ef4444', padding: '4px', borderRadius: '4px' }}
                        title={isAdmin ? "Admin privilege: Delete any event" : "Creator: Delete your event"}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <h3 className="event-title">{evt.title}</h3>
                  <p className="event-desc">{evt.description}</p>
                </div>

                <div>
                  <div className="event-meta">
                    <div className="event-meta-item">
                      <Calendar size={14} color="var(--primary)" />
                      <span>{new Date(evt.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="event-meta-item">
                      <MapPin size={14} color="var(--primary)" />
                      <span>{evt.location}</span>
                    </div>
                    <div className="event-meta-item">
                      <Users size={14} color="var(--primary)" />
                      <span>Capacity: {evt.capacity} attendees</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#94a3b8' }}>
                    <span>By: {evt.createdBy?.name || 'Unknown Organizer'}</span>
                    {evt.createdBy?.role === 'admin' && (
                      <span className="badge badge-admin" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>Verified Host</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Events;

