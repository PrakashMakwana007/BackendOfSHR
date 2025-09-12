import express from "express";
import { 
    createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
} from "../controller/menu.controler.js";
import { protect } from "../middlewares/auth.middlewere.js";
import upload from "../middlewares/uload.js";
const router = express.Router();

// Public
router.get("/", getAllMenuItems);
router.get("/:id", getMenuItemById);

// Admin Only (protect first)
router.post("/", protect, upload.single("image"), createMenuItem);
router.put("/:id", protect,upload.single("image"), updateMenuItem);
router.delete("/:id", protect, deleteMenuItem);
 
export default router;
