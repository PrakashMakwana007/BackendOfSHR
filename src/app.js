import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Import Routes
import userRoutes from "./routes/user.routes.js";
import menuRoutes from "./routes/menu.routes.js";
import orderRoutes from "./routes/order.routes.js";
import path from "path";
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://fronten-of-shr.vercel.app"  
  ], // exact frontend URL
  credentials: true, // allow cookies to be sent
}));

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/menus", menuRoutes);
app.use("/api/v1/orders", orderRoutes);

export default app;
