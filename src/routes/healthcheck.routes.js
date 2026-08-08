import { Router } from 'express';
import { healthcheck } from "../controllers/healthcheck.controller.js"

const router = Router();

/**
 * @swagger
 * /healthcheck:
 *   get:
 *     summary: Check server health
 *     tags: [Healthcheck]
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.route('/').get(healthcheck);

export default router