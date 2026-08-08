import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import helmet from "helmet"
import swaggerUi from "swagger-ui-express"
import { swaggerSpec } from "./utils/swagger.js"

const app = express();

// Security headers — configured for Cloudinary media URLs + Swagger UI
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "https://res.cloudinary.com", "data:"],
            mediaSrc: ["'self'", "https://res.cloudinary.com"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
        }
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// NOTE: Rate limiting is applied per-route (see middlewares/rateLimiter.middleware.js)
// This avoids double-counting requests against both global and route-level limits.

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.static("public"));
app.use(cookieParser());


// routes import 

import healthcheckRouter from "./routes/healthcheck.routes.js"
import userRouter from "./routes/user.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import likeRouter from "./routes/like.routes.js"
import commentRouter from "./routes/comment.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import videoRouter from "./routes/video.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"

// routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)

// Swagger API documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "NexStream API Documentation"
}))

// proper error response
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message,
        errors: err.errors
    });
});
export { app };