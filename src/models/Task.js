import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    _id: { type: String },
    boardId: { type: String, ref: "Board", required: true },
    columnId: { type: String, ref: "Column", required: true },
    title: { type: String, required: true },
    tag: { type: String, default: "General" },
    assigneeId: { type: String, ref: "Member", default: null },
    due: { type: String, default: null },
    comments: { type: Number, default: 0 },
  },
  { _id: false, versionKey: false, timestamps: true }
);

TaskSchema.index({ boardId: 1, columnId: 1 });

export default mongoose.model("Task", TaskSchema);
