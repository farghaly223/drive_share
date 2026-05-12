import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../services/authApi';
import { getErrorMessage } from '../../utils/helpers';
import ErrorAlert from '../../components/common/ErrorAlert';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'renter' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    setError('');
    setLoading(true);
    try { await authApi.register(form); navigate('/login'); } catch (err) { setError(getErrorMessage(err)); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-form">
      <h2>Register</h2>
      {error && <ErrorAlert message={error} onDismiss={() => setError('')} />}
      <form onSubmit={handleSubmit}>
        <div><label>Full Name</label><input name="name" value={form.name} onChange={handleChange} required /></div>
        <div><label>Email</label><input name="email" type="email" value={form.email} onChange={handleChange} required /></div>
        <div><label>Password</label><input name="password" type="password" value={form.password} onChange={handleChange} required /></div>
        <div><label>Confirm Password</label><input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required /></div>
        <div><label>Register as</label><select name="role" value={form.role} onChange={handleChange}><option value="renter">Renter</option><option value="owner">Owner</option></select></div>
        <button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
      </form>
    </div>
  );
};
export default RegisterPage;