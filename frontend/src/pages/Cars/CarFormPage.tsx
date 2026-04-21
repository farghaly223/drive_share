import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { carsApi } from '../../services/carsApi';
import { browsingApi } from '../../services/browsingApi';
import type { CarCreateUpdateDto } from '../../types';
import Loading from '../../components/common/Loading';

const CarFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [form, setForm] = useState<CarCreateUpdateDto>({
    title: '',
    description: '',
    carType: '',
    brand: '',
    model: '',
    year: undefined,
    transmission: '',
    location: '',
    rentalPrice: undefined,
    availabilityCalendar: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      browsingApi.getById(Number(id))
        .then((res) => {
          const car = res.data;
          setForm({
            title: car.title,
            description: car.description,
            carType: car.carType,
            brand: car.brand,
            model: car.model,
            year: car.year,
            transmission: car.transmission,
            location: car.location,
            rentalPrice: car.rentalPrice,
            availabilityCalendar: '',
          });
        })
        .catch(() => {
          alert('Failed to load car');
          navigate('/cars/manage');
        })
        .finally(() => setFetchLoading(false));
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || undefined : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await carsApi.update(Number(id), form);
      } else {
        await carsApi.create(form);
      }
      navigate('/cars/manage');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <Loading />;

  const fieldStyle = {
    marginBottom: '1.1rem',
  };

  const labelStyle = {
    display: 'block' as const,
    fontSize: '0.78rem',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
    marginBottom: '0.45rem',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.7rem 0.9rem',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '0.9rem',
  };

  return (
    <div style={{ maxWidth: '640px' }}>
      <div className="page-header">
        <h2>{isEdit ? 'Edit Car' : 'Add New Car'}</h2>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
        <form onSubmit={handleSubmit} className="car-form">
          <div style={fieldStyle}>
            <label style={labelStyle}>Title</label>
            <input style={inputStyle} name="title" value={form.title || ''} onChange={handleChange} placeholder="e.g. Clean 2020 Toyota Camry" required />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Description</label>
            <textarea
              name="description"
              value={form.description || ''}
              onChange={handleChange}
              placeholder="Describe your car..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Brand</label>
              <input style={inputStyle} name="brand" value={form.brand || ''} onChange={handleChange} placeholder="Toyota" required />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Model</label>
              <input style={inputStyle} name="model" value={form.model || ''} onChange={handleChange} placeholder="Camry" required />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Year</label>
              <input style={inputStyle} name="year" type="number" value={form.year || ''} onChange={handleChange} placeholder="2020" required />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Car Type</label>
              <input style={inputStyle} name="carType" value={form.carType || ''} onChange={handleChange} placeholder="Sedan" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Transmission</label>
              <select name="transmission" value={form.transmission || ''} onChange={handleChange} required style={inputStyle}>
                <option value="">Select</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Rental Price / Day ($)</label>
              <input style={inputStyle} name="rentalPrice" type="number" step="0.01" value={form.rentalPrice || ''} onChange={handleChange} placeholder="50" required />
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Location</label>
            <input style={inputStyle} name="location" value={form.location || ''} onChange={handleChange} placeholder="City, Country" required />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="submit"
              disabled={loading}
              style={{ background: 'var(--accent)', color: '#0a0a0f', fontWeight: 600, padding: '0.75rem 2rem', borderRadius: 'var(--radius-sm)' }}
            >
              {loading ? 'Saving...' : isEdit ? 'Update Car' : 'List Car'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/cars/manage')}
              className="back-btn"
              style={{ marginTop: 0 }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CarFormPage;
