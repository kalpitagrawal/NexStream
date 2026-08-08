import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { writeLimiter } from "../middlewares/rateLimiter.middleware.js"
import { validate } from "../middlewares/validate.middleware.js"
import { commentSchema } from "../validators/schemas.js"

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/:videoId").get(getVideoComments).post(writeLimiter, validate(commentSchema), addComment);
router.route("/c/:commentId").delete(deleteComment).patch(validate(commentSchema), updateComment);

export default router