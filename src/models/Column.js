import mongoose from "mongoose";

const ColumnSchema = new mongoose.Schema(
  {
    _id: { type: String },
    boardId: { type: String, ref: "Board", required: true },
    title: { type: String, required: true },
    order: { type: Number, required: true },
    accent: { type: String, default: "#666A79" },
  },
  { _id: false, versionKey: false }
);

ColumnSchema.index({ boardId: 1, order: 1 });

export default mongoose.model("Column", ColumnSchema);
