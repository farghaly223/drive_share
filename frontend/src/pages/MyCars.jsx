import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { carsAPI } from '../services/api';
import './MyCars.css';

const EMPTY_FORM = {
  title: '', brand: '', model: '', year: new Date().getFullYear(),
  carType: 'sedan', transmission: 'automatic', rentalPrice: '', location: '', description: '',
  availabilityCalendar: '',
};

export default function MyCars() {
  const [cars, setCars] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!isAuthenticated || user?.role !== 'owner') {
    return (
      <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🔒</div>
        <h2 style={{ fontFamily: 'var(--font-head)', marginBottom: 8 }}>Access Denied</h2>
        <p style={{ color: 'var(--text2)', marginBottom: 24 }}>Only car owners can access this page.</p>
        <button className="btn btn-primary" onClick={() => navigate('/browse')}>Browse Cars</button>
      </div>
    );
  }

  const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) { setMsg({ text: 'Title is required', type: 'error' }); return; }
    if (!formData.rentalPrice) { setMsg({ text: 'Rental price is required', type: 'error' }); return; }
    setLoading(true); setMsg({ text: '', type: '' });
    try {
      await carsAPI.addCar({
        title: formData.title,
        brand: formData.brand,
        model: formData.model,
        year: Number(formData.year),
        carType: formData.carType,
        transmission: formData.transmission,
        rentalPrice: Number(formData.rentalPrice),
        location: formData.location,
        description: formData.description,
        availabilityCalendar: formData.availabilityCalendar || '',
      });
      setMsg({ text: '✅ Car submitted! Pending admin approval before it appears in listings.', type: 'success' });
      setFormData(EMPTY_FORM);
      setShowForm(false);
    } catch (err) {
      const m = err.response?.data?.message || err.response?.data || 'Failed to add car';
      setMsg({ text: typeof m === 'string' ? m : 'Failed to add car', type: 'error' });
    } finally { setLoading(false); }
  };

  const handleDelete = async (carId) => {
    if (!window.confirm('Delete this car listing?')) return;
    try {
      await carsAPI.deleteCar(carId);
      setCars(p => p.filter(c => c.id !== carId));
    } catch (err) {
      const m = err.response?.data || 'Cannot delete this car';
      setMsg({ text: typeof m === 'string' ? m : 'Cannot delete this car', type: 'error' });
    }
  };

  return (
    <div className="my-cars-page">
      <div className="page-header">
        <div>
          <h1 className="section-title">My Cars</h1>
          <p className="section-sub">Manage your rental listings</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm(p => !p); setMsg({ text: '', type: '' }); }}>
          {showForm ? '✕ Cancel' : '+ Add New Car'}
        </button>
      </div>

      {msg.text && <div className={`alert alert-${msg.type === 'error' ? 'error' : 'success'}`}>{msg.text}</div>}

      {showForm && (
        <div className="add-car-panel">
          <h3>🚗 New Car Listing</h3>
          <form className="add-car-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Listing Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange}
                placeholder="e.g. Clean 2022 Toyota Corolla – Daily Rental" required />
            </div>
            <div className="form-row-3">
              <div className="form-group">
                <label>Brand</label>
                <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="Toyota" />
              </div>
              <div className="form-group">
                <label>Model</label>
                <input type="text" name="model" value={formData.model} onChange={handleChange} placeholder="Corolla" />
              </div>
              <div className="form-group">
                <label>Year</label>
                <input type="number" name="year" value={formData.year} onChange={handleChange} min="1990" max="2030" />
              </div>
            </div>
            <div className="form-row-3">
              <div className="form-group">
                <label>Car Type</label>
                <select name="carType" value={formData.carType} onChange={handleChange}>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="convertible">Convertible</option>
                  <option value="truck">Truck</option>
                </select>
              </div>
              <div className="form-group">
                <label>Transmission</label>
                <select name="transmission" value={formData.transmission} onChange={handleChange}>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
              </div>
              <div className="form-group">
                <label>Price / Day ($) *</label>
                <input type="number" name="rentalPrice" value={formData.rentalPrice} onChange={handleChange}
                  placeholder="50" min="1" required />
              </div>
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Cairo, Egypt" />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange}
                rows="4" placeholder="Describe your car — condition, features, rules…" style={{ resize: 'vertical' }} />
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <><span className="spinner" /> Submitting…</> : 'Submit for Approval'}
              </button>
            </div>
          </form>
        </div>
      )}

      {cars.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🚗</span>
          <h3>No listings yet</h3>
          <p>Add your first car to start earning from rentals.</p>
          {!showForm && <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add Your First Car</button>}
        </div>
      ) : (
        <div className="owner-cars-list">
          {cars.map(car => (
            <div key={car.id} className="owner-car-card">
              <div className="owner-car-info">
                <div className="owner-car-title">{car.title}</div>
                <div className="owner-car-meta">
                  <span>🚙 {car.carType}</span>
                  <span>⚙️ {car.transmission}</span>
                  <span>📍 {car.location}</span>
                  <span>💰 ${car.rentalPrice}/day</span>
                </div>
              </div>
              <div className="owner-car-actions">
                <span className={`badge badge-${car.postStatus === 'approved' ? 'approved' : car.postStatus === 'rejected' ? 'rejected' : 'pending'}`}>
                  {car.postStatus || 'pending'}
                </span>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(car.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
