import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../services/authApi';
import type { UserRegisterDto } from '../../types';
import ErrorAlert from '../../components/common/ErrorAlert';

const RegisterPage = () => {
  const [formData, setFormData] = useState<UserRegisterDto>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Renter',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authApi.register(formData);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>Create account</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 0, marginBottom: '1.75rem' }}>
        Join DriveShare today
      </p>
      {error && <ErrorAlert message={error} onDismiss={() => setError('')} />}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name</label>
          <input name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
        </div>
        <div>
          <label>Email</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
        </div>
        <div>
          <label>Password</label>
          <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
        </div>
        <div>
          <label>Confirm Password</label>
          <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" required />
        </div>
        <div>
          <label>Register as</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="renter">Renter</option>
            <option value="owner">Owner</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>**
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
