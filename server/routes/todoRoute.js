// routes/todoRoute.js
import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { createTodo, getUserTodos, updateTodo, deleteTodo } from '../controllers/todoController.js';

const router = express.Router();

// All routes are protected and user-specific
router.post("/", verifyToken, createTodo);
router.get("/", verifyToken, getUserTodos);
router.put("/:id", verifyToken, updateTodo);
router.delete("/:id", verifyToken, deleteTodo);

export default router;