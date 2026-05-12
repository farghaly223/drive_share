import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { browsingApi } from '../../services/browsingApi';
import Loading from '../../components/common/Loading';
import ErrorAlert from '../../components/common/ErrorAlert';

const BrowseCarsPage = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ search: '', maxPrice: '', location: '', carType: '' });

  const fetchCars = async (params = {}) => {
    try { setLoading(true); const res = await browsingApi.filter(params); setCars(res.data); } catch (err) { setError(err.message); } finally { setLoading(false); }
  };
  useEffect(() => { fetchCars(); }, []);

  const handleFilterSubmit = (e) => { e.preventDefault(); fetchCars(filters); };

  if (loading) return <Loading />;
  return (
    <div>
      <h2>Browse Available Cars</h2>
      <form onSubmit={handleFilterSubmit} className="filter-form">
        <input name="search" placeholder="Search..." value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} />
        <input name="location" placeholder="Location" value={filters.location} onChange={e => setFilters({ ...filters, location: e.target.value })} />
        <input name="maxPrice" type="number" placeholder="Max Price" value={filters.maxPrice} onChange={e => setFilters({ ...filters, maxPrice: e.target.value })} />
        <input name="carType" placeholder="Car Type" value={filters.carType} onChange={e => setFilters({ ...filters, carType: e.target.value })} />
        <button type="submit">Apply Filters</button>
      </form>
      {error && <ErrorAlert message={error} />}
      <div className="car-grid">
        {cars.map(car => (<div key={car.id} className="car-card"><img src={car.mainImageUrl || '/placeholder-car.jpg'} alt="" /><h3>{car.title}</h3><p>{car.brand} {car.model} ({car.year})</p><p>{car.location}</p><p>${car.rentalPrice}/day</p><Link to={`/browse/${car.id}`}>View Details</Link></div>))}
      </div>
    </div>
  );
};
export default BrowseCarsPage;