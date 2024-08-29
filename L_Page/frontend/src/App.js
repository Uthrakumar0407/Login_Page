import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Dashboard from './components/Dashboard';

function App() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === 'register') {
      if (form.password !== form.confirmPassword) {
        setMessage('Passwords do not match');
        return;
      }

      try {
        await axios.post('http://localhost:5000/register', form);
        setMessage('Registration successful, please log in');
        setMode('login');
      } catch (error) {
        setMessage('Error registering user');
      }
    } else {
      try {
        const response = await axios.post('http://localhost:5000/login', { email: form.email, password: form.password });
        localStorage.setItem('token', response.data.token);
        setIsAuthenticated(true);
        setMessage('Login successful');
      } catch (error) {
        setMessage('Error logging in');
      }
    }
  };

  const renderLoginForm = () => (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="email" placeholder="Email" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        <button type="submit">Login</button>
      </form>
      <button onClick={() => setMode('register')}>Register</button>
      {message && <p>{message}</p>}
    </div>
  );

  const renderRegisterForm = () => (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} />
        <button type="submit">Register</button>
      </form>
      <button onClick={() => setMode('login')}>Back to Login</button>
      {message && <p>{message}</p>}
    </div>
  );

  return (
    <Router>
      <div className="container">
        <Routes>
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={mode === 'login' ? renderLoginForm() : renderRegisterForm()}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
