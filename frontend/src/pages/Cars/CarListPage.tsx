import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { carsApi } from '../../services/carsApi';
import type { CarListingDTO } from '../../types';
import Loading from '../../components/common/Loading';
import ErrorAlert from '../../components/common/ErrorAlert';

const CarListPage = () => {
  const [cars, setCars] = useState<CarListingDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await carsApi.getMyCars();
      setCars(res.data);
    } catch (err: any) {
      console.error('Failed to fetch owner cars:', err);
      setError(err.response?.data?.message || 'Failed to load cars. The endpoint may not exist yet.');
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this car?')) return;
    try {
      await carsApi.delete(id);
      fetchCars();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const getStatusClass = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'available') return 'status-available';
    if (s === 'rented') return 'status-rented';
    return 'status-pending';
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="page-header">
        <h2>My Cars</h2>
        <Link to="/cars/create" className="cta-button">+ Add New Car</Link>
      </div>

      {error && <ErrorAlert message={error} />}

      {cars.length === 0 && !error ? (
        <div className="empty-state">
          <p>You haven't listed any cars yet.</p>
          <Link to="/cars/create" className="cta-button">List Your First Car</Link>
        </div>
      ) : (
        <div className="car-grid">
          {cars.map((car) => (
            <div key={car.id} className="car-card">
              <img src={car.mainImageUrl || '/placeholder-car.jpg'} alt={car.title} />
              <div className="car-card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                  <h3>{car.title}</h3>
                  <span className={`status-badge ${getStatusClass(car.rentalStatus)}`}>{car.rentalStatus}</span>
                </div>
                <p>{car.brand} {car.model} · {car.year}</p>
                <div className="price-tag">${car.rentalPrice}<span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-secondary)' }}>/day</span></div>
                <div className="actions">
                  <Link to={`/cars/edit/${car.id}`}>Edit</Link>
                  <button onClick={() => handleDelete(car.id)} className="reject-btn">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarListPage;
