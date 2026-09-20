import { Router } from "express";
import { listBoards, getBoard, getBoardColumns, createBoard, toggleStar } from "../controllers/boardController.js";

const router = Router();

/**
 * @openapi
 * /api/boards:
 *   get:
 *     summary: List all boards
 *     tags: [Boards]
 *     responses:
 *       200:
 *         description: Array of boards with members and task counts
 *   post:
 *     summary: Create a board (seeded with default To Do / Doing / Done columns)
 *     tags: [Boards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               memberIds: { type: array, items: { type: string } }
 *     responses:
 *       201: { description: Created board }
 *       400: { description: Missing name }
 */
router.get("/", listBoards);
router.post("/", createBoard);

/**
 * @openapi
 * /api/boards/{id}:
 *   get:
 *     summary: Get a single board by id
 *     tags: [Boards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Board object }
 *       404: { description: Board not found }
 */
router.get("/:id", getBoard);

/**
 * @openapi
 * /api/boards/{id}/columns:
 *   get:
 *     summary: Get a board's columns, each populated with its tasks
 *     tags: [Boards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: "Array of columns [{ id, title, accent, tasks: [] }]" }
 *       404: { description: Board not found }
 */
router.get("/:id/columns", getBoardColumns);

/**
 * @openapi
 * /api/boards/{id}/star:
 *   patch:
 *     summary: Toggle a board's starred/favourite status
 *     tags: [Boards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: "{ id, starred }" }
 *       404: { description: Board not found }
 */
router.patch("/:id/star", toggleStar);

export default router;