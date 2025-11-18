import React, { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { FaUsers } from "react-icons/fa";
import { GrTasks } from "react-icons/gr";
import { IoMdSettings } from "react-icons/io";
import { RiLogoutCircleLine } from "react-icons/ri";
import { RiDashboardFill } from "react-icons/ri";
import { PiUsersThreeFill } from "react-icons/pi";
import { FaTasks } from "react-icons/fa";
import { AiFillPieChart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTasks: 0,
    completedTasks: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [currState, setCurrState] = useState("dashboard");
  const { user, logout } = useAuth();

  const [adminName, setAdminName] = useState(user.username);
  const [adminEmail, setAdminEmail] = useState(user.email);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "admin") {
      if (currState === "dashboard") {
        fetchDashboardData();
      } else if (currState === "user") {
        fetchUsers();
      } else if (currState === "task") {
        fetchTasks();
      }
    }
  }, [user, currState]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:7001/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
        setRecentUsers(data.recentUsers);
        setRecentTasks(data.recentTasks);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:7001/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:7001/api/admin/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:7001/api/admin/users/${userId}/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Update the local state
        setUsers(
          users.map((user) =>
            user._id === userId ? { ...user, role: newRole } : user
          )
        );
        alert("User role updated successfully!");
      } else {
        alert("Failed to update user role");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Error updating user role");
    }
  };

  return (
    <div className="w-full flex justify-between">
      <div className="fixed sm:block hidden bg-blue-500 w-[20%] h-screen py-4 text-white">
        <h1
          className="text-lg font-extrabold px-3 cursor-pointer"
          onClick={() => setCurrState("dashboard")}
        >
          Admin Dashboard
        </h1>
        <ul className="py-5 flex flex-col gap-3">
          <li
            className={`hover:bg-white flex items-center gap-2 rounded-lg py-2 px-2 mx-2 hover:text-blue-500 cursor-pointer ${
              currState === "dashboard" ? "bg-white text-blue-500" : ""
            }`}
            onClick={() => setCurrState("dashboard")}
          >
            <AiFillPieChart /> Dashboard
          </li>
          <li
            className={`hover:bg-white flex items-center gap-2 rounded-lg py-2 px-2 mx-2 hover:text-blue-500 cursor-pointer ${
              currState === "user" ? "bg-white text-blue-500" : ""
            }`}
            onClick={() => setCurrState("user")}
          >
            <FaUsers /> Users
          </li>
          <li
            className={`hover:bg-white rounded-lg flex items-center gap-2 py-2 px-2 mx-2 hover:text-blue-500 cursor-pointer ${
              currState === "task" ? "bg-white text-blue-500" : ""
            }`}
            onClick={() => setCurrState("task")}
          >
            <GrTasks /> All Tasks
          </li>
          <li
            className={`hover:bg-white flex items-center gap-2 rounded-lg py-2 px-2 mx-2 hover:text-blue-500 cursor-pointer ${
              currState === "setting" ? "bg-white text-blue-500" : ""
            }`}
            onClick={() => setCurrState("setting")}
          >
            <IoMdSettings /> Setting
          </li>
        </ul>
        <button
          className="hover:bg-white hover:text-blue-500 mx-5 absolute py-2 px-5 lg:px-15 bottom-0 cursor-pointer border-t flex justify-center items-center gap-2"
          onClick={logout}
        >
          <RiLogoutCircleLine /> Logout
        </button>
      </div>

      <div className="sm:ml-[20%] sm:w-[80%] w-full text-blue-500 p-5 ">
        {currState === "dashboard" && (
          <div className="p-0 sm:px-6 w-full flex flex-wrap flex-col items-center">
            <h1 className="px-5 text-2xl font-extrabold mb-7">
              Welcome Admin: {user?.username}{" "}
            </h1>
            <div className="flex flex-wrap gap-2 lg:gap-10">
              <div className="bg-blue-500 text-white p-2 md:p-3 lg:p-5 flex gap-8 items-center rounded-lg">
                <div>
                  <h1 className="font-light">Total Users</h1>
                  <p className="font-bold text-2xl">{stats.totalUsers}</p>
                </div>
                <div className="w-10 bg-white flex items-center text-blue-500 justify-center rounded-full border h-10">
                  <PiUsersThreeFill className="text-xl" />
                </div>
              </div>
              <div className="bg-blue-500 text-white p-2 md:p-3 lg:p-5 flex gap-8 items-center rounded-lg">
                <div>
                  <h1 className="font-light">Total Tasks</h1>
                  <p className="font-bold text-2xl">{stats.totalTasks}</p>
                </div>
                <div className="w-10 bg-white flex items-center text-blue-500 justify-center rounded-full border h-10">
                  <GrTasks className="text-xl" />
                </div>
              </div>
              <div className="bg-blue-500 text-white p-2 md:p-3 lg:p-5 flex gap-8 items-center rounded-lg">
                <div>
                  <h1 className="font-light">Completed Tasks</h1>
                  <p className="font-bold text-2xl">{stats.completedTasks}</p>
                </div>
                <div className="w-10 bg-white flex items-center text-blue-500 justify-center rounded-full border h-10">
                  <FaTasks className="text-xl" />
                </div>
              </div>
            </div>

            <div className="flex mt-5 justify-between flex-wrap gap-10">
              <div className="md:w-100 bg-blue-500  text-white p-5 rounded-lg">
                <div className="flex justify-between items-center">
                  <h1>Recent Users</h1>
                  <button
                    className="bg-white hover:bg-indigo-100 text-blue-500 py-1 px-2 rounded-lg cursor-pointer"
                    onClick={() => setCurrState("user")}
                  >
                    See all user
                  </button>
                </div>
                <table className="w-full mt-5">
                  <thead>
                    <tr className="grid grid-cols-2 bg-blue-300 py-2 rounded-t-lg">
                      <th className="font-light">User Name</th>
                      <th className="font-light">Email</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-3">
                    {recentUsers.slice(0, 5).map((user) => (
                      <tr
                        key={user._id}
                        className="grid grid-cols-2 border-b border-gray-400 py-2"
                      >
                        <td className="flex items-center justify-center">
                          {user.username}
                        </td>
                        <td className="flex items-center justify-center  overflow-scroll no-scroll">
                          {user.email}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:w-120 bg-blue-500 text-white p-5 rounded-lg">
                <div className="flex justify-between items-center">
                  <h1>Recent Tasks</h1>
                  <button
                    className="bg-white text-blue-500 py-1 px-2 rounded-lg cursor-pointer hover:bg-indigo-100"
                    onClick={() => setCurrState("task")}
                  >
                    See all task
                  </button>
                </div>
                <table className="w-full mt-5">
                  <thead>
                    <tr className="grid grid-cols-2 bg-blue-300 py-2 rounded-t-lg">
                      <th className="font-light">Task Content</th>
                      <th className="font-light">User</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-3">
                    {recentTasks.slice(0, 10).map((task) => (
                      <tr
                        key={task._id}
                        className="grid grid-cols-2 border-b border-gray-400 py-2"
                      >
                        <td className="flex items-center justify-center text-sm">
                          {task.task}
                        </td>
                        <td className="flex items-center justify-center">
                          {task.user?.username}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {currState === "user" && (
          <div className="">
            <h1 className="px-5 text-2xl font-extrabold">
              All Users ({users.length})
            </h1>
            <div className="bg-white rounded-lg shadow overflow-scroll no-scroll mt-4">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((userItem) => (
                      <tr key={userItem._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {userItem.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {userItem.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={userItem.role}
                            onChange={(e) =>
                              updateUserRole(userItem._id, e.target.value)
                            }
                            className="border rounded p-1 text-sm"
                          >
                            <option value="user">User</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() =>
                              updateUserRole(userItem._id, userItem.role)
                            }
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                          >
                            Update Role
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {currState === "task" && (
          <div>
            <h1 className="px-5 text-2xl font-extrabold">
              All Tasks ({tasks.length})
            </h1>
            <div className="bg-white rounded-lg shadow overflow-scroll mt-4 no-scroll">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Task
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tasks.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No tasks found
                      </td>
                    </tr>
                  ) : (
                    tasks.map((task) => (
                      <tr key={task._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {task.task}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {task.user?.username || "Unknown"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              task.completed
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {task.completed ? "Completed" : "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(task.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {currState === "setting" && (
          <div className="flex flex-col gap-4 items-center justify-center mt-10 ">
            <h1 className="font-bold text-2xl">Profile</h1>
            <input
              type="file"
              className="w-20 h-20 border-3 border-gray-500 rounded-full bg-gray-400/70 flex items-center justify-center"
            />
            <form>
              <div className="flex flex-col gap-6">
                <input
                  className="border border-gray-500 text-gray-500 outline-none w-100 py-1 pl-5 rounded-lg placeholder:text-gray-400"
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="Enter Your Name"
                />
                <input
                  className="border border-gray-500 text-gray-500 outline-none w-100 py-1 pl-5 rounded-lg placeholder:text-gray-400"
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="Enter Your Email"
                />
                <input
                  className="border border-gray-500 text-gray-500 outline-none w-100 py-1 pl-5 rounded-lg placeholder:text-gray-400"
                  type="password"
                  placeholder="Enter Your Password"
                />
              </div>
              <button className="w-full bg-blue-500 hover:bg-white text-white hover:text-blue-500 mt-4 py-1 rounded-lg cursor-pointer border border-blue-500">
                Update
              </button>
              <button className="w-full hover:bg-blue-500 hover:text-white mt-4 py-1 rounded-lg cursor-pointer border border-blue-500">
                Cancel
              </button>
              <div className="mt-3 flex justify-between text-red-400">
                <h1 className="cursor-pointer hover:underline">
                  Delete Account
                </h1>
                <h1 className="cursor-pointer hover:underline">Sign out</h1>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserManagement;
