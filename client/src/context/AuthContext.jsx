import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        console.log("AuthContext useEffect - Token:", !!token, "UserData:", userData);

        if (token && userData) {
            try {
                const parsedUser = JSON.parse(userData);
                console.log("Parsed user data:", parsedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error("Error parsing user data:", error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            console.log("Login attempt for:", email);
            
            const response = await fetch('http://localhost:7001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log("Login response:", data);

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            if (!data.token) {
                throw new Error('No token received from server');
            }

            
            const userData = {
                _id: data._id || data.user?._id,
                email: data.email || data.user?.email,
                username: data.name || data.username || data.user?.username,
                role: data.role || data.user?.role || 'user' 
            };
            console.log("Setting user data:", userData);

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            return { 
                success: true, 
                data: { 
                    user: userData, 
                    token: data.token 
                } 
            };
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, error: error.message };
        }
    };

    const register = async (username, email, password) => {
        try {
            console.log("Registration attempt:", { username, email });
            
            const response = await fetch("http://localhost:7001/api/auth/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password })
                
            });

            const data = await response.json();
            console.log("Registration response:", data);
            
            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            return { success: true, data };

        } catch (error) {
            console.error("Registration error:", error);
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        console.log("Logging out");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading
    };
    
    return (
        <AuthContext.Provider value={value}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;