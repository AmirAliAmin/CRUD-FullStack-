import userModel from "../models/userModel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register = async(req,res)=>{
    try {
        const {username, password, email} = req.body;
        
        // Check if user already exists
        const user = await userModel.findOne({email});
        if (user) {
            return res.status(409).json({success:false, message:"User already exists"})
        }
        
        // Set default role to "user"
        const role = "user";
        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new userModel({username, email, password:hashedPassword, role});
        await newUser.save();

        res.status(201).json({
            success:true, 
            message:"Registered successfully",
            user: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role 
            }
        })
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({success:false, message:"Internal server error"})
    }
};

export const login = async(req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await userModel.findOne({email});
        if (!user) {
            return res.status(401).json({success:false, message:"Invalid email or password"})
        }
        const isPassword = await bcrypt.compare(password,user.password);
        if (!isPassword) {
            return res.status(401).json({success:false, message:"Invalid email or password"})
        }
        const token = jwt.sign({
            _id:user._id,
            email:user.email, 
            role:user.role
        },process.env.JWT_SECRET,{expiresIn:'24h'});
        
        res.status(200).json({
            success:true, 
            message:"Login successful",
            token,
            _id: user._id,
            email: user.email,
            name: user.username,
            role: user.role 
        })  
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({success:false, message:"Internal server error"})
    }
}