import express from "express";
import { 
    createOrder, 
    getUserOrders, 
    getAllOrders,
    getOrderById, 
    updateOrderStatus,
    deleteOrder
} from "../controller/order.controler.js";
import { protect } from "../middlewares/auth.middlewere.js";

const router = express.Router();

// Create order (User)
router.post("/", protect, createOrder);

// Get orders
router.get("/", protect, async (req, res, next) => {
    // Admin sees all orders
    if (req.user.role === "admin") {
        return getAllOrders(req, res, next);
    } 
    // Regular user sees only their orders
    return getUserOrders(req, res, next);
});

// Get single order by ID (User/Admin)
router.get("/:id", protect, getOrderById);

// Update order status (Admin only)
router.put("/:id", protect, updateOrderStatus);

// Delete order (Admin only)
router.delete("/:id", protect, deleteOrder);

export default router;
