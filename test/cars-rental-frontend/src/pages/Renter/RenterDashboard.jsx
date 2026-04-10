import { useEffect, useState } from "react";
import { getAllCars, requestBooking } from "../../services/api";

export default function RenterDashboard() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const res = await getAllCars();
      setCars(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBook = async (carId) => {
    try {
      await requestBooking({ carId: Number(carId) });
      alert("Booking requested");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1>Browse Cars</h1>
      {cars.map(car => (
        <div key={car.id} className="border p-2 mb-2">
          <p>{car.title}</p>
          <button onClick={() => handleBook(car.id)}>Book</button>
        </div>
      ))}
    </div>
  );
}
