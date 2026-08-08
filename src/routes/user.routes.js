import { Router } from "express";
import {
    loginUser,
    logoutUser,
    registerUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rateLimiter.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema, changePasswordSchema, updateAccountSchema } from "../validators/schemas.js";

const router = Router()

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [fullname, email, username, password, avatar]
 *             properties:
 *               fullname: { type: string, example: "John Doe" }
 *               email: { type: string, format: email, example: "john@example.com" }
 *               username: { type: string, example: "johndoe" }
 *               password: { type: string, format: password, example: "Password1" }
 *               avatar: { type: string, format: binary }
 *               coverImage: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: User already exists
 */
router.route("/register").post(
    authLimiter,
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    validate(registerSchema),
    registerUser)

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string, example: "john@example.com" }
 *               username: { type: string, example: "johndoe" }
 *               password: { type: string, example: "Password1" }
 *     responses:
 *       200:
 *         description: User logged in successfully (sets httpOnly cookies)
 *       400:
 *         description: Username or email required
 *       401:
 *         description: Invalid credentials
 */
router.route("/login").post(authLimiter, validate(loginSchema), loginUser)

//secured routes

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *       - CookieAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.route("/logout").post(verifyJWT, logoutUser);

/**
 * @swagger
 * /users/refresh-token:
 *   post:
 *     summary: Refresh access token using refresh token
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Access token refreshed
 *       401:
 *         description: Invalid or expired refresh token
 */
router.route("/refresh-token").post(refreshAccessToken);

/**
 * @swagger
 * /users/change-password:
 *   post:
 *     summary: Change current password
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oldPassword, newPassword]
 *             properties:
 *               oldPassword: { type: string }
 *               newPassword: { type: string, minLength: 8 }
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid old password
 */
router.route("/change-password").post(verifyJWT, validate(changePasswordSchema), changeCurrentPassword);

/**
 * @swagger
 * /users/current-user:
 *   get:
 *     summary: Get current logged-in user profile
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Current user fetched
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.route("/current-user").get(verifyJWT, getCurrentUser);

/**
 * @swagger
 * /users/update-account:
 *   patch:
 *     summary: Update account details (name, email)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname: { type: string, example: "Jane Doe" }
 *               email: { type: string, example: "jane@example.com" }
 *     responses:
 *       200:
 *         description: Account updated
 */
router.route("/update-account").patch(verifyJWT, validate(updateAccountSchema), updateAccountDetails);

/**
 * @swagger
 * /users/avatar:
 *   patch:
 *     summary: Update user avatar
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Avatar updated (old avatar deleted from Cloudinary)
 */
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

/**
 * @swagger
 * /users/cover-image:
 *   patch:
 *     summary: Update user cover image
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               coverImage: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Cover image updated
 */
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

/**
 * @swagger
 * /users/c/{username}:
 *   get:
 *     summary: Get user channel profile
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Channel profile with subscriber count
 *       404:
 *         description: Channel not found
 */
router.route("/c/:username").get(verifyJWT, getUserChannelProfile);

/**
 * @swagger
 * /users/watch-history:
 *   get:
 *     summary: Get user's watch history
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Watch history with video details and owner info
 */
router.route("/watch-history").get(verifyJWT, getWatchHistory);


export default router