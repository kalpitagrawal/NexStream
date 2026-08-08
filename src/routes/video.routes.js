import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
} from "../controllers/video.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import { writeLimiter } from "../middlewares/rateLimiter.middleware.js"
import { validate } from "../middlewares/validate.middleware.js"
import { publishVideoSchema, updateVideoSchema } from "../validators/schemas.js"

const router = Router();
router.use(verifyJWT);

/**
 * @swagger
 * /videos:
 *   get:
 *     summary: Get all videos (paginated, searchable, sortable)
 *     tags: [Videos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: query
 *         schema: { type: string }
 *         description: Search by title or description
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, default: createdAt }
 *       - in: query
 *         name: sortType
 *         schema: { type: string, enum: [asc, desc], default: desc }
 *       - in: query
 *         name: userId
 *         schema: { type: string }
 *         description: Filter by owner
 *     responses:
 *       200:
 *         description: Paginated list of videos
 *   post:
 *     summary: Publish a new video
 *     tags: [Videos]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, description, videoFile, thumbnail]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               videoFile: { type: string, format: binary }
 *               thumbnail: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Video published successfully
 */
router
    .route("/")
    .get(getAllVideos)
    .post(
        writeLimiter,
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },

        ]),
        validate(publishVideoSchema),
        publishAVideo
    );

/**
 * @swagger
 * /videos/{videoId}:
 *   get:
 *     summary: Get video by ID (increments views, adds to watch history)
 *     tags: [Videos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Video details with like count
 *       404:
 *         description: Video not found
 *   patch:
 *     summary: Update video title, description, or thumbnail
 *     tags: [Videos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               thumbnail: { type: string, format: binary }
 *     responses:
 *       200:
 *         description: Video updated
 *       403:
 *         description: Not authorized
 *   delete:
 *     summary: Delete a video (also removes from Cloudinary)
 *     tags: [Videos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Video deleted
 *       403:
 *         description: Not authorized
 */
router
    .route("/:videoId")
    .get(getVideoById)
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), validate(updateVideoSchema), updateVideo);

/**
 * @swagger
 * /videos/toggle/publish/{videoId}:
 *   patch:
 *     summary: Toggle video publish status
 *     tags: [Videos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Publish status toggled
 */
router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router