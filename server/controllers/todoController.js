import todoModel from "../models/todoModel.js";

export const createTodo = async (req,res) => {
    try {
        const {task} = req.body
        const userId = req.user._id || req.user.id; 
        const newTask = new todoModel({task, user: userId});
        await newTask.save();

        res.status(201).json({success:true, message:"Task is Added", task: newTask })
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const getUserTodos = async (req,res) => {
    try {
        const userId = req.user.id;
        const tasks = await todoModel.find({user:userId}).sort({createdAt: -1});
        res.status(200).json({ 
            success: true, 
            tasks 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const updateTodo = async (req,res) => {
    try {
        const {id} = req.params;
        const {task,completed} = req.body;
        const userId = req.user.id;

        const updatedTask = await todoModel.findOneAndUpdate(
            {_id:id, user:userId},
            {task,completed},
            {new:true}
        );

        if (!updatedTask) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        res.status(200).json({ 
            success: true, 
            message: "Task updated successfully",
            task: updatedTask 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const deletedTask = await todoModel.findOneAndDelete({ _id: id, user: userId });

        if (!deletedTask) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        res.status(200).json({ 
            success: true, 
            message: "Task deleted successfully" 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};