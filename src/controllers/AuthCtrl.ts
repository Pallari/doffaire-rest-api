import { DBConnect } from "../db/db";
import { apiErrorHandler } from "../handlers/errorHandler";
import { Groomer } from "../models/Groomers";

export default class Auth {
  database = new DBConnect();
  async registration(req, res) {
    try {
      // get the request body
      const data = req.body;

      // Find user is already exists or not
      const groomer = await Groomer.findOne({
        email: data.groomer_email,
      }).exec();

      // If user exist, send the response
      if (groomer)
        return res.json({ success: false, message: "User Already registered" });

      const groomerData = new Groomer({
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
        message: "Error while saving groomer's Data",
      });
    } catch (error) {
      apiErrorHandler(error, req, res, "Registration failed.");
    }
  }

  async verification(req, res) {
    try {
    } catch (error) {
      apiErrorHandler(error, req, res, "Verification failed.");
    }
  }
}
