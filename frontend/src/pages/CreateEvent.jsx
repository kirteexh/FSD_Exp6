import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, AlertCircle, Calendar } from 'lucide-react';

const CreateEvent = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Workshop');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState(100);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          category,
          date,
          location,
          capacity: Number(capacity)
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to create event');
      }

      navigate('/events');
    } catch (err) {
      setError(err.message || 'Error occurred while saving event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper" style={{ padding: '1rem 0' }}>
      <div className="auth-card" style={{ maxWidth: '640px' }}>
        <div className="auth-header">
          <h2>Create New Event</h2>
          <p>Protected Route: Accessible to all authenticated users with a valid JWT</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="title">Event Title</label>
            <input
              id="title"
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Next-Gen Cloud Architecture Meetup"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Event Description</label>
            <textarea
              id="description"
              className="form-textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide event details, schedule, agenda, prerequisites..."
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="category">Category</label>
              <select
                id="category"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Workshop">Workshop</option>
                <option value="Conference">Conference</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Webinar">Webinar</option>
                <option value="Tech Talk">Tech Talk</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="capacity">Capacity</label>
              <input
                id="capacity"
                type="number"
                className="form-input"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                min="1"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="date">Event Date & Time</label>
              <input
                id="date"
                type="datetime-local"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="location">Venue / URL</label>
              <input
                id="location"
                type="text"
                className="form-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Auditorium Hall B or Google Meet Link"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            <PlusCircle size={18} />
            <span>{loading ? 'Publishing Event...' : 'Publish Event'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;

