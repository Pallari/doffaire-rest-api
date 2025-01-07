import { Request, Response, NextFunction } from "express";
import { apiErrorHandler } from "../handlers/errorHandler";

export default class GroomerCtrl {
  constructor() {}

  async getGroomer(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({ success: true, data: "success" });
    } catch (error) {
      apiErrorHandler(error, req, res, "Fetch All Lessons failed.");
    }
  }
}
