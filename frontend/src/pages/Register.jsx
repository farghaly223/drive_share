import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '', fullName: '', role: 'renter',
  });
  const [errors, setErrors] = useState({});
  const { register, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = {};
    if (!formData.fullName) err.fullName = 'Full name is required';
    if (!formData.email) err.email = 'Email is required';
    if (!formData.password) err.password = 'Password is required';
    if (formData.password.length < 6) err.password = 'Minimum 6 characters';
    if (formData.password !== formData.confirmPassword) err.confirmPassword = 'Passwords do not match';
    if (Object.keys(err).length) { setErrors(err); return; }

    setErrors({});
    const result = await register(formData.email, formData.password, formData.fullName, formData.role, formData.confirmPassword);
    if (result.success) navigate('/browse');
    else setErrors({ form: result.message });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🚗 DriveShare</div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-sub">Join the peer-to-peer car rental platform</p>

        {errors.form && <div className="alert alert-error">{errors.form}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange}
              placeholder="John Doe" className={errors.fullName ? 'input-error' : ''} />
            {errors.fullName && <span className="field-error">{errors.fullName}</span>}
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              placeholder="you@example.com" className={errors.email ? 'input-error' : ''} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Account Type</label>
            <div className="role-selector">
              {[['renter', '🙋', 'Renter'], ['owner', '🏎️', 'Car Owner']].map(([val, icon, label]) => (
                <div key={val}>
                  <input type="radio" name="role" id={`role-${val}`} value={val}
                    className="role-option" checked={formData.role === val} onChange={handleChange} />
                  <label htmlFor={`role-${val}`} className="role-label">
                    <span className="role-icon">{icon}</span>
                    <span className="role-name">{label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange}
              placeholder="Min 6 characters" className={errors.password ? 'input-error' : ''} />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
              placeholder="••••••••" className={errors.confirmPassword ? 'input-error' : ''} />
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? <><span className="spinner" /> Creating account...</> : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <a href="/login">Sign in here</a>
        </div>
      </div>
    </div>
  );
}
