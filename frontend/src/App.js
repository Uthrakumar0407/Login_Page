import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage'; // Adjust path if necessary
import Dashboard from './pages/Dashboard'; 
import BuglistPage from './pages/BuglistPage'; // Adjust path if necessary

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path = "/buglist/:projectId" element={<BuglistPage/>} />
        {/* Default route redirects to /login */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;
