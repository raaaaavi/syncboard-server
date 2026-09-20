import { Router } from "express";
import { listTeam } from "../controllers/teamController.js";

const router = Router();

/**
 * @openapi
 * /api/team:
 *   get:
 *     summary: List all team members
 *     tags: [Team]
 *     responses:
 *       200: { description: Array of team members }
 */
router.get("/", listTeam);

export default router;
