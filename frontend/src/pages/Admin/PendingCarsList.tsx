import { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';
import type { CarListingDTO } from '../../types';
import Loading from '../../components/common/Loading';
import ErrorAlert from '../../components/common/ErrorAlert';

const PendingCarsList = () => {
  const [cars, setCars] = useState<CarListingDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState<number | null>(null);

  const fetchPendingCars = async () => {
  try {
    setLoading(true);
    const res = await adminApi.getPendingCars();
    setCars(res.data);
  } catch (err: any) {
    setError(err.response?.data?.message || 'Failed to fetch pending cars');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchPendingCars();
  }, []);

  const handleAction = async (id: number, approve: boolean) => {
    setProcessing(id);
    try {
      await adminApi.manageCarPost(id, approve);
      await fetchPendingCars();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Action failed');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div>
      <h2>Pending Car Posts</h2>
      {cars.length === 0 ? (
        <p>No pending car posts.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Owner</th>
              <th>Brand/Model</th>
              <th>Year</th>
              <th>Price/Day</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.id}>
                <td>{car.title}</td>
                <td>{car.ownerName}</td>
                <td>{car.brand} {car.model}</td>
                <td>{car.year}</td>
                <td>${car.rentalPrice}</td>
                <td>
                  <button
                    onClick={() => handleAction(car.id, true)}
                    disabled={processing === car.id}
                    className="approve-btn"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(car.id, false)}
                    disabled={processing === car.id}
                    className="reject-btn"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingCarsList;