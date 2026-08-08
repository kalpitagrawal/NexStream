import { Router } from 'express';
import {
    createTweet,
    deleteTweet,
    getUserTweets,
    updateTweet,
} from "../controllers/tweet.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { writeLimiter } from "../middlewares/rateLimiter.middleware.js"
import { validate } from "../middlewares/validate.middleware.js"
import { tweetSchema } from "../validators/schemas.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(writeLimiter, validate(tweetSchema), createTweet);
router.route("/user/:userId").get(getUserTweets);
router.route("/:tweetId").patch(validate(tweetSchema), updateTweet).delete(deleteTweet);

export default router