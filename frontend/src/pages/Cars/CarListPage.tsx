import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { carsApi } from '../../services/carsApi';
import { useAuth } from '../../hooks/useAuth';
import type { CarListingDTO } from '../../types';
import Loading from '../../components/common/Loading';
import ErrorAlert from '../../components/common/ErrorAlert';

const CarListPage = () => {
  // ✅ Read canAddCars directly from AuthContext (set during login)
  const { canAddCars } = useAuth();

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
      setError(err.response?.data?.message || 'Failed to load cars.');
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

  if (loading) return <Loading />;

  return (
    <div>
      <h2>My Cars</h2>

      {canAddCars && (
        <Link
          to="/cars/create"
          className="cta-button"
          style={{ display: 'inline-block', marginBottom: '1rem' }}
        >
          Add New Car
        </Link>
      )}

      {error && <ErrorAlert message={error} />}

      {cars.length === 0 && !error && <p>You haven't listed any cars yet.</p>}

      <div className="car-grid">
        {cars.map((car) => (
          <div key={car.id} className="car-card">
            <img src={car.mainImageUrl || '/placeholder-car.jpg'} alt={car.title} />
            <h3>{car.title}</h3>
            <p>
              {car.brand} {car.model} ({car.year})
            </p>
            <p>${car.rentalPrice}/day</p>
            <p>Status: {car.rentalStatus}</p>
            <div className="actions">
              <Link to={`/cars/edit/${car.id}`}>Edit</Link>
              <button onClick={() => handleDelete(car.id)} className="reject-btn">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarListPage;