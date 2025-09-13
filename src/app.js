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

// Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://fronten-of-shr.vercel.app",
  "https://fronten-of-shr-makwana-prakashs-projects.vercel.app",
  "https://fronten-of-shr-git-main-makwana-prakashs-projects.vercel.app",
  "https://fronten-of-cr9yflpea-makwana-prakashs-projects.vercel.app"
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin like Postman
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error("CORS not allowed for this origin"), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/menus", menuRoutes);
app.use("/api/v1/orders", orderRoutes);

export default app;
