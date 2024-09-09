import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode'; // Correct import for decoding JWT
import { useNavigate } from 'react-router-dom'; // For navigation
import '../components/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      // If token is not available, redirect to login page
      navigate('/login');
    } else {
      try {
        // Decode token to get user information
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
      } catch (error) {
        // Handle token decoding errors
        console.error('Invalid token:', error);
        navigate('/login');
      }
    }
  }, [navigate]);

  if (!user) {
    // If user is not set, do not render the dashboard
    return null;
  }

  return (
    <div className="dashboard">
      <h2>Welcome, {user.username}!</h2>
      {/* Additional dashboard content */}

      <p>
        <button
          className="logout"
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }}
        >
          Logout
        </button>
      </p>
    </div>
  );
};

export default Dashboard;


//onClick = {logoutHandler}
