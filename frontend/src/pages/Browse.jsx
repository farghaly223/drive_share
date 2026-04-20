import { useState, useEffect } from 'react';
import { carsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Browse.css';

function CarCard({ car, onClick }) {
  const statusClass = car.rentalStatus?.toLowerCase() === 'rented' ? 'badge-rented' : 'badge-available';

  return (
    <div className="car-card" onClick={onClick}>
      <div className="car-image-wrap">
        {car.mainImageUrl && car.mainImageUrl !== 'default_car.png'
          ? <img src={car.mainImageUrl} alt={car.title} />
          : <div className="car-no-image">🚗</div>
        }
        <span className={`badge ${statusClass} car-status-badge`}>
          {car.rentalStatus || 'Available'}
        </span>
      </div>

      <div className="car-body">
        <div className="car-title">{car.title || `${car.brand} ${car.model}`}</div>
        <div className="car-subtitle">
          {[car.brand, car.model, car.year].filter(Boolean).join(' · ')}
          {car.ownerName && ` · by ${car.ownerName}`}
        </div>

        <div className="car-specs">
          {car.carType && <span className="car-spec">🚙 {car.carType}</span>}
          {car.transmission && <span className="car-spec">⚙️ {car.transmission}</span>}
          {car.location && <span className="car-spec">📍 {car.location}</span>}
        </div>

        <div className="car-footer">
          <div className="car-price">
            ${car.rentalPrice ?? '—'} <span>/day</span>
          </div>
          <button className="btn btn-primary btn-sm">View Details →</button>
        </div>
      </div>
    </div>
  );
}

export default function Browse() {
  const [cars, setCars] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ search: '', maxPrice: '', location: '', carType: '' });
  const navigate = useNavigate();

  useEffect(() => { fetchCars(); }, []);

  const fetchCars = async () => {
    try {
      setLoading(true); setError('');
      const response = await carsAPI.getAllCars();
      // Backend: BrowsingController returns Ok(IEnumerable<CarListingDTO>) → direct array
      const data = Array.isArray(response.data) ? response.data : (response.data?.value ?? []);
      setCars(data);
      setDisplayed(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load cars. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.search)   params.search   = filters.search;
      if (filters.maxPrice) params.maxPrice  = filters.maxPrice;
      if (filters.location) params.location  = filters.location;
      if (filters.carType)  params.carType   = filters.carType;
      const response = await carsAPI.filterCars(params);
      const data = Array.isArray(response.data) ? response.data : (response.data?.value ?? []);
      setDisplayed(data);
    } catch { setDisplayed(cars); }
    finally { setLoading(false); }
  };

  const handleReset = () => {
    setFilters({ search: '', maxPrice: '', location: '', carType: '' });
    setDisplayed(cars);
  };

  return (
    <div className="browse-page">
      <div className="browse-hero">
        <h1>Find Your Ride 🚗</h1>
        <p>Browse peer-to-peer car rentals from verified owners near you</p>
      </div>

      <div className="filters-bar">
        <div className="form-group">
          <label>Search</label>
          <input type="text" name="search" placeholder="Brand or model…"
            value={filters.search} onChange={e => setFilters(p => ({ ...p, search: e.target.value }))} />
        </div>
        <div className="form-group">
          <label>Max Price/day ($)</label>
          <input type="number" name="maxPrice" placeholder="e.g. 100"
            value={filters.maxPrice} onChange={e => setFilters(p => ({ ...p, maxPrice: e.target.value }))} />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input type="text" name="location" placeholder="City or area…"
            value={filters.location} onChange={e => setFilters(p => ({ ...p, location: e.target.value }))} />
        </div>
        <div className="form-group">
          <label>Car Type</label>
          <select value={filters.carType} onChange={e => setFilters(p => ({ ...p, carType: e.target.value }))}>
            <option value="">All Types</option>
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="convertible">Convertible</option>
            <option value="truck">Truck</option>
          </select>
        </div>
        <div className="filter-actions">
          <button className="btn btn-primary" onClick={handleFilter}>Search</button>
          <button className="btn btn-secondary" onClick={handleReset}>Reset</button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="page-loading"><span className="spinner" /> Loading cars…</div>
      ) : displayed.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <h3>No cars found</h3>
          <p>Try adjusting your filters or check back later</p>
          <button className="btn btn-primary" onClick={handleReset}>Show All Cars</button>
        </div>
      ) : (
        <>
          <div className="results-meta">Showing <strong>{displayed.length}</strong> available {displayed.length === 1 ? 'car' : 'cars'}</div>
          <div className="cars-grid">
            {displayed.map(car => (
              <CarCard key={car.id} car={car} onClick={() => navigate(`/car/${car.id}`)} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
