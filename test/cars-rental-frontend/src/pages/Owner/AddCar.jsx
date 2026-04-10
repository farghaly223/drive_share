import { useState } from "react";
import { addCar } from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function AddCar() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    carType: "SUV",
    brand: "Toyota",
    model: "",
    year: 2020,
    transmission: "Automatic",
    location: "Cairo",
    rentalPrice: 100,
    availabilityCalendar: ""
  });

  const handleSubmit = async () => {
    try {
      await addCar({
        ...form,
        year: Number(form.year),
        rentalPrice: Number(form.rentalPrice)
      });
      navigate("/owner/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="p-6">
      <h1>Add Car</h1>

      <input placeholder="Title" onChange={e => setForm({...form, title: e.target.value})} />
      <input placeholder="Model" onChange={e => setForm({...form, model: e.target.value})} />

      <select onChange={e => setForm({...form, brand: e.target.value})}>
        <option>Toyota</option>
        <option>BMW</option>
      </select>

      <select onChange={e => setForm({...form, carType: e.target.value})}>
        <option>SUV</option>
        <option>Sedan</option>
      </select>

      <select onChange={e => setForm({...form, transmission: e.target.value})}>
        <option>Automatic</option>
        <option>Manual</option>
      </select>

      <select onChange={e => setForm({...form, location: e.target.value})}>
        <option>Cairo</option>
        <option>Giza</option>
      </select>

      <input type="number" onChange={e => setForm({...form, year: e.target.value})} />
      <input type="number" onChange={e => setForm({...form, rentalPrice: e.target.value})} />

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
