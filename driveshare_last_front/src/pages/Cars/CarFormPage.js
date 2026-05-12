import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { carsApi } from '../../services/carsApi';
import { browsingApi } from '../../services/browsingApi';
import Loading from '../../components/common/Loading';
import { useAuth } from '../../hooks/useAuth';

const CarFormPage = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { canAddCars } = useAuth();

  // All hooks MUST come before any conditional returns (Rules of Hooks)
  const [form, setForm] = useState({
    title: '',
    description: '',
    carType: '',
    brand: '',
    model: '',
    year: '',
    transmission: '',
    location: '',
    rentalPrice: '',
    availabilityCalendar: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit && canAddCars) {
      browsingApi
        .getById(Number(id))
        .then((res) => {
          const car = res.data;
          setForm({
            title: car.title || '',
            description: car.description || '',
            carType: car.carType || '',
            brand: car.brand || '',
            model: car.model || '',
            year: car.year || '',
            transmission: car.transmission || '',
            location: car.location || '',
            rentalPrice: car.rentalPrice || '',
            availabilityCalendar: '',
          });
        })
        .catch(() => {
          alert('Failed to load car');
          navigate('/cars/manage');
        })
        .finally(() => setFetchLoading(false));
    }
  }, [id, isEdit, navigate, canAddCars]);

  // Inline permission guard rendered AFTER all hooks
  if (!canAddCars) {
    return <Navigate to="/cars/manage" replace />;
  }

  if (fetchLoading) return <Loading />;

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || '' : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await carsApi.update(Number(id), form);
      } else {
        await carsApi.create(form);
      }
      navigate('/cars/manage');
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="page-header">
        <h2>{isEdit ? 'Edit Car' : 'Add New Car'}</h2>
      </div>
      <div className="form-card">
        <form onSubmit={handleSubmit} className="car-form">
          <div className="form-group">
            <label>Title</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Clean 2020 Toyota Camry" required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe your car..." rows={3} />
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label>Brand</label>
              <input name="brand" value={form.brand} onChange={handleChange} placeholder="Toyota" required />
            </div>
            <div className="form-group">
              <label>Model</label>
              <input name="model" value={form.model} onChange={handleChange} placeholder="Camry" required />
            </div>
            <div className="form-group">
              <label>Year</label>
              <input name="year" type="number" value={form.year} onChange={handleChange} placeholder="2020" required />
            </div>
            <div className="form-group">
              <label>Car Type</label>
              <input name="carType" value={form.carType} onChange={handleChange} placeholder="Sedan" />
            </div>
          </div>
          <div className="form-grid-2">
            <div className="form-group">
              <label>Transmission</label>
              <select name="transmission" value={form.transmission} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
            <div className="form-group">
              <label>Rental Price / Day ($)</label>
              <input name="rentalPrice" type="number" step="0.01" value={form.rentalPrice} onChange={handleChange} placeholder="50" required />
            </div>
          </div>
          <div className="form-group">
            <label>Location</label>
            <input name="location" value={form.location} onChange={handleChange} placeholder="City, Country" required />
          </div>
          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Saving...' : isEdit ? 'Update Car' : 'List Car'}
            </button>
            <button type="button" onClick={() => navigate('/cars/manage')} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CarFormPage;
