import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Correct import for decoding JWT
import '../components/Dashboard.css'; // Assuming you have this for modal styles

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [showConfirmModal, setShowConfirmModal] = useState(false); // State to control the modal visibility
  const [projectToDelete, setProjectToDelete] = useState(null); // Store the project to be deleted


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
        fetchProjects(); // Fetch existing projects on page load
      } catch (error) {
        console.error('Invalid token:', error);
        navigate('/login');
      }
    }
  }, [navigate]);

  // Fetch projects from the backend
  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/projects');
      const data = await response.json();
      if (response.ok) {
        setProjects(data.projects); // Ensure projects are set with the backend's createdTime
      } else {
        console.error('Error fetching projects:', data);
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  // Create new project and save it to the database
  const createProject = async () => {
    const projectData = {
      projectId: Date.now().toString(), // Unique project ID
      projectName: newProjectName,
      createdBy: user.username, // Assume the user is creating the project
    };
  
    try {
      const response = await fetch('http://localhost:5000/createProject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('Project created successfully:', data);
        // Set the createdAt date from the server response
        setProjects([...projects, { ...projectData, createdTime: new Date().toLocaleDateString() }]); // Use createdAt instead of date
        setShowModal(false); // Close modal after successful save
        setNewProjectName(''); // Reset input field
      } else {
        console.error('Error creating project:', data);
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createProject(); // Save project
  };

    // Function to open the modal and set the project to delete
    const openConfirmModal = (projectId) => {
      setProjectToDelete(projectId);
      setShowConfirmModal(true);
    };
  
    // Function to close the modal without deleting
    const closeConfirmModal = () => {
      setProjectToDelete(null);
      setShowConfirmModal(false);
    };
  const handleDelete = async (projectId) =>{
    try {
      const response = await fetch(`http://localhost:5000/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the deleted project from the state to update the UI
        setProjects(projects.filter((project) => project.projectId !== projectToDelete));
        setShowConfirmModal(false); // Close the modal after deleting
        setProjectToDelete(null); // Reset the project to delete
        console.log('Project deleted successfully');
      } else {
        console.error('Failed to delete the project');
      }
    } catch (error) {
      console.error('Request failed', error);
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

//const deleteProject = () => 

  if (!user) return null;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <span className="username">{user.username}</span>
        <button className="logout-button" onClick={() => {
          localStorage.removeItem('token');
          navigate('/login');
        }}>
          Logout
        </button>
      </div>

      <div className="project-section">
        <button className="createProject" onClick={openModal}>
          Create Project
        </button>
        <h2>Projects</h2>
        <table className="project-table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Created By</th>
              <th>Creation Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.projectId}>
                <td>{project.projectName}</td>
                <td>{project.createdBy}</td>
                <td>{new Date(project.createdTime).toLocaleDateString()}</td>
                <td><button className="OpenProject" onClick={() => navigate(`/buglist/${project.projectId}`)}>
                  Open
              </button>
              <button className="deleteProject" onClick={() => openConfirmModal(project.projectId)}> 
                Delete
              </button> 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create New Project</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Project Name:
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  required
                />
              </label>
              <button type="submit">Save Project</button>
              <br></br>
              <button type="button" onClick={closeModal}>Cancel</button>
            </form>
          </div>
        </div>
      )}

       {/* Confirmation Modal */}
       {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Are you sure you want to delete this project?</h3>
            <button className="confirm-btn" onClick={handleDelete}>Yes, Delete</button>
            <button className="cancel-btn" onClick={closeConfirmModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
