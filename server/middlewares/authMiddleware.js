import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const verifyToken = (req,res,next)=>{
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({message: "No Token,authorization denied"})
            
        }
        try {
            const decode = jwt.verify(token,process.env.JWT_SECRET);
           req.user = {
                id: decode._id,
                email: decode.email,
                role: decode.role
            };
            console.log("The Decoded user is :" , req.user);
            next();
        } catch (error) {
            res.status(400).json({ message:"Token is not valid"})
        }
    }else{
         return res.status(401).json({message: "No Token,authorization denied"})
    }
}