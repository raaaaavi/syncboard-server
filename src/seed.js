import "dotenv/config";
import { connectDB } from "./config/db.js";
import mongoose from "mongoose";
import Member from "./models/Member.js";
import Board from "./models/Board.js";
import Column from "./models/Column.js";
import Task from "./models/Task.js";

const members = [
  { _id: "u1", initials: "AR", name: "Aashi R.", color: "#3E3AE8", role: "Front-End" },
  { _id: "u2", initials: "SK", name: "Sam K.", color: "#0E9C8E", role: "Back-End" },
  { _id: "u3", initials: "NF", name: "Nadia F.", color: "#DB8A0C", role: "Testing & DevOps" },
  { _id: "u4", initials: "TP", name: "Theo P.", color: "#DE5147", role: "Front-End" },
];

const boards = [
  { _id: "b1", name: "CollabBoard — Sprint 1", memberIds: ["u1", "u2", "u3"] },
  { _id: "b2", name: "Marketing Launch", memberIds: ["u2", "u4"] },
  { _id: "b3", name: "Design Backlog", memberIds: ["u1", "u3", "u4"] },
];

const columnTemplate = [
  { key: "todo", title: "To Do", order: 0, accent: "#666A79" },
  { key: "doing", title: "Doing", order: 1, accent: "#DB8A0C" },
  { key: "done", title: "Done", order: 2, accent: "#0E9C8E" },
];

const columns = boards.flatMap((b) =>
  columnTemplate.map((c) => ({ _id: `${b._id}-${c.key}`, boardId: b._id, title: c.title, order: c.order, accent: c.accent }))
);

const tasks = [
  { _id: "t1", boardId: "b1", columnId: "b1-todo", title: "Wireframe Board / Column / TaskCard components", tag: "Design", assigneeId: "u4", due: "2026-08-24", comments: 2 },
  { _id: "t2", boardId: "b1", columnId: "b1-todo", title: "Define REST API contract for tasks endpoint", tag: "Backend", assigneeId: "u2", due: "2026-08-26", comments: 0 },
  { _id: "t3", boardId: "b1", columnId: "b1-todo", title: "Set up Mongoose schemas: Board, Column, Task", tag: "Backend", assigneeId: "u2", due: "2026-08-27", comments: 1 },
  { _id: "t4", boardId: "b1", columnId: "b1-doing", title: "Build drag-and-drop between columns", tag: "Frontend", assigneeId: "u1", due: "2026-08-23", comments: 3 },
  { _id: "t5", boardId: "b1", columnId: "b1-doing", title: "JWT auth middleware + protected routes", tag: "Auth", assigneeId: "u3", due: "2026-08-23", comments: 1 },
  { _id: "t10", boardId: "b1", columnId: "b1-doing", title: "Wire Express REST API into React dashboard", tag: "Backend", assigneeId: "u2", due: "2026-08-30", comments: 0 },
  { _id: "t6", boardId: "b1", columnId: "b1-done", title: "Scaffold Vite + React project structure", tag: "Setup", assigneeId: "u4", due: "2026-08-20", comments: 0 },
  { _id: "t7", boardId: "b1", columnId: "b1-done", title: "Repo init + branch strategy agreed", tag: "Setup", assigneeId: "u3", due: "2026-08-19", comments: 0 },
  { _id: "t8", boardId: "b1", columnId: "b1-done", title: "Static Navbar + Sidebar layout", tag: "Frontend", assigneeId: "u1", due: "2026-08-21", comments: 2 },
  { _id: "t9", boardId: "b1", columnId: "b1-done", title: "Mock data module for boards/tasks", tag: "Frontend", assigneeId: "u4", due: "2026-08-21", comments: 0 },
  { _id: "t11", boardId: "b1", columnId: "b1-done", title: "Connect Express API to MongoDB Atlas", tag: "Backend", assigneeId: "u2", due: "2026-09-05", comments: 1 },
];

async function seed() {
  await connectDB();
  console.log("Clearing existing collections…");
  await Promise.all([Member.deleteMany({}), Board.deleteMany({}), Column.deleteMany({}), Task.deleteMany({})]);

  console.log("Inserting demo data…");
  await Member.insertMany(members);
  await Board.insertMany(boards);
  await Column.insertMany(columns);
  await Task.insertMany(tasks);

  console.log(`Seeded ${members.length} members, ${boards.length} boards, ${columns.length} columns, ${tasks.length} tasks.`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
