import React, { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { FaUsers } from "react-icons/fa";
import { GrTasks } from "react-icons/gr";
import { IoMdSettings } from "react-icons/io";
import { RiLogoutCircleLine } from "react-icons/ri";
import { RiDashboardFill } from "react-icons/ri";
import { PiUsersThreeFill } from "react-icons/pi";
import { FaTasks } from "react-icons/fa";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [currState, setCurrState] = useState("dashboard");
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user?.role === "admin") {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:7001/api/users/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  return (
    <div className="w-full flex justify-between">
      {/* {
                users.map((item,index)=>(
                    <h1 key={index}>{item.message}</h1>

                ))
            } */}
      <div className="relative sm:block hidden bg-blue-500  w-[20%] h-screen py-4 text-white">
        <h1 className="text-lg font-extrabold px-3">Admin Dashboard</h1>
        <ul className="py-5 flex flex-col gap-3">
          <li
            className={`hover:bg-white flex items-center gap-2 rounded-lg py-2 px-2 mx-2 hover:text-blue-500 cursor-pointer ${
              currState === "dashboard" ? "bg-white text-blue-500" : ""
            }`}
            onClick={() => setCurrState("dashboard")}
          >
            <RiDashboardFill /> Dashboard
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
            <GrTasks /> All Task
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
          className="hover:bg-white hover:text-blue-500 mx-5 absolute py-2 px-15 bottom-0 cursor-pointer border-t flex justify-center items-center gap-2"
          onClick={logout}
        >
          <RiLogoutCircleLine /> Logout{" "}
        </button>
      </div>
      <div className=" md:w-[80%] text-blue-500 p-5 ">
        {currState === "dashboard" && (
          <div className="p-0 sm:px-6 w-full flex flex-col items-center">
            <div className="flex flex-wrap gap-10">
              <div className="bg-blue-500 text-white p-5 flex gap-8 items-center rounded-lg">
                <div>
                  <h1 className="font-bold">Total Users</h1>
                  <p>10</p>
                </div>
                <PiUsersThreeFill className="text-4xl" />
              </div>
              <div className="bg-blue-500 text-white p-5 flex gap-8 items-center rounded-lg">
                <div>
                  <h1 className="font-bold">Total Tasks</h1>
                  <p>10</p>
                </div>
                <GrTasks className="text-4xl" />
              </div>
              <div className="bg-blue-500 text-white p-5 flex gap-8 items-center rounded-lg">
                <div>
                  <h1 className="font-bold">Completed Task</h1>
                  <p>10</p>
                </div>
                <FaTasks className="text-4xl" />
              </div>
            </div>
            <div className="flex mt-10 justify-between gap-10 items-center">
              <div className="w-90 bg-blue-500 text-white p-5 rounded-lg">
                <div className="flex justify-between items-center">
                  <h1>Recent users</h1>
                  <button className="bg-white hover:bg-indigo-100 text-blue-500 py-1 px-2 rounded-lg cursor-pointer">
                    See all
                  </button>
                </div>
                <table className="w-full mt-5">
                  <thead>
                    <tr className="grid grid-cols-2 bg-blue-300 py-2 rounded-t-lg">
                      {/* <th className="font-light"></th> */}
                      <th className="">User Name</th>
                      <th className="">Email</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-3">
                    <tr className="grid grid-cols-2 border-b border-gray-400 py-2">
                      <td className="flex items-center justify-center">Ali</td>
                      <td className="flex items-center justify-center">ali@gmail.com</td>
                    </tr>
                    <tr className="grid grid-cols-2 border-b border-gray-400 py-2">
                      <td className="flex items-center justify-center">Ali</td>
                      <td className="flex items-center justify-center">ali@gmail.com</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="w-130 bg-blue-500 text-white p-5 rounded-lg">
                <div className="flex  justify-between items-center">
                  <h1>Total Tasks</h1>
                  <button className="bg-white text-blue-500 py-1 px-2 rounded-lg cursor-pointer hover:bg-indigo-100">
                    See all
                  </button>
                </div>
                <table className="w-full mt-5">
                  <thead>
                    <tr className="grid grid-cols-2 bg-blue-300 py-2 rounded-t-lg">
                      {/* <th className="font-light"></th> */}
                      <th className="">Task Content</th>
                      <th className="">Completed</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-3">
                    <tr className="grid grid-cols-2 border-b border-gray-400 py-2">
                      <td className="flex items-center justify-center">Learning React Today</td>
                      <td className="flex items-center justify-center">Yes</td>
                    </tr>
                    <tr className="grid grid-cols-2 border-b border-gray-400 py-2">
                      <td className="flex items-center justify-center">No today</td>
                      <td className="flex items-center justify-center">No</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {currState === "user" && (
          <div>
            <h1 className="px-5 text-2xl font-extrabold">All Users</h1>
            <div className=" text-blue-500 rounded-lg shadow overflow-hidden">
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
                            className="border rounded p-1"
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
        )}
        {currState === "task" && (
          <div>
            <h1>Task</h1>
          </div>
        )}
        {currState === "setting" && (
          <div className="flex flex-col gap-4 items-center justify-center mt-10">
            <h1 className="font-bold text-2xl">Profile</h1>
            <div className="w-20 h-20 border-3 border-blue-500 rounded-full bg-gray-400">
            </div>
            <form >
            <div className="flex flex-col gap-6">
                <input className="border border-black outline-none w-100 py-1 pl-5 rounded-lg" type="text" />
                <input className="border border-black outline-none w-100 py-1 pl-5 rounded-lg" type="email" />
                <input className="border border-black outline-none w-100 py-1 pl-5 rounded-lg" type="password" name="" id="" />
            </div>
            <button className="w-full bg-blue-500 hover:bg-white text-white hover:text-blue-500 mt-4 py-1 rounded-lg cursor-pointer border border-blue-500">Update</button>
            <button className="w-full hover:bg-blue-500 hover:text-white mt-4 py-1 rounded-lg cursor-pointer border border-blue-500">Cancel</button>
            <div className="mt-3 flex justify-between text-red-500">
                <h1 className="cursor-pointer">Delete Account</h1>
                <h1 className="cursor-pointer">Sign out</h1>
            </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserManagement;
