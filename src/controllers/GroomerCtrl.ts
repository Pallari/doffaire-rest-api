import { Request, Response, NextFunction } from 'express';
import { apiErrorHandler } from '../handlers/errorHandler';
import { Groomer } from '../models/Groomers';

export default class GroomerCtrl {
  constructor() {}

  async getGroomer(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({ success: true, data: 'success' });
    } catch (error) {
      apiErrorHandler(error, req, res, 'Fetch All Lessons failed.');
    }
  }
  async updateGroomer(req,res) {
    try {
      const data = req.body;
      const groomer = await  Groomer.findById(data.id).exec() 
      if (!groomer) return res.json({ success: false, message: `Groomer not found.` });
      
      const updatedUser = await Groomer.findByIdAndUpdate({ _id: data.id }, data ,{new : true});

      return res.json({ success: true, data: updatedUser });
      
    } catch (error) {
      apiErrorHandler(error, req, res, 'Update Detail Failed.');
      
    }
  }
}
