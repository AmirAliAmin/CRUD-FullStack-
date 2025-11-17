
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { FaUsers } from "react-icons/fa";
import { GrTasks } from "react-icons/gr";
import { IoMdSettings } from "react-icons/io";
import { RiLogoutCircleLine } from "react-icons/ri";

const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [currState, setCurrState] = useState("user")
    const { user, logout } = useAuth();


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
        <div className="w-full flex justify-between">
            {/* {
                users.map((item,index)=>(
                    <h1 key={index}>{item.message}</h1>

                ))
            } */}
            <div className='relative bg-blue-500  w-[20%] h-screen py-4 text-white'>
                <h1 className='text-lg font-extrabold px-3'>Admin Dashboard</h1>
                <ul className='py-5 flex flex-col gap-3'>
                    <li className={`hover:bg-white flex items-center gap-2 rounded-lg py-2 px-2 mx-2 hover:text-blue-500 cursor-pointer ${currState === "user" ? "bg-white text-blue-500" :""}`} onClick={()=>setCurrState("user")}><FaUsers /> Users</li>
                    <li className={`hover:bg-white rounded-lg flex items-center gap-2 py-2 px-2 mx-2 hover:text-blue-500 cursor-pointer ${currState === "task" ? "bg-white text-blue-500" :""}`} onClick={()=>setCurrState("task")}><GrTasks /> All Task</li>
                    <li className={`hover:bg-white flex items-center gap-2 rounded-lg py-2 px-2 mx-2 hover:text-blue-500 cursor-pointer ${currState === "setting" ? "bg-white text-blue-500" :""}`}onClick={()=>setCurrState("setting")}><IoMdSettings /> Setting</li>
                </ul>
                <button className='hover:bg-white hover:text-blue-500 mx-5 absolute py-2 px-15 bottom-0 cursor-pointer border-t flex justify-center items-center gap-2' onClick={logout}><RiLogoutCircleLine /> Logout </button>
            </div>
            <div className='h-screen w-[80%] text-blue-500 p-5'>
                {
                    currState === "user" &&(
                        <div>
                            <h1>All Users</h1>
                            <div className=" text-blue-500 rounded-lg shadow overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                users.map((userItem) => (
                                    <tr key={userItem._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{userItem.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{userItem.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select 
                                                value={userItem.role} 
                                                onChange={(e) => updateUserRole(userItem._id, e.target.value)}
                                                className="border rounded p-1"
                                            >
                                                <option value="user">User</option>
                                                <option value="manager">Manager</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button 
                                                onClick={() => updateUserRole(userItem._id, userItem.role)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                            >
                                                Update
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                        </div>
                    )
                }
                {
                    currState === "task" &&(
                        <div>
                            <h1>Task</h1>
                        </div>
                    )
                }
                {
                    currState === "setting" &&(
                        <div>
                            <h1>Setting</h1>
                        </div>
                    )
                }

            </div>
        </div>
    );
};

export default AdminUserManagement;