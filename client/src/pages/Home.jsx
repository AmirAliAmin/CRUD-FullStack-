// components/Home.js
import React, { useState, useEffect } from "react";
import { TiTick } from "react-icons/ti";
import { MdEditDocument } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from 'react-router-dom'
import { useAuth } from "../context/useAuth";

export default function Home() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [currState, setCurrState] = useState("task");
  const [editTask, setEditTask] = useState(null);
  const [currentEditedItem, setCurrentEditedItem] = useState({});

  const navigate = useNavigate()
  const { logout, user } = useAuth();

  // Fetch tasks from API
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:7001/api/todos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.success) {
        setTasks(result.tasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAdd = async () => {
    if (!task.trim()) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:7001/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ task })
      });
      
      const result = await response.json();
      if (result.success) {
        setTask("");
        fetchTasks(); // Refresh the task list
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleCompleted = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:7001/api/todos/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completed: true })
      });
      
      const result = await response.json();
      if (result.success) {
        fetchTasks(); // Refresh the task list
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:7001/api/todos/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      if (result.success) {
        fetchTasks(); // Refresh the task list
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEditTodo = (index, item) => {
    setEditTask(item._id); 
    setCurrentEditedItem({ ...item });
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:7001/api/todos/${currentEditedItem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          task: currentEditedItem.task,
          completed: currentEditedItem.completed 
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setEditTask(null);
        setCurrentEditedItem({});
        fetchTasks(); // Refresh the task list
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditTask(null);
    setCurrentEditedItem({});
  };

  const incompleteTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className=" h-screen w-full flex flex-col items-center text-white">
      <div className="pt-4 w-full px-5 md:px-10 lg:px-20 flex justify-between items-center">
        <h1 className="text-blue-500">Welcome,{user?.username} </h1>
        <button 
          className="bg-blue-500 px-5 py-2 rounded-lg cursor-pointer hover:bg-blue-400" 
          onClick={logout}
        >
          LogOut
        </button>
      </div>
      
      <div className="pt-10">
        <div className="">
          <input
            type="text"
            placeholder="Add Task"
            className="border border-blue-500 w-60 sm:w-100 py-2 outline-none pl-4 rounded-l  text-black"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button
            className="bg-blue-500 hover:bg-blue-400 py-2 border border-blue-500 px-4 cursor-pointer rounded-r"
            onClick={handleAdd}
          >
            Add
          </button>
        </div>
        
        <div className="mt-4 space-y-5">
          <ul className="flex gap-8 border-b border-gray-500 pb-2">
            <li
              className={`cursor-pointer text-black ${
                currState === "task" ? "text-blue-500" : "hover:text-blue-500"
              }`}
              onClick={() => setCurrState("task")}
            >
              Task ({incompleteTasks.length})
            </li>
            <li
              className={`cursor-pointer text-black ${
                currState === "completed" ? "text-blue-500" : "hover:text-blue-500"
              }`}
              onClick={() => setCurrState("completed")}
            >
              Completed ({completedTasks.length})
            </li>
          </ul>
          
          {currState === "task" && (
            <div>
              {incompleteTasks.map((item, index) => {
                if (editTask === item._id) {
                  return (
                    <div key={item._id} className="flex justify-between px-2 mb-2 py-3 bg-gray-950 overflow-hidden items-center rounded-lg">
                      <input
                        className="w-full text-white bg-gray-900 border border-blue-500 py-2 focus:outline-none px-2 rounded"
                        value={currentEditedItem.task || ""}
                        type="text"
                        onChange={(e) =>
                          setCurrentEditedItem({
                            ...currentEditedItem,
                            task: e.target.value,
                          })
                        }
                      />
                      <div className="flex gap-2 ml-2">
                        <button
                          className="font-semibold hover:bg-blue-600 bg-blue-500 cursor-pointer text-white py-1 border border-blue-400 px-4 rounded"
                          onClick={handleSaveEdit}
                        >
                          Save
                        </button>
                        <button
                          className="font-semibold hover:bg-gray-600 bg-gray-500 cursor-pointer text-white py-1 border border-gray-400 px-4 rounded"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={item._id}
                      className="flex justify-between px-2 mb-2 py-3 bg-blue-500 overflow-hidden items-center rounded-lg"
                    >
                      <h1 className="text-xl w-50 sm:w-60 overflow-scroll no-scroll">
                        {item.task}
                      </h1>
                      <div className="flex gap-2">
                        <p
                          className="text-2xl cursor-pointer hover:text-green-300"
                          onClick={() => handleCompleted(item._id)}
                        >
                          <TiTick />
                        </p>
                        <p 
                          className="text-2xl cursor-pointer hover:text-blue-950"
                          onClick={() => handleEditTodo(index, item)}
                        >
                          <MdEditDocument />
                        </p>
                        <p
                          className="text-2xl cursor-pointer hover:text-red-600"
                          onClick={() => handleDelete(item._id)}
                        >
                          <RiDeleteBin6Line />
                        </p>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          )}
          
          {currState === "completed" && (
            <div>
              {completedTasks.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between px-2 mb-2 py-3 bg-blue-500  items-center rounded-lg overflow-hidden"
                >
                  <h1 className="text-xl line-through text-white w-50 sm:w-60 overflow-scroll no-scroll">
                    {item.task}
                  </h1>
                  <p
                    className="text-2xl cursor-pointer hover:text-red-600"
                    onClick={() => handleDelete(item._id)}
                  >
                    <RiDeleteBin6Line />
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}