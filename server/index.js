import express from 'express';
import dotenv from 'dotenv';
import { db } from './config/db.js';
import cors from 'cors'
import userRouter  from './routes/authRoute.js';
import router from './routes/userRoute.js';
import todoRouter from './routes/todoRoute.js';
import adminRouter from './routes/adminRoute.js';

dotenv.config();

const app = express();

//Middlewares
app.use(express.json());
app.use(cors());

//Routes
app.get("/test", (req,res)=>{
    res.send("Hello , Hello mic testingggg")
})
app.use("/api/auth" , userRouter);
app.use("/api/users", router);
app.use("/api/todos", todoRouter);
app.use("/api/admin", adminRouter); 


//Start server
const PORT = process.env.PORT || 7001;
const dbConnect = await db();
app.listen(PORT,()=>{console.log(`Server is rinning at http://localhost:${PORT}`)})