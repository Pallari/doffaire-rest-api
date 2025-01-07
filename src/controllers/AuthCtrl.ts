import { apiErrorHandler } from "../handlers/errorHandler";
import { Groomer } from "../models/Groomers";
import { Veteran } from "../models/Veteran";
export default class Auth {
  constructor() {}

  async registration(req, res) {
    try {
      // get the request body
      const data = req.body;
      if (data.business_category === "groomer") {
        // Find groomer is already exists or not
        const groomer = await Groomer.findOne({
          email: data.groomer_email,
        }).exec();

        // If groomer exist, send the response
        if (groomer)
          return res.json({
            success: false,
            message: "Groomer Already registered",
          });

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

        if (groomersData)
          return res.json({ success: true, data: groomersData });

        return res.json({
          success: false,
          message: "Error while saving groomer's Data",
        });
      }

      if (data.business_category === "veteran") {
        // Find veteran is already exists or not
        const veteran = await Veteran.findOne({
          email: data.veterinary_email,
        }).exec();

        // If veteran exist, send the response
        if (veteran)
          return res.json({
            success: false,
            message: "Veteran Already registered",
          });

        const veteranData = new Veteran({
          clinicName: data.veterinary_clinic_name,
          email: data.veterinary_email,
          logo: data.veterinary_logo,
          phone: data.veterinary_phone,
          alternativePhone: data.veterinary_alternative_phone,
          bussinessRegistrationId: data.veterinary_bussiness_registration_id,
          gstNumber: data.veterinary_gst_number,
          emergencyPhoneNumber: data.veterinary_emergency_phone_number,
        });

        // Insert data to db
        const veteransData = await veteranData.save();

        if (veteransData)
          return res.json({ success: true, data: veteransData });

        return res.json({
          success: false,
          message: "Error while saving veteran's Data",
        });
      }
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
