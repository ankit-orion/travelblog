import express from "express";
import cors from "cors";
import userRouter from "./routes/user.routes.js";

const app = express();

// Enable CORS with the provided origin and credentials
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

// Parse JSON requests with a limit of 50mb
app.use(express.json({ limit: "50mb" }));

// Parse URL-encoded requests with extended mode and a limit of 50mb
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Serve static files from the "public" directory
app.use(express.static("public"));


// Mount the userRouter middleware at the "/api/v1/users" path
app.use("/api/v1/users", userRouter);

export { app };
