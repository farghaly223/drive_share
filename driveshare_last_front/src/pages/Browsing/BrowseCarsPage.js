import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { browsingApi } from '../../services/browsingApi';
import Loading from '../../components/common/Loading';
import ErrorAlert from '../../components/common/ErrorAlert';

const BrowseCarsPage = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    maxPrice: '',
    location: '',
    carType: '',
  });

  const fetchCars = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.maxPrice) params.maxPrice = parseFloat(filters.maxPrice);
      if (filters.location) params.location = filters.location;
      if (filters.carType) params.carType = filters.carType;
      const res = await browsingApi.filter(params);
      setCars(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchCars();
  };

  const getStatusClass = (status) => {
    const s = status?.toLowerCase();
    if (s === 'available') return 'status-available';
    if (s === 'rented') return 'status-rented';
    return 'status-pending';
  };

  if (loading) return <Loading />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div>
      <div className="page-header">
        <h2>Browse Available Cars</h2>
        <span className="text-muted">{cars.length} vehicles found</span>
      </div>

      <form onSubmit={handleFilterSubmit} className="filter-form">
        <input
          name="search"
          placeholder="Search by name..."
          value={filters.search}
          onChange={handleFilterChange}
        />
        <input
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleFilterChange}
        />
        <input
          name="maxPrice"
          type="number"
          placeholder="Max price / day"
          value={filters.maxPrice}
          onChange={handleFilterChange}
        />
        <input
          name="carType"
          placeholder="Car type"
          value={filters.carType}
          onChange={handleFilterChange}
        />
        <button type="submit" className="btn-primary">
          Apply Filters
        </button>
      </form>

      {cars.length === 0 ? (
        <div className="empty-state">
          <p>No cars found matching your filters.</p>
        </div>
      ) : (
        <div className="car-grid">
          {cars.map((car) => (
            <div key={car.id} className="car-card">
              <img src={car.mainImageUrl || '/placeholder-car.jpg'} alt={car.title} />
              <div className="car-card-body">
                <div className="car-card-header">
                  <h3>{car.title}</h3>
                  <span className={`status-badge ${getStatusClass(car.rentalStatus)}`}>
                    {car.rentalStatus}
                  </span>
                </div>
                <p className="car-meta">
                  {car.brand} {car.model} · {car.year}
                </p>
                <p className="car-location">{car.location}</p>
                <div className="price-tag">
                  ${car.rentalPrice}
                  <span>/day</span>
                </div>
                <Link to={`/browse/${car.id}`} className="view-link">
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseCarsPage;
