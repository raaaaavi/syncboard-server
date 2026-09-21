import Board from "../models/Board.js";
import Column from "../models/Column.js";
import Task from "../models/Task.js";
import { toDTO, toDTOList } from "../utils/dto.js";
import { customAlphabet } from "../utils/id.js";

const nextId = customAlphabet();

const DEFAULT_COLUMNS = [
  { key: "todo", title: "To Do", order: 0, accent: "#666A79" },
  { key: "doing", title: "Doing", order: 1, accent: "#DB8A0C" },
  { key: "done", title: "Done", order: 2, accent: "#0E9C8E" },
];

export async function listBoards(req, res, next) {
  try {
    const boards = await Board.find().populate("memberIds").lean();
    const withCounts = await Promise.all(
      boards.map(async (b) => {
        const taskCount = await Task.countDocuments({ boardId: b._id });
        const doneCount = await Task.countDocuments({ boardId: b._id, columnId: `${b._id}-done` });
        return {
          id: b._id,
          name: b.name,
          starred: !!b.starred,
          members: toDTOList(b.memberIds),
          taskCount,
          doneCount,
        };
      })
    );
    res.json(withCounts);
  } catch (err) {
    next(err);
  }
}

export async function getBoard(req, res, next) {
  try {
    const board = await Board.findById(req.params.id).populate("memberIds").lean();
    if (!board) return res.status(404).json({ error: "Board not found" });
    res.json({ id: board._id, name: board.name, starred: !!board.starred, members: toDTOList(board.memberIds) });
  } catch (err) {
    next(err);
  }
}

export async function getBoardColumns(req, res, next) {
  try {
    const board = await Board.findById(req.params.id).lean();
    if (!board) return res.status(404).json({ error: "Board not found" });

    const columns = await Column.find({ boardId: board._id }).sort("order").lean();
    const result = await Promise.all(
      columns.map(async (col) => {
        const tasks = await Task.find({ boardId: board._id, columnId: col._id })
          .populate("assigneeId")
          .lean();
        return {
          id: col._id,
          title: col.title,
          accent: col.accent,
          tasks: tasks.map((tsk) => ({
            id: tsk._id,
            boardId: tsk.boardId,
            columnId: tsk.columnId,
            title: tsk.title,
            tag: tsk.tag,
            due: tsk.due,
            comments: tsk.comments,
            assignee: toDTO(tsk.assigneeId),
          })),
        };
      })
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function createBoard(req, res, next) {
  try {
    const { name, memberIds } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "name is required" });
    }
    const id = `b-${nextId()}`;
    const board = await Board.create({
      _id: id,
      name: name.trim(),
      memberIds: Array.isArray(memberIds) ? memberIds : [],
      starred: false,
    });
    // Every board gets a standard To Do / Doing / Done pipeline so it's
    // immediately usable — matching the columns the seeded boards have.
    await Column.insertMany(
      DEFAULT_COLUMNS.map((c) => ({ _id: `${id}-${c.key}`, boardId: id, title: c.title, order: c.order, accent: c.accent }))
    );
    res.status(201).json({ id: board._id, name: board.name, starred: false, members: [] });
  } catch (err) {
    next(err);
  }
}

export async function toggleStar(req, res, next) {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ error: "Board not found" });
    board.starred = !board.starred;
    await board.save();
    res.json({ id: board._id, starred: board.starred });
  } catch (err) {
    next(err);
  }
}
