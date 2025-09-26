import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

 const VITE_API_URL = import.meta.env.VITE_API_URL as string;
 
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${VITE_API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, confirmPassword }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Registration failed');
      }

      const data = await res.json();
      sessionStorage.setItem('token', data.token);
      navigate('/api/newsposts');
    } catch (err: unknown) {
      if (!(err instanceof Error)) {
        console.error("Unknown error:");
      }
      else {setError(err.message);}
      
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;