import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/BugList.css'; // Assuming you have this for modal styles

const BugList = () => {
  const navigate = useNavigate();
  const [buglists, setBugLists] = useState([]);



  useEffect(() => {
  // Fetch BugLists from the backend
  const fetchBugList = async () => {
    try {
      const response = await fetch('http://localhost:5000/buglist');
      const data = await response.json();
      if (response.ok) {
         setBugLists(data.buglists); // Ensure buglists are set with the backend's createdTime
      } else {
        console.error('Error fetching buglists:', data);
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  // Create new buglist and save it to the database
  const createbuglist = async () => {
    const buglistData = {
      buglistId: Date.now().toString(), // Unique buglist ID
      buglistName: newbuglistName,
      createdBy: user.username, // Assume the user is creating the buglist
    };
  
    try {
      const response = await fetch('http://localhost:5000/createbuglist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buglistData),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('buglist created successfully:', data);
        // Set the createdAt date from the server response
        setbuglists([...buglists, { ...buglistData, createdTime: new Date().toLocaleDateString() }]); // Use createdAt instead of date
        setShowModal(false); // Close modal after successful save
        setNewbuglistName(''); // Reset input field
      } else {
        console.error('Error creating buglist:', data);
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createbuglist(); // Save buglist
  };

    // Function to open the modal and set the buglist to delete
    const openConfirmModal = (buglistId) => {
      setbuglistToDelete(buglistId);
      setShowConfirmModal(true);
    };
  
    // Function to close the modal without deleting
    const closeConfirmModal = () => {
      setbuglistToDelete(null);
      setShowConfirmModal(false);
    };
  const handleDelete = async (buglistId) =>{
    try {
      const response = await fetch(`http://localhost:5000/buglists/${buglistId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the deleted buglist from the state to update the UI
        setbuglists(buglists.filter((buglist) => buglist.buglistId !== buglistToDelete));
        setShowConfirmModal(false); // Close the modal after deleting
        setbuglistToDelete(null); // Reset the buglist to delete
        console.log('buglist deleted successfully');
      } else {
        console.error('Failed to delete the buglist');
      }
    } catch (error) {
      console.error('Request failed', error);
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

//const deletebuglist = () => 

  if (!user) return null;

  return (
    <div className="buglist">
      <div className="dashboard-header">
        <span className="username">{user.username}</span>
        <button className="logout-button" onClick={() => {
          localStorage.removeItem('token');
          navigate('/login');
        }}>
          Logout
        </button>
      </div>

      <div className="buglist-section">
        <button className="createbuglist" onClick={openModal}>
          Create buglist
        </button>
        <h2>buglists</h2>
        <table className="buglist-table">
          <thead>
            <tr>
              <th>buglist Name</th>
              <th>Created By</th>
              <th>Creation Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {buglists.map((buglist) => (
              <tr key={buglist.buglistId}>
                <td>{buglist.buglistName}</td>
                <td>{buglist.createdBy}</td>
                <td>{new Date(buglist.createdTime).toLocaleDateString()}</td>
                <td><button className = "editbuglist"> Edit</button> 
                  <button className = "deletebuglist" onClick={() => openConfirmModal(buglist.buglistId)}> 
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
            <h3>Create New buglist</h3>
            <form onSubmit={handleSubmit}>
              <label>
                buglist Name:
                <input
                  type="text"
                  value={newbuglistName}
                  onChange={(e) => setNewbuglistName(e.target.value)}
                  required
                />
              </label>
              <button type="submit">Save buglist</button>
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
            <h3>Are you sure you want to delete this buglist?</h3>
            <button className="confirm-btn" onClick={handleDelete}>Yes, Delete</button>
            <button className="cancel-btn" onClick={closeConfirmModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BugList;
