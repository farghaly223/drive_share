import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';
import Loading from '../../components/common/Loading';
import ErrorAlert from '../../components/common/ErrorAlert';
import { getErrorMessage } from '../../utils/helpers';

const PendingCarsList = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(null);

  const fetchPendingCars = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminApi.getPendingCars();
      // Backend returns only pending cars; no need to filter
      setCars(res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCars();
  }, []);

  const handleAction = async (id, approve) => {
    setProcessing(id);
    try {
      await adminApi.manageCarPost(id, approve);
      await fetchPendingCars();  // refresh list
    } catch (err) {
      setError(getErrorMessage(err));
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
              <th>ID</th>
              <th>Title</th>
              <th>Owner</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Year</th>
              <th>Price/Day</th>
              <th>Post Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.id}>
                <td>{car.id}</td>
                <td>{car.title}</td>
                <td>{car.ownerName || '—'}</td>
                <td>{car.brand || '—'}</td>
                <td>{car.model || '—'}</td>
                <td>{car.year}</td>
                <td>${car.rentalPrice}</td>
                <td style={{ textTransform: 'capitalize' }}>{car.postStatus}</td>
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