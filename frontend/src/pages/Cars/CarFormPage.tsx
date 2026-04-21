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
        .catch((err) => {
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

  return (
    <div>
      <h2>{isEdit ? 'Edit Car' : 'Add New Car'}</h2>
      <form onSubmit={handleSubmit} className="car-form">
        <div>
          <label>Title</label>
          <input name="title" value={form.title || ''} onChange={handleChange} required />
        </div>
        <div>
          <label>Description</label>
          <textarea name="description" value={form.description || ''} onChange={handleChange} />
        </div>
        <div>
          <label>Car Type</label>
          <input name="carType" value={form.carType || ''} onChange={handleChange} />
        </div>
        <div>
          <label>Brand</label>
          <input name="brand" value={form.brand || ''} onChange={handleChange} required />
        </div>
        <div>
          <label>Model</label>
          <input name="model" value={form.model || ''} onChange={handleChange} required />
        </div>
        <div>
          <label>Year</label>
          <input name="year" type="number" value={form.year || ''} onChange={handleChange} required />
        </div>
        <div>
          <label>Transmission</label>
          <select name="transmission" value={form.transmission || ''} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
        </div>
        <div>
          <label>Location</label>
          <input name="location" value={form.location || ''} onChange={handleChange} required />
        </div>
        <div>
          <label>Rental Price (per day)</label>
          <input name="rentalPrice" type="number" step="0.01" value={form.rentalPrice || ''} onChange={handleChange} required />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default CarFormPage;