import Member from "../models/Member.js";
import { toDTOList } from "../utils/dto.js";

export async function listTeam(req, res, next) {
  try {
    const members = await Member.find().lean();
    res.json(toDTOList(members));
  } catch (err) {
    next(err);
  }
}
