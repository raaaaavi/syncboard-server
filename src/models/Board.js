import mongoose from "mongoose";

const BoardSchema = new mongoose.Schema(
  {
    _id: { type: String },
    name: { type: String, required: true },
    memberIds: [{ type: String, ref: "Member" }],
    starred: { type: Boolean, default: false },
  },
  { _id: false, versionKey: false, timestamps: true }
);

export default mongoose.model("Board", BoardSchema);
