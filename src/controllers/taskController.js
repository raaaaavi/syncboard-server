import { customAlphabet } from "../utils/id.js";
import Task from "../models/Task.js";
import Column from "../models/Column.js";
import Board from "../models/Board.js";
import { toDTO } from "../utils/dto.js";

const nextId = customAlphabet();

function taskDTO(doc) {
  const t = doc.toObject ? doc.toObject() : doc;
  return {
    id: t._id,
    boardId: t.boardId,
    columnId: t.columnId,
    title: t.title,
    tag: t.tag,
    due: t.due,
    comments: t.comments,
    assignee: toDTO(t.assigneeId),
  };
}

export async function listTasksForBoard(req, res, next) {
  try {
    const { boardId } = req.query;
    if (!boardId) return res.status(400).json({ error: "boardId query parameter is required" });
    const tasks = await Task.find({ boardId }).populate("assigneeId").lean();
    res.json(tasks.map(taskDTO));
  } catch (err) {
    next(err);
  }
}

export async function getTask(req, res, next) {
  try {
    const task = await Task.findById(req.params.id).populate("assigneeId");
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(taskDTO(task));
  } catch (err) {
    next(err);
  }
}

export async function createTask(req, res, next) {
  try {
    const { boardId, columnId, title, tag, assigneeId, due } = req.body;
    if (!boardId || !title) {
      return res.status(400).json({ error: "boardId and title are required" });
    }
    const board = await Board.findById(boardId);
    if (!board) return res.status(400).json({ error: `No board with id "${boardId}"` });

    const resolvedColumnId = columnId || `${boardId}-todo`;
    const column = await Column.findById(resolvedColumnId);
    if (!column) return res.status(400).json({ error: `No column with id "${resolvedColumnId}"` });

    const task = await Task.create({
      _id: `t-${nextId()}`,
      boardId,
      columnId: resolvedColumnId,
      title,
      tag: tag || "General",
      assigneeId: assigneeId || null,
      due: due || null,
      comments: 0,
    });
    const populated = await task.populate("assigneeId");
    res.status(201).json(taskDTO(populated));
  } catch (err) {
    next(err);
  }
}

export async function moveTask(req, res, next) {
  try {
    const { columnId } = req.body;
    if (!columnId) return res.status(400).json({ error: "columnId is required" });

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    const column = await Column.findOne({ _id: columnId, boardId: task.boardId });
    if (!column) return res.status(400).json({ error: `Column "${columnId}" does not belong to this task's board` });

    task.columnId = columnId;
    await task.save();
    const populated = await task.populate("assigneeId");
    res.json(taskDTO(populated));
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req, res, next) {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Task not found" });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
