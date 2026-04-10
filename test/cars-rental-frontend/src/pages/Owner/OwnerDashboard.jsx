import { useEffect, useState } from "react";
import { getAllCars, getOwnerBookings, respondBooking } from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function OwnerDashboard() {
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const carsRes = await getAllCars();
      const bookingsRes = await getOwnerBookings();
      setCars(carsRes.data);
      setBookings(bookingsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBooking = async (id, status) => {
    try {
      await respondBooking(id, { status });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1>Owner Dashboard</h1>
      <button onClick={() => navigate("/owner/add-car")}>Add Car</button>

      <h2>Your Cars</h2>
      {cars.map(c => <div key={c.id}>{c.title}</div>)}

      <h2>Bookings</h2>
      {bookings.map(b => (
        <div key={b.id}>
          <p>{b.carId}</p>
          <button onClick={() => handleBooking(b.id, "Approved")}>Approve</button>
          <button onClick={() => handleBooking(b.id, "Rejected")}>Reject</button>
        </div>
      ))}
    </div>
  );
}
