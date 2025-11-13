import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthContextProvider from './context/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';

function App() {
    return (
        
        
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route 
                        path="/admin" 
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/manager" 
                        element={
                            <ProtectedRoute allowedRoles={['admin', 'manager']}>
                                <ManagerDashboard />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/" 
                        element={
                            <ProtectedRoute allowedRoles={['admin', 'manager', 'user']}>
                                <Home />
                            </ProtectedRoute>
                        } 
                    />
                </Routes>
    );
}

export default App;