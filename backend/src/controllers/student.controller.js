import * as s from "../services/student.service.js";
import { sendSuccess } from "../utils/response.js";

export const list = async (req, res) => sendSuccess(res, await s.listStudentsWithLatest(req.user.id));
export const getOne = async (req, res) => sendSuccess(res, await s.getStudent(req.user.id, req.params.id));
export const update = async (req, res) =>
  sendSuccess(res, await s.updateStudent(req.user.id, req.params.id, req.body));
export const remove = async (req, res) => {
  await s.deleteStudent(req.user.id, req.params.id);
  sendSuccess(res, { message: "Student deleted" });
};
export const summary = async (req, res) => sendSuccess(res, await s.dashboardSummary(req.user.id));