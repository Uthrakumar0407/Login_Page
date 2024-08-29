import React from 'react';
import { jwtDecode } from 'jwt-decode';  // Correct way for named import
import './Dashboard.css';

const Dashboard = () => {
  const token = localStorage.getItem('token');
  const user = token ? jwtDecode(token) : { username: 'Guest' };

  return (
    <div className="dashboard">
      <h2>Welcome, {user.username}!</h2>
      {/* Additional dashboard content */}
    </div>
  );
};

export default Dashboard;
