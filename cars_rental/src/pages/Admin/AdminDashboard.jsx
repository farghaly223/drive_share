import { useEffect, useState } from "react";
import { getAllCars, getPendingOwners, manageOwner, manageCar } from "../../services/api";

export default function AdminDashboard() {
  const [cars, setCars] = useState([]);
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const carsRes = await getAllCars();
      const ownersRes = await getPendingOwners();

      setCars(carsRes.data.filter(c => c.status === "Pending" || c.isVerified === false));
      setOwners(ownersRes.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleCar = async (id, status) => {
    try {
      await manageCar(id, { status });
      setCars(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleOwner = async (id, status) => {
    try {
      await manageOwner(id, { status });
      setOwners(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl">Admin Dashboard</h1>

      <h2 className="mt-4">Pending Cars</h2>
      {cars.map(car => (
        <div key={car.id} className="border p-2 mb-2">
          <p>{car.title}</p>
          <button onClick={() => handleCar(car.id, "Approved")}>Approve</button>
          <button onClick={() => handleCar(car.id, "Rejected")}>Reject</button>
        </div>
      ))}

      <h2 className="mt-4">Pending Owners</h2>
      {owners.map(owner => (
        <div key={owner.id} className="border p-2 mb-2">
          <p>{owner.email}</p>
          <button onClick={() => handleOwner(owner.id, "Approved")}>Approve</button>
          <button onClick={() => handleOwner(owner.id, "Rejected")}>Reject</button>
        </div>
      ))}
    </div>
  );
}
