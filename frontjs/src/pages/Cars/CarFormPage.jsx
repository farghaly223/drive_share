import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { carsApi } from '../../services/carsApi';
import { browsingApi } from '../../services/browsingApi';
import { useAuth } from '../../hooks/useAuth';
import Loading from '../../components/common/Loading';

const CarFormPage = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { canAddCars } = useAuth();
  const [form, setForm] = useState({ title: '', description: '', carType: '', brand: '', model: '', year: '', transmission: '', location: '', rentalPrice: '', availabilityCalendar: '' });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);

  useEffect(() => { if (!canAddCars) { navigate('/cars/manage'); return; } if (isEdit) { browsingApi.getById(Number(id)).then(res => { const c=res.data; setForm({ title:c.title, description:c.description, carType:c.carType, brand:c.brand, model:c.model, year:c.year, transmission:c.transmission, location:c.location, rentalPrice:c.rentalPrice, availabilityCalendar:'' }); }).catch(() => navigate('/cars/manage')).finally(() => setFetchLoading(false)); } }, [id, isEdit, navigate, canAddCars]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => { e.preventDefault(); setLoading(true); try { if (isEdit) await carsApi.update(Number(id), form); else await carsApi.create(form); navigate('/cars/manage'); } catch (err) { alert(err.message); } finally { setLoading(false); } };

  if (fetchLoading) return <Loading />;
  return (
    <div>
      <h2>{isEdit ? 'Edit Car' : 'Add New Car'}</h2>
      <form onSubmit={handleSubmit} className="car-form">
        <div><label>Title</label><input name="title" value={form.title} onChange={handleChange} required /></div>
        <div><label>Description</label><textarea name="description" value={form.description} onChange={handleChange} /></div>
        <div><label>Car Type</label><input name="carType" value={form.carType} onChange={handleChange} /></div>
        <div><label>Brand</label><input name="brand" value={form.brand} onChange={handleChange} required /></div>
        <div><label>Model</label><input name="model" value={form.model} onChange={handleChange} required /></div>
        <div><label>Year</label><input name="year" type="number" value={form.year} onChange={handleChange} required /></div>
        <div><label>Transmission</label><select name="transmission" value={form.transmission} onChange={handleChange} required><option value="">Select</option><option value="automatic">Automatic</option><option value="manual">Manual</option></select></div>
        <div><label>Location</label><input name="location" value={form.location} onChange={handleChange} required /></div>
        <div><label>Rental Price (per day)</label><input name="rentalPrice" type="number" step="0.01" value={form.rentalPrice} onChange={handleChange} required /></div>
        <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
      </form>
    </div>
  );
};
export default CarFormPage;