import React, { useState } from "react";
import { TiTick } from "react-icons/ti";
import { MdEditDocument } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import {useNavigate} from 'react-router-dom'
import { useAuth } from "../context/useAuth";

export default function Home() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [currState, setCurrState] = useState("task");
  const [editTask, setEditTask] = useState(null);
  const [currentEditedItem, setCurrentEditedItem] = useState({});

  const navigate = useNavigate()
  const {logout} = useAuth();

  const handleAdd = () => {
    if (!task.trim()) return;
    let newtask = {
      id: Date.now(), // Add unique ID for better management
      text: task,
      icon1: <TiTick />,
      icon2: <MdEditDocument />,
      icon3: <RiDeleteBin6Line />,
      completed: false,
    };
    setTasks([...tasks, newtask]);
    setTask("");
  };

  const handleComplteted = (index) => {
    const incompleteTasks = tasks.filter((task) => !task.completed);
    const taskToComplete = incompleteTasks[index];
    const actualIndex = tasks.findIndex((task) => task === taskToComplete);

    let updatedTasks = [...tasks];
    updatedTasks[actualIndex] = {
      ...updatedTasks[actualIndex],
      completed: true,
    };
    setTasks(updatedTasks);
  };

  const handleDelete = (index) => {
    const incompleteTasks = tasks.filter((task) => !task.completed);
    const taskToDelete = incompleteTasks[index];
    const actualIndex = tasks.findIndex((task) => task === taskToDelete);

    let deleteTask = [...tasks];
    deleteTask.splice(actualIndex, 1);
    setTasks(deleteTask);
  };

  const handleEditTodo = (index, item) => {
    setEditTask(index);
    setCurrentEditedItem({ ...item }); // Create a copy of the item
  };

  const handleSaveEdit = (index) => {
    // Get the actual task from incompleteTasks
    const incompleteTasks = tasks.filter((task) => !task.completed);
    const taskToEdit = incompleteTasks[index];
    const actualIndex = tasks.findIndex((task) => task === taskToEdit);

    let updatedTodos = [...tasks];
    updatedTodos[actualIndex] = {
      ...updatedTodos[actualIndex],
      text: currentEditedItem.text, // Use 'text' not 'task'
    };

    setTasks(updatedTodos);
    setEditTask(null);
    setCurrentEditedItem({});
  };

  const handleCancelEdit = () => {
    setEditTask(null);
    setCurrentEditedItem({});
  };

  const incompleteTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="bg-black h-screen w-full flex flex-col items-center  text-white">
        <div className="pt-4 w-full px-5 md:px-10 lg:px-20 flex justify-end ">
        <button className="bg-green-400 px-5 py-2 rounded-lg cursor-pointer hover:bg-green-500" onClick={logout}>LogOut</button>
        </div>
      <div className="pt-10">
        <div className="">
          <input
            type="text"
            placeholder="Add Task "
            className="border border-green-400 w-60 sm:w-100 py-2 outline-none pl-4 rounded-l"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <button
            className="bg-green-400 hover:bg-green-500 py-2 border border-green-400 px-4 cursor-pointer rounded-r"
            onClick={handleAdd}
          >
            Add
          </button>
        </div>
        <div className="mt-4 space-y-5">
          <ul className="flex gap-8 border-b border-gray-500 pb-2 ">
            <li
              className={`cursor-pointer hover:text-green-500 ${
                currState === "task" ? "text-green-400 hover:text-green-500" : "hover:text-green-400"
              }`}
              onClick={() => setCurrState("task")}
            >
              Task
            </li>
            <li
              className={`cursor-pointer  ${
                currState === "completed" ? "text-green-400 hover:text-green-500" : "hover:text-green-400"
              }`}
              onClick={() => setCurrState("completed")}
            >
              Completed
            </li>
          </ul>
          {currState === "task" && (
            <div>
              {incompleteTasks.map((item, index) => {
                if (editTask === index) {
                  return (
                    <div key={index} className="flex justify-between px-2 mb-2 py-3 bg-gray-950 overflow-hidden items-center rounded-lg">
                      <input
                        className="w-full text-white bg-gray-900 border border-green-400 py-2 focus:outline-none px-2 rounded"
                        title="Please enter your Title"
                        required
                        value={currentEditedItem.text || ""} // Use 'text' here
                        type="text"
                        onChange={(e) =>
                          setCurrentEditedItem({
                            ...currentEditedItem,
                            text: e.target.value, // Use 'text' here
                          })
                        }
                      />
                      <div className="flex gap-2 ml-2">
                        <button
                          className="font-semibold hover:bg-green-500 bg-green-400 cursor-pointer text-white py-1 border border-green-400 px-4 rounded"
                          onClick={() => handleSaveEdit(index)} // Pass index
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
                      key={index}
                      className="flex justify-between px-2 mb-2 py-3 bg-gray-950 overflow-hidden items-center rounded-lg"
                    >
                      <h1 className="text-xl w-50 sm:w-60 overflow-scroll no-scroll">
                        {item.text}
                      </h1>
                      <div className="flex gap-2">
                        <p
                          className="text-2xl cursor-pointer hover:text-green-400"
                          onClick={() => handleComplteted(index)}
                        >
                          {item.icon1}
                        </p>
                        <p 
                          className="text-2xl cursor-pointer hover:text-blue-400"
                          onClick={() => handleEditTodo(index, item)}
                        >
                          {item.icon2}
                        </p>
                        <p
                          className="text-2xl cursor-pointer hover:text-red-600"
                          onClick={() => handleDelete(index)}
                        >
                          {item.icon3}
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
              {completedTasks.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between px-2 mb-2 py-3 bg-gray-950 items-center rounded-lg overflow-hidden"
                >
                  <h1 className="text-xl line-through text-green-400 w-50 sm:w-60 overflow-scroll no-scroll">
                    {item.text}
                  </h1>
                  <p
                    className="text-2xl cursor-pointer hover:text-red-600"
                    onClick={() => handleDelete(index)}
                  >
                    {item.icon3}
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