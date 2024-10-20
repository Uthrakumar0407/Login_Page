import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import '../components/BuglistPage.css';

const BuglistPage = () => {
  const { projectId } = useParams(); // Get the projectId from the URL
  const [buglists, setBuglists] = useState([]);
  const [newBuglistName, setNewBuglistName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // State to control the modal visibility
  const [buglistToDelete, setBuglistToDelete] = useState(null); // Store the buglist to be deleted
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
      } catch (error) {
        console.error('Invalid token:', error);
        navigate('/login');
      }
    }
  }, [navigate]);

  // Fetch buglists for this project
  const fetchBuglists = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/projects/${projectId}/buglists`);
      const data = await response.json();
      if (response.ok) {
        setBuglists(data.buglists);
      } else {
        console.error('Error fetching buglists:', data);
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  }, [projectId]);

  useEffect(() => {
    fetchBuglists();
  }, [fetchBuglists]);

  // Create a new buglist and save it to the database
  const createBuglist = async () => {
    const buglistData = {
      bugListName: newBuglistName,
      createdBy: user?.username, // Use the logged-in user info here
    };

    try {
      const response = await fetch(`http://localhost:5000/projects/${projectId}/createbuglist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buglistData),
      });

      const data = await response.json();
      if (response.ok) {
        setBuglists([...buglists, { ...buglistData, createdTime: new Date().toLocaleDateString() }]);
        setShowModal(false); // Close the modal
        setNewBuglistName(''); // Clear input field
      } else {
        console.error('Error creating buglist:', data);
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createBuglist();
  };

  // Open confirmation modal for deletion
  const openConfirmModal = (bugListId) => {
    setBuglistToDelete(bugListId);
    setShowConfirmModal(true);
  };

  // Close confirmation modal
  const closeConfirmModal = () => {
    setBuglistToDelete(null);
    setShowConfirmModal(false);
  };

  // Handle buglist deletion
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/buglists/${buglistToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the deleted buglist from the state
        setBuglists(buglists.filter((buglist) => buglist.bugListId !== buglistToDelete));
        setShowConfirmModal(false); // Close the modal after deleting
        setBuglistToDelete(null); // Reset the buglist to delete
      } else {
        console.error('Failed to delete the buglist');
      }
    } catch (error) {
      console.error('Request failed', error);
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div className="buglist-page">
      <h2>Buglists for Project {projectId}</h2>

      <button className="createBuglist" onClick={openModal}>
        Create Buglist
      </button>

      {/* Buglist Table */}
      <table className="buglist-table">
        <thead>
          <tr>
            <th>Buglist Name</th>
            <th>Created By</th>
            <th>Creation Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {buglists.map((buglist) => (
            <tr key={buglist.bugListId}>
              <td>{buglist.bugListName}</td>
              <td>{buglist.createdBy}</td>
              <td>{new Date(buglist.createdTime).toLocaleDateString()}</td>
              <td>
                <button
                  className="openBuglist"
                  onClick={() => navigate(`/buglist/${buglist.bugListId}`)}
                >
                  Open
                </button>
                <button
                  className="deleteBuglist"
                  onClick={() => openConfirmModal(buglist.bugListId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for creating a new buglist */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create New Buglist</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Buglist Name:
                <input
                  type="text"
                  value={newBuglistName}
                  onChange={(e) => setNewBuglistName(e.target.value)}
                  required
                />
              </label>
              <button type="submit">Save Buglist</button>
              <button type="button" onClick={closeModal}>
                Cancel  
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for deleting a buglist */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Are you sure you want to delete this buglist?</h3>
            <button className="confirm-btn" onClick={handleDelete}>
              Yes, Delete
            </button>
            <button className="cancel-btn" onClick={closeConfirmModal}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuglistPage;
