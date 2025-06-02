import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signin from './authentication/Signin';
import Signup from './authentication/Signup';
import Dashboard from './dashboard/Dashboard';
import Account from './account/Account';
import Attendances from './attendances/Attendances';
import SectionAttendances from './attendances/SectionAttendances';
import ChangeAccountDetails from './account/ChangeAccountDetails';
import ChangePassword from './account/ChangePassword';
import FacialDetectionUserImages from './account/FacialDetectionUserImages';
import AttendancesGraph from './attendances/AttendancesGraph';
import Qrcode from './qrcode/Qrcode';
import CreateAccount from './authentication/CreateAccount';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={!token ? <Signin setToken={setToken} /> : <Navigate to="/dashboard" replace />} 
        />
        <Route 
          path="/signup" 
          element={!token ? <Signup setToken={setToken} /> : <Navigate to="/dashboard" replace />} 
        />
        <Route 
          path="/create-account" 
          element={!token ? <CreateAccount /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/dashboard" 
          element={token ? <Dashboard /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/account" 
          element={token ? <Account /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/my-attendances" 
          element={token ? <Attendances /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/overall-attendances" 
          element={token ? <Attendances /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/section-attendances" 
          element={token ? <SectionAttendances /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/account/change-details" 
          element={token ? <ChangeAccountDetails /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/account/change-password" 
          element={token ? <ChangePassword /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/account/facial-detection-user-images" 
          element={token ? <FacialDetectionUserImages /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/my-attendances/graph" 
          element={token ? <AttendancesGraph /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/overall-attendances/graph" 
          element={token ? <AttendancesGraph /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/section-attendances/graph" 
          element={token ? <AttendancesGraph /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/qrcode" 
          element={token ? <Qrcode /> : <Navigate to="/" replace />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
