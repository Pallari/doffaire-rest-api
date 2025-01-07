import axios from "axios";

import { apiErrorHandler } from "../handlers/errorHandler";
import { Groomer } from "../models/Groomers";
import { Veteran } from "../models/Veteran";
import {
  authentication,
  comparePassword,
  random,
} from "../utils/authentication";
export default class Auth {
  constructor() {}

  // TODO: Code for password is pending , Set Axios api and endpoint to util
  async registration(req, res) {
    try {
      // get the request body
      const data = req.body;
      const salt = random();
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

        axios
          .get(
            `https://doffair-python-apis.azurewebsites.net/otp/sms/generate-otp?mobile_number=${data.groomer_phone}`
          )
          .then((response) => {
            // console.log(`----response----`, response);
            const secretKey = response.data.secret_key;
            const groomerData = new Groomer({
              storeName: data.groomer_store_name,
              email: data.groomer_email,
              logo: data.groomer_logo,
              phone: data.groomer_phone,
              password: authentication(salt, "abcd@123"),
              alternativePhone: data.groomer_alernative_phone,
              bussinessRegistrationId: data.groomer_bussiness_registration_id,
              gstNumber: data.groomer_gst_number,
              workExperience: data.groomer_work_experience,
              provideService: data.groomer_provider_service,
              smsSecretKey: secretKey,
            });

            // Insert data to db
            const groomersData = groomerData.save();
            if (groomersData)
              return res.json({ success: true, data: groomersData });

            return res.json({
              success: false,
              message: "Error while saving groomer's Data",
            });
          })
          .catch((error) => {
            apiErrorHandler(error, req, res, "Sending Sms failed.");
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
          password: authentication(salt, "abcd@123"),
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
      // get the request body
      const data = req.body;

      if (data.business_category === "groomer") {
        // Find groomer is already exists or not
        const groomer = await Groomer.findOne({
          phone: data.phone,
        }).exec();

        if (!groomer)
          return res.json({
            success: false,
            message: "Groomer Not Found",
          });

        axios
          .get(
            `https://doffair-python-apis.azurewebsites.net/otp/sms/validate-otp/${data.otp}?mobile_number=${data.phone}&secret_key=${groomer.smsSecretKey}`
          )
          .then((response) => {
            if (response.data.is_valid) {
              Groomer.updateOne(
                { _id: groomer._id },
                { $set: { isVerification: true } }
              );
              return res.json({
                success: true,
                message: "Verification Success",
              });
            }
            return res.json({
              success: false,
              message: "Verification Failed",
            });
          })
          .catch((error) => {
            apiErrorHandler(error, req, res, "Verification failed.");
          });
      }
      if (data.business_category === "veteran") {
        // Find groomer is already exists or not
        const veteran = await Veteran.findOne({
          phone: data.phone,
        }).exec();

        if (!veteran)
          return res.json({
            success: false,
            message: "Veteran Not Found",
          });

        axios
          .get(
            `https://doffair-python-apis.azurewebsites.net/otp/sms/validate-otp/${data.otp}?mobile_number=${data.phone}&secret_key=${veteran.smsSecretKey}`
          )
          .then((response) => {
            if (response.data.is_valid) {
              Veteran.updateOne(
                { _id: veteran._id },
                { $set: { isVerification: true } }
              );
              return res.json({
                success: true,
                message: "Verification Success",
              });
            }
            return res.json({
              success: false,
              message: "Verification Failed",
            });
          })
          .catch((error) => {
            apiErrorHandler(error, req, res, "Verification failed.");
          });
      }
    } catch (error) {
      apiErrorHandler(error, req, res, "Verification failed.");
    }
  }

  async login(req, res) {
    try {
      const data = req.body;

      if (data.business_category === "groomer") {
        const groomer = await Groomer.findOne({
          email: data.groomer_email,
        }).exec();

        if (!groomer)
          return res.json({
            success: false,
            message: "Groomer Not Found",
          });

        // FIX ME
        const isMatch = await comparePassword(data.password, groomer.password);
        if (isMatch)
          return res.json({ success: true, message: "Login Successfully" });
      }
      if (data.business_category === "veteran") {
        const veteran = await Veteran.findOne({
          email: data.groomer_email,
        }).exec();

        if (!veteran)
          return res.json({
            success: false,
            message: "Veteran Not Found",
          });

        // FIX ME
        const isMatch = await comparePassword(data.password, veteran.password);
        if (isMatch)
          return res.json({ success: true, message: "Login Successfully" });
      }
    } catch (error) {
      apiErrorHandler(error, req, res, "Login failed.");
    }
  }
}
