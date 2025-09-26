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

 const VITE_API_URL = import.meta.env.VITE_API_URL as string;
 
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${VITE_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Login failed');
      }
      const data = await res.json();
     
      sessionStorage.setItem('token', data.token);
      setToken(data.token);
      console.log('Logged in with token:', data.token);
      console.log('data:', data);
      navigate('/posts');
    } catch (err: unknown) {
      if (!(err instanceof Error)) {
        console.error("Unknown error:", err);
        setError("An unknown error occurred");
        return;
      }
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