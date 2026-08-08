import rateLimit from "express-rate-limit";

// Strict limiter for authentication routes (login, register)
// Prevents brute-force attacks
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many login/register attempts, please try again later."
    }
});

// Moderate limiter for write operations (create, update, delete)
// Prevents spam and abuse
const writeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests, please try again later."
    }
});

export { authLimiter, writeLimiter };
