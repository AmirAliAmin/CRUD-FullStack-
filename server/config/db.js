import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const mobgo_url = process.env.MONGOOSE_URL;

export const db = async () => {
    try {
        await mongoose.connect(mobgo_url);
        console.log("Database Connected successfully")
    } catch (error) {
        console.log("Mongoose connection error", error);
        return false;
    }
}