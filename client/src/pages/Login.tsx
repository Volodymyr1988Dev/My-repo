import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

type LoginProps = {
  setToken: (t: string) => void;
};


const Login:React.FC<LoginProps> = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Login failed');
      }
      const data = await res.json();
     // Login(data.token);
      sessionStorage.setItem('token', data.token);
      setToken(data.token);
      console.log('Logged in with token:', data.token);
      navigate('/posts');
    } catch (err: any) {
      setError(err.message);
    }
  };
  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Login</button>
       <Link to="/register">Зареєструватися</Link>
    </form>

  );
};

export default Login;