import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

// Load dotenv only in non-production environment
if (process.env.NODE_ENV !== "production") {
    import("dotenv").then(dotenv => {
        dotenv.config();
    });
}


const PORT = process.env.PORT || 8080;
const app = express();


// CORS configuration for production
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // In production, check against allowed origins
        if (process.env.NODE_ENV === 'production') {
            const allowedOrigins = process.env.FRONTEND_URL ? 
                process.env.FRONTEND_URL.split(',') : 
                [];
            
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            } else {
                return callback(new Error('Not allowed by CORS'));
            }
        } else {
            // In development, allow localhost
            return callback(null, true);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api", chatRoutes);

// Health check endpoint for Render
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development"
    });
});

// Root endpoint
app.get("/", (req, res) => {
    res.json({
        message: "Nexa AI Backend API",
        status: "running",
        endpoints: {
            health: "/health",
            auth: "/api/auth",
            chat: "/api"
        }
    });
});

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(" Connected to MongoDB successfully!");
    } catch(err) {
        console.error("Failed to connect to MongoDB:", err);
        process.exit(1);
    }
}
 
// Start server and connect to DB
const startServer = async () => {
    try {
        // Connect to database first
        await connectDB();
        
        // Start server after successful DB connection
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running successfully on port ${PORT}`);
            console.log(` Server accessible at http://0.0.0.0:${PORT}`);
            console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error(" Failed to start server:", error);
        process.exit(1);
    }
}

// Start the application
startServer();
