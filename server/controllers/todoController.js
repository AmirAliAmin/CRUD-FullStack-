import todoModel from "../models/todoModel.js";

export const todo = async (req,res) => {
    try {
        const {task} = req.body
        const newTask = new todoModel({task});
        await newTask.save();

        res.status(201).json({success:true, message:"Task is Added"})
    } catch (error) {
        res.status(500).json({success:false, message:"Internal server error"})
    }
}