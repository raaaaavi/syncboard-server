import mongoose from "mongoose";

// Custom string _id (e.g. "u1") rather than an auto ObjectId, so the demo
// data stays human-readable across the API, Postman collection and report —
// and so ids are stable across reseeds during development.
const MemberSchema = new mongoose.Schema(
  {
    _id: { type: String },
    initials: { type: String, required: true },
    name: { type: String, required: true },
    color: { type: String, required: true },
    role: { type: String, required: true },
  },
  { _id: false, versionKey: false }
);

export default mongoose.model("Member", MemberSchema);
