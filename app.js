import express from "express";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import adminRoute from "./routes/admin.route.js";
import errorMiddleware from "./middleware/error.middlware.js";
import studentRouter from "./routes/student.route.js";
import courseRouter from "./routes/course.route.js";
import upload from "./middleware/multer.middleware.js";
import productRoute from "./routes/product.route.js";

dotenv.config();

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // Logging requests to the console

// CORS configuration
const allowedOrigins = [
  "https://website3999.online",
  "http://localhost:5173",
  "https://lmspankaj.netlify.app/",
  "http://localhost:5174",
  "https://skillpathsalallms.netlify.app", // Add the new origin
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        // Allow requests with no origin (like mobile apps or curl requests)
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
    credentials: true, // Allow credentials if needed
  })
);

// Routes
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/student", studentRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/product", productRoute);

// Error handling middleware
app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to LMS Api, Serving is running",
  });
});

// Catch-all route for undefined endpoints
app.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    status: 404,
    message: "Oops! Not Found",
  });
});

// Create HTTP server and Socket.io server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins, // Use the same allowedOrigins array
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Uncomment and use the socket.io connection code as needed
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("establish_connection", async ({ sender, recipient }) => {
    try {
      socket.join(sender);
      socket.join(recipient);
      console.log("Users are connected");

      socket.emit("connection_established", {
        success: true,
        message: `Connected to ${recipient}`,
      });

      console.log("users connected bruh");

      const messages = await Message.find({
        $or: [
          { sender, recipient },
          { sender: recipient, recipient: sender },
        ],
      }).sort("timestamp");

      socket.emit("message_history", messages);
    } catch (error) {
      console.error("Error in establishing connection:", error);
      socket.emit("error", "Internal Server Error");
    }
  });

  socket.on(
    "send_message",
    async ({ sender, recipient, content, media, mediaType, time }) => {
      try {
        let imageUrl = null;

        if (media) {
          const result = await uploadToCloudinary(Buffer.from(media));
          imageUrl = result.secure_url;
        }

        const message = new Message({
          sender,
          recipient,
          content,
          images: imageUrl ? { secure_url: imageUrl } : undefined,
          time,
        });

        await message.save();

        console.log(message);

        io.to(sender).emit("receive_message", message);
        io.to(recipient).emit("receive_message", message);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  );

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

export { app, server, io };
