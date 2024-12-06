import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import VotePage from './pages/VotePage.jsx';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import LoggedPage from './pages/LoggedPage';
import Results from './pages/Results';

function PrivateRoute({ children }) {
    const isAuthenticated = !!localStorage.getItem('token');
  
    return isAuthenticated ? children : <Navigate to="/login" />;
}

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Routes publiques */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/:type" element={<AuthPage />} />
                
                {/* Routes privées */}
                <Route path="/profile" element={<PrivateRoute><LoggedPage /></PrivateRoute>} />
                <Route path="/dashboard" element={<PrivateRoute><LoggedPage /></PrivateRoute>} />
                <Route path="/vote" element={<VotePage />} />
                <Route path="/vote/:id" element={<VotePage />} />
                <Route path="/manage-sessions" element={<PrivateRoute><LoggedPage /></PrivateRoute>} />
                <Route path="/security" element={<PrivateRoute><LoggedPage /></PrivateRoute>} />
                <Route path="/preferences" element={<PrivateRoute><LoggedPage /></PrivateRoute>} />
                <Route path="/logout" element={<PrivateRoute><LoggedPage /></PrivateRoute>} />
                
                {/* Route pour les résultats */}
                <Route path="/results" element={<Results />} />
            </Routes>
        </Router>
    );
};

export default App;
