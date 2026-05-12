import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { carsApi } from '../../services/carsApi';
import { useAuth } from '../../hooks/useAuth';
import Loading from '../../components/common/Loading';
import ErrorAlert from '../../components/common/ErrorAlert';

const CarListPage = () => {
  // canAddCars permission from AuthContext (set at login time)
  const { canAddCars } = useAuth();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await carsApi.getMyCars();
      setCars(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load cars.');
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this car?')) return;
    try {
      await carsApi.delete(id);
      fetchCars();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="page-header">
        <h2>My Cars</h2>
        {/* Only show "Add New Car" button if permission is granted */}
        {canAddCars && (
          <Link to="/cars/create" className="btn-primary">
            + Add New Car
          </Link>
        )}
      </div>

      {!canAddCars && (
        <div className="warning-box">
          Your account is not yet approved to list cars. Please wait for admin approval.
        </div>
      )}

      {error && <ErrorAlert message={error} />}

      {cars.length === 0 && !error && (
        <div className="empty-state">
          <p>You haven't listed any cars yet.</p>
          {canAddCars && <Link to="/cars/create">List your first car →</Link>}
        </div>
      )}

      <div className="car-grid">
        {cars.map((car) => (
          <div key={car.id} className="car-card">
            <img src={car.mainImageUrl || '/placeholder-car.jpg'} alt={car.title} />
            <div className="car-card-body">
              <h3>{car.title}</h3>
              <p>
                {car.brand} {car.model} ({car.year})
              </p>
              <div className="price-tag">
                ${car.rentalPrice}
                <span>/day</span>
              </div>
              <p>
                Status:{' '}
                <span className={`status-badge status-${car.rentalStatus?.toLowerCase()}`}>
                  {car.rentalStatus}
                </span>
              </p>
              <div className="actions">
                <Link to={`/cars/edit/${car.id}`} className="btn-secondary">
                  Edit
                </Link>
                <button onClick={() => handleDelete(car.id)} className="reject-btn">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarListPage;
