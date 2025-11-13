
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';

const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:7001/api/users/admin', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            
            setUsers(data);
            
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };
    return (
        <div className="p-6">
            <h1>Hello</h1>
            {
                users.map((item,index)=>(
                    <h1 key={index}>{item.message}</h1>

                ))
            }
        </div>
    );
};

export default AdminUserManagement;