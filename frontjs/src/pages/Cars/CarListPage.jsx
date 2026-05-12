import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { carsApi } from '../../services/carsApi';
import { useAuth } from '../../hooks/useAuth';
import Loading from '../../components/common/Loading';
import ErrorAlert from '../../components/common/ErrorAlert';

const CarListPage = () => {
  const { canAddCars } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCars = async () => {
    try { setLoading(true); const res = await carsApi.getMyCars(); setCars(res.data); } catch (err) { setError(err.message); } finally { setLoading(false); }
  };
  useEffect(() => { fetchCars(); }, []);

  const handleDelete = async (id) => { if (window.confirm('Delete?')) { try { await carsApi.delete(id); fetchCars(); } catch (err) { alert(err.message); } } };
  if (loading) return <Loading />;
  return (
    <div>
      <h2>My Cars</h2>
      {canAddCars && <Link to="/cars/create" className="cta-button" style={{ display: 'inline-block', marginBottom: '1rem' }}>Add New Car</Link>}
      {error && <ErrorAlert message={error} />}
      {cars.length === 0 && <p>No cars yet.</p>}
      <div className="car-grid">{cars.map(car => (<div key={car.id} className="car-card"><img src={car.mainImageUrl || '/placeholder-car.jpg'} alt="" /><h3>{car.title}</h3><p>{car.brand} {car.model} ({car.year})</p><p>${car.rentalPrice}/day <span>Status: {car.rentalStatus}</span></p><div className="actions"><Link to={`/cars/edit/${car.id}`}>Edit</Link><button onClick={() => handleDelete(car.id)} className="reject-btn">Delete</button></div></div>))}</div>
    </div>
  );
};
export default CarListPage;