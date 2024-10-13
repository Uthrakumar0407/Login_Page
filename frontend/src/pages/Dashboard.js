import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode'; // Correct import for decoding JWT
import { useNavigate } from 'react-router-dom'; // For navigation
import '../components/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);

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


        // Fetch projects (dummy data here, you can replace this with an API call)
        setProjects([
          { id: 1, name: 'Project Alpha', createdBy: 'Admin', date: '2024-01-01' },
          { id: 2, name: 'Project Beta', createdBy: 'User1', date: '2024-01-15' },
        ]);
      } catch (error) {
        // Handle token decoding errors
        console.error('Invalid token:', error);
        navigate('/login');
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    // Remove token and redirect to login page
    localStorage.removeItem('token');
    navigate('/login');
  };
  if (!user) {
    // If user is not set, do not render the dashboard
    return null;
  }

  return (

    <div className="dashboard">
    {/* Header section with Username and Logout in the top right */}
    <div className="dashboard-header">
      <span className="username">{user.username}</span>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>

    {/* Projects section with table */}
    <div className="project-section">
      <button className ="create">Create project</button>
      <h2>Projects</h2>
      <table className="project-table">
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Created By</th>
            <th>Creation Date</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.name}</td>
              <td>{project.createdBy}</td>
              <td>{project.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
};

export default Dashboard;


//onClick = {logoutHandler}
