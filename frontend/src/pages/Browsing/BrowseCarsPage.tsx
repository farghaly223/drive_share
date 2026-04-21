import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { browsingApi } from '../../services/browsingApi';
import type { CarListingDTO } from '../../types';
import Loading from '../../components/common/Loading';
import ErrorAlert from '../../components/common/ErrorAlert';

const BrowseCarsPage = () => {
  const [cars, setCars] = useState<CarListingDTO[]>([]);
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
      const params: any = {};
      if (filters.search) params.search = filters.search;
      if (filters.maxPrice) params.maxPrice = parseFloat(filters.maxPrice);
      if (filters.location) params.location = filters.location;
      if (filters.carType) params.carType = filters.carType;
      const res = await browsingApi.filter(params);
      setCars(res.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCars();
  };

  if (loading) return <Loading />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div>
      <h2>Browse Available Cars</h2>
      <form onSubmit={handleFilterSubmit} className="filter-form">
        <input name="search" placeholder="Search..." value={filters.search} onChange={handleFilterChange} />
        <input name="location" placeholder="Location" value={filters.location} onChange={handleFilterChange} />
        <input name="maxPrice" type="number" placeholder="Max Price" value={filters.maxPrice} onChange={handleFilterChange} />
        <input name="carType" placeholder="Car Type" value={filters.carType} onChange={handleFilterChange} />
        <button type="submit">Apply Filters</button>
      </form>
      <div className="car-grid">
        {cars.map((car) => (
          <div key={car.id} className="car-card">
            <img src={car.mainImageUrl || '/placeholder-car.jpg'} alt={car.title} />
            <h3>{car.title}</h3>
            <p>{car.brand} {car.model} ({car.year})</p>
            <p>{car.location}</p>
            <p>${car.rentalPrice}/day</p>
            <Link to={`/browse/${car.id}`}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowseCarsPage;