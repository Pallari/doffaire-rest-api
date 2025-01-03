import { Request, Response, NextFunction } from 'express';
import { apiErrorHandler } from '../../handlers/errorHandler';
import { DBConnect } from '../../db/db';

export default class GroomerCtrl {
    database = new DBConnect();
  constructor() { }

  async userRegistration(req: Request, res: Response, next: NextFunction) {
    // try {
    //   const lessons = await LessonRepo.getAllLessons({ order: ['id'] });
    //   res.json(lessons);
    // } catch (error) {
    //   apiErrorHandler(error, req, res, 'Fetch All Lessons failed.');
    // }
  }

}
