import { Request, Response, NextFunction } from 'express';
import { apiErrorHandler } from '../handlers/errorHandler';
import { Veteran } from '../models/Veteran';
export default class VeteranCtrl {
  constructor() { }

  async getVeteran(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({ success: true, data: 'success' });
    } catch (error) {
      apiErrorHandler(error, req, res, 'Fetch All groomer failed.');
    }
  }

  async updateVeteran(req, res) {
    try {
      const data = req.body;

      const veteran = await Veteran.findById(data.id).exec();

      if (!veteran) return res.json({ success: false, message: `Veteran not found.` });

      const updatedUser = await Veteran.findByIdAndUpdate({ _id: data.id }, data, { new: true });

      return res.json({ success: true, data: updatedUser });

    } catch (error) {
      apiErrorHandler(error, req, res, 'Update Detail Failed.');
    }
  }

  async deleteVeteranInfo(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({ success: true, data: 'success' });
    } catch (error) {
      apiErrorHandler(error, req, res, 'Fetch All groomer failed.');
    }
  }
}
