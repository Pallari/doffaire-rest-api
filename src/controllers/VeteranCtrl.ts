import { Request, Response, NextFunction } from "express";
import { apiErrorHandler } from "../handlers/errorHandler";
import { Veteran } from "../models/Veteran";

export default class VeteranCtrl {
  constructor() {}

  async updateVeteran(req: Request, res: Response, _next: NextFunction) {
    try {
      // get the request body
      const data = req.body;

      // Find user is already exists or not
      const veteran = await Veteran.findOne({
        email: data.veteran_email,
      }).exec();

      // If user exist, send the response
      if (veteran)
        return res.json({ success: false, message: "User Already registered" });

      const groomerData = new Veteran({
        storeName: data.groomer_store_name,
        email: data.groomer_email,
        logo: data.groomer_logo,
        phone: data.groomer_phone,
        alternativePhone: data.groomer_alernative_phone,
        bussinessRegistrationId: data.groomer_bussiness_registration_id,
        gstNumber: data.groomer_gst_number,
        workExperience: data.groomer_work_experience,
        provideService: data.groomer_provider_service,
      });

      // Insert data to db
      const groomersData = await groomerData.save();

      if (groomersData) return res.json({ success: true, data: groomersData });

      return res.json({
        success: false,
        message: 'Error while saving groomer"s Data',
      });
    } catch (error) {
      apiErrorHandler(error, req, res, "Registration failed.");
    }
  }

  async getVeteran(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({ success: true, data: "success" });
    } catch (error) {
      apiErrorHandler(error, req, res, "Fetch All groomer failed.");
    }
  }

  async deleteVeteranInfo(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({ success: true, data: "success" });
    } catch (error) {
      apiErrorHandler(error, req, res, "Fetch All groomer failed.");
    }
  }
}
