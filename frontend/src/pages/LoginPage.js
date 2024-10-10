import axios from "axios";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // For navigation after login
import '../components/LoginPage.css';


const LoginPage = () => {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = React.useState('');  // 'success' or 'error'

  const navigate = useNavigate(); // Initialize navigation function

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === 'register') {  
      if (form.password !== form.confirmPassword) {
        setMessage('Passwords do not match');
        setMessageType('error');
        return;
      }

      try {
        await axios.post('http://localhost:5000/register', form);
        setMessage('Registration successful, please log in');
        setMode('login');
        setMessageType('success');
        setForm({ username: '', email: '', password: '', confirmPassword: '' });
      } catch (error) {
        console.error('Registration error:', error);
        setMessage('Error registering user');
        setMessageType('error');
      }
    } else {
      try {
        const response = await axios.post('http://localhost:5000/login', { email: form.email, password: form.password });
        localStorage.setItem('token', response.data.token);
        const token = localStorage.getItem('token');

        // console.log("Token in localStorage:", token);

        if (token) {
          setMessage('Login successful');
          setMessageType('success');
        
          setForm({ username: '', email: '', password: '', confirmPassword: '' });
          navigate('/dashboard');  // Redirect to Dashboard after login
        }
      } catch (error) {
        console.error('Login error:', error);
        setMessage('Error logging in');
        setMessageType('error');
        setForm({ username: '', email: '', password: '', confirmPassword: '' });
        console.error('Login error:', error);
      } 
    }

  };

  const renderLoginForm = () => (
    <body class="login-body">
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="email" placeholder="Email*" onChange={handleChange} value={form.email} required />
        <input type="password" name="password" placeholder="Password*" onChange={handleChange} value={form.password} required />
        <button className="login_button">Login</button>
      </form>
      <br />
      <button onClick={() => {
        setMode('register');
        setForm({ username: '', email: '', password: '', confirmPassword: '' });
        setMessage('');
      }}>Register</button>
      {message && <p className={messageType === 'success' ? 'success-message' : 'error-message'}>{message}</p>}
    </div>
    </body>
  );

  const renderRegisterForm = () => (
<body class="register-body">
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username*" onChange={handleChange} value={form.username} required />
        <input type="email" name="email" placeholder="Email*" onChange={handleChange} value={form.email} required />
        <input type="password" name="password" placeholder="Password*" onChange={handleChange} value={form.password} required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password*" onChange={handleChange} value={form.confirmPassword} required />
        <button className="register_button">Register</button>
      </form>
      <br />
      <button onClick={() => {
        setMode('login');
        setForm({ username: '', email: '', password: '', confirmPassword: '' });
        setMessage('');
      }}>Back to Login</button>
      {message && <p className={messageType === 'success' ? 'success-message' : 'error-message'}>{message}</p>}
    </div>
    </body>
  );

  return (
    <div className="login-page">
      {mode === 'login' ? renderLoginForm() : renderRegisterForm()}
    </div>
  );
};

export default LoginPage;

