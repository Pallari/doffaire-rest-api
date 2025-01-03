import { Request, Response, NextFunction } from "express";
import { apiErrorHandler } from "../../handlers/errorHandler";
import { DBConnect } from "../../db/db";
import { GroomerInfomodel } from "../../models/groomer/GroomerInfo";

export default class GroomerCtrl {
  database = new DBConnect();
  constructor() {}

  async userRegistration(req: Request, res: Response, next: NextFunction) {
    try {
      const groomer = GroomerInfomodel.findOne();
      res.json({ data: groomer });
    } catch (error) {
      apiErrorHandler(error, req, res, "Fetch All Lessons failed.");
    }
  }
}
