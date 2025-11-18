import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { authorizedRole } from '../middlewares/roleMiddleware.js';
import User from '../models/userModel.js';
import Todo from '../models/todoModel.js';

const router = express.Router();

// Get all users (admin only)
router.get("/users", verifyToken, authorizedRole("admin"), async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json({
            success: true,
            users
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Update user role
router.put("/users/:id/role", verifyToken, authorizedRole("admin"), async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const validRoles = ['user', 'manager', 'admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ success: false, message: "Invalid role" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            message: "User role updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Error updating user role:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Get all tasks (admin only)
router.get("/tasks", verifyToken, authorizedRole("admin"), async (req, res) => {
    try {
        const tasks = await Todo.find()
            .populate('user', 'username email')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            tasks
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Get dashboard statistics
router.get("/stats", verifyToken, authorizedRole("admin"), async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalTasks = await Todo.countDocuments();
        const completedTasks = await Todo.countDocuments({ completed: true });
        
        // Get recent users (last 5)
        const recentUsers = await User.find()
            .select('username email createdAt')
            .sort({ createdAt: -1 })
            .limit(5);

        // Get recent tasks (last 5)
        const recentTasks = await Todo.find()
            .populate('user', 'username')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalTasks,
                completedTasks
            },
            recentUsers,
            recentTasks
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

export default router;