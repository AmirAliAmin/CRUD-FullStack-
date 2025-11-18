import React, { useState } from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [currState, setCurrState] = useState("Login");
    const [showPass, setShowPass] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { login, register } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            let result;
            if (currState === "Login") {
                result = await login(formData.email, formData.password);
            } else {
                // Register with default "user" role - no role selection by user
                result = await register(formData.username, formData.email, formData.password);
                
                // After successful registration, auto-login
                if (result.success) {
                    result = await login(formData.email, formData.password);
                }
            }
            
            console.log("Form submission result:", result);
            
            if (result.success) {
                const userRole = result.data.user?.role;
                console.log("Login successful, user role:", userRole);
                
                // Redirect based on role
                switch (userRole) {
                    case "admin":
                        navigate("/admin");
                        break;
                    case "manager":
                        navigate("/manager");
                        break;
                    default: // user role goes here
                        navigate("/");
                        break;
                }
            } else {
                setError(result.error || "Authentication failed");
            }
        } catch (error) {
            console.error("Form submission error:", error);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-blue-500 text-white w-full max-w-md px-5 py-8 rounded-lg shadow-lg">
                <h1 className="text-2xl text-center font-bold mb-6">
                    {currState === "Login" ? "Login" : "Sign Up"}
                </h1>
                
                {error && (
                    <div className="bg-red-500 text-white p-3 rounded mb-4 text-center">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    {currState === "Signup" && (
                        <div className="flex flex-col space-y-1 py-2">
                            <label htmlFor="username">Name</label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="border border-white rounded py-2 px-3 outline-0 text-white"
                                required
                                placeholder="Enter Your Name"
                            />
                        </div>
                    )}
                    
                    <div className="flex flex-col space-y-1 py-2">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border border-white rounded py-2 px-3 outline-0 text-white"
                            required
                            placeholder="Enter Your Email"
                        />
                    </div>
                    
                    <div className="flex flex-col space-y-1 py-2 relative">
                        <label htmlFor="password">Password</label>
                        <input
                            type={showPass ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="border border-white rounded py-2 px-3 outline-0 text-white pr-10"
                            required
                            placeholder="Enter Your Password"
                            minLength="6"
                        />
                        <div
                            className="absolute right-3 top-12 cursor-pointer text-black"
                            onClick={() => setShowPass(!showPass)}
                        >
                            {showPass ? <FaRegEye /> : <FaRegEyeSlash />}
                        </div>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full text-blue-500 bg-white py-2 rounded-md cursor-pointer hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed font-semibold mt-4"
                    >
                        {loading ? "Processing..." : (currState === "Login" ? "Login" : "Sign Up")}
                    </button>
                </form>
                
                {currState === "Login" ? (
                    <p className="mt-4 mb-3 text-center">
                        You don't have an account?{" "}
                        <span
                            className="hover:text-blue-700 cursor-pointer font-semibold"
                            onClick={() => setCurrState("Signup")}
                        >
                            Sign Up
                        </span>
                    </p>
                ) : (
                    <p className="mt-4 mb-3 text-center">
                        You already have an account?{" "}
                        <span
                            className="hover:text-blue-700 cursor-pointer font-semibold"
                            onClick={() => setCurrState("Login")}
                        >
                            Login
                        </span>
                    </p>
                )}
            </div>
        </div>
    );
}