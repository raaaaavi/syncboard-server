import { Router } from "express";
import { listTasksForBoard, getTask, createTask, moveTask, deleteTask } from "../controllers/taskController.js";

const router = Router();

/**
 * @openapi
 * /api/tasks:
 *   get:
 *     summary: List tasks for a board
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: boardId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Array of tasks }
 *   post:
 *     summary: Create a task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [boardId, title]
 *             properties:
 *               boardId: { type: string }
 *               columnId: { type: string, example: todo }
 *               title: { type: string }
 *               tag: { type: string }
 *               assigneeId: { type: string }
 *               due: { type: string, example: "2026-09-01" }
 *     responses:
 *       201: { description: Created task }
 *       400: { description: Missing required fields }
 */
router.get("/", listTasksForBoard);
router.post("/", createTask);

/**
 * @openapi
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a single task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Task object }
 *       404: { description: Task not found }
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Deleted }
 *       404: { description: Task not found }
 */
router.get("/:id", getTask);
router.delete("/:id", deleteTask);

/**
 * @openapi
 * /api/tasks/{id}/move:
 *   patch:
 *     summary: Move a task to a different column
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [columnId]
 *             properties:
 *               columnId: { type: string, example: doing }
 *     responses:
 *       200: { description: Updated task }
 *       404: { description: Task not found }
 */
router.patch("/:id/move", moveTask);

export default router;
