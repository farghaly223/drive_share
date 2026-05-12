import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-page">
      <section className="hero">
        <h1>Rent smarter.<br />Drive anywhere.</h1>
        <p>Connect with real car owners in your area. Browse hundreds of vehicles and book your next ride in minutes.</p>
        <Link to="/browse" className="cta-button">
          Browse Cars →
        </Link>
      </section>

      {isAuthenticated && (
        <section className="welcome">
          <h2>Welcome back, {user?.email}</h2>
        </section>
      )}

      <section className="features">
        <div className="feature">
          <div className="feature-icon">🚗</div>
          <h3>Find Your Ride</h3>
          <p>Browse hundreds of cars available for rent near you.</p>
        </div>
        <div className="feature">
          <div className="feature-icon">💰</div>
          <h3>Become a Host</h3>
          <p>List your car and earn money when you're not using it.</p>
        </div>
        <div className="feature">
          <div className="feature-icon">🔒</div>
          <h3>Secure Booking</h3>
          <p>Verified drivers and secure payments for every trip.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
