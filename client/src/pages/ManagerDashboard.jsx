import React from 'react';
import { useAuth } from '../context/useAuth';

const ManagerDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-blue-600">Manager Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.username || user?.name} ({user?.role})</span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-100 p-6 rounded-lg border border-blue-200">
              <h3 className="text-xl font-semibold mb-2 text-blue-800">User Access</h3>
              <p className="text-gray-700">You can access all user features</p>
            </div>
            <div className="bg-green-100 p-6 rounded-lg border border-green-200">
              <h3 className="text-xl font-semibold mb-2 text-green-800">Manager Features</h3>
              <p className="text-gray-700">Team management and reporting</p>
              <ul className="mt-2 list-disc list-inside text-sm text-green-700">
                <li>Team Management</li>
                <li>Performance Reports</li>
                <li>Project Oversight</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;