import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios'; // For making HTTP requests to the backend
import './App.css'; // Importing the stylesheet
import Dashboard from './components/Dashboard'; // Importing the Dashboard component

function App() {
  // State for handling the mode (login or register)
  const [mode, setMode] = useState('login');

  // State for managing form inputs
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });

  // State for displaying messages (like errors or success)
  const [message, setMessage] = useState('');

  // State to track if the user is authenticated (logged in)
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // Function to handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    if (mode === 'register') {
      // Handle registration
      if (form.password !== form.confirmPassword) {
        setMessage('Passwords do not match');
        return;
      }

      try {
        // Send registration data to the backend
        await axios.post('http://localhost:5000/register', form);
        setMessage('Registration successful, please log in');
        setMode('login'); // Switch to login mode after successful registration
      } catch (error) {
        setMessage('Error registering user');
      }
    } else {
      // Handle login
      try {
        // Send login data to the backend
        const response = await axios.post('http://localhost:5000/login', { email: form.email, password: form.password });
        
        // Save the token received from the backend to localStorage
        localStorage.setItem('token', response.data.token);
        
        // Update the authentication state
        setIsAuthenticated(true);
        setMessage('Login successful');
      } catch (error) {
        setMessage('Error logging in');
      }
    }
  };

  // Function to render the login form
  const renderLoginForm = () => (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="email" placeholder="Email" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        <button type="submit">Login</button>
      </form>
      <br></br>
      <button onClick={() => setMode('register')}>Register</button>
      {message && <p>{message}</p>}
    </div>
  );

  // Function to render the registration form
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
      <br></br>
      <button onClick={() => setMode('login')}>Back to Login</button>
      {message && <p>{message}</p>}
    </div>
  );

  return (
    <Router>
      <div className="container">
        <Routes>
          {/* Route for the dashboard, only accessible if authenticated */}
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
          />
          {/* Route for the login/register page */}
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
