import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { authorizedRole } from '../middlewares/roleMiddleware.js';
const router = express.Router();

//only Admin can access this router
router.get("/admin",verifyToken, authorizedRole("admin"), (req,res)=>{
    res.json([
        {
            message: "Welcome Admin"
        }
    ])
});

//both admin and manager can access this router
router.get("/manager",verifyToken,authorizedRole("admin", "manager"), (req,res)=>{
    res.json({message:"Welcome Manager"})

});

//All can access this
router.get("/user",verifyToken, authorizedRole("admin", "manager", "user") ,(req,res)=>{
    res.json({message:"Welcome User"})
})
export default router;