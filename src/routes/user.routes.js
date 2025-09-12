import express from "express";
import { 
    register, 
    login, 
    logout, 
    refreshAccesstoken, 
    getCurrentUser ,
    createAdmin
} from "../controller/user.contoller.js";
import { protect } from "../middlewares/auth.middlewere.js";
import { isAdmin } from "../middlewares/admin.middlewere.js";

const router = express.Router();

// Public Routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshAccesstoken);
router.post("/create-admin", protect, isAdmin, createAdmin);
// Protected Routes
router.post("/logout", protect, logout);
router.get("/me", protect, getCurrentUser);

export default router;
