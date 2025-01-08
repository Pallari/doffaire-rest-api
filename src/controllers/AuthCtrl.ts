import axios from "axios";

import { apiErrorHandler } from "../handlers/errorHandler";
import { Groomer } from "../models/Groomers";
import { Veteran } from "../models/Veteran";
import { authentication, comparePassword } from "../utils/authentication";
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
        const password = await authentication("abcd@123");

        await axios
          .get(
            `https://doffair-python-apis.azurewebsites.net/otp/sms/generate-otp?mobile_number=${data.groomer_phone}`
          )
          .then(async (response) => {
            const smsSecretKey = response.data.secret_key;

            const groomerData = new Groomer({
              storeName: data.groomer_store_name,
              email: data.groomer_email,
              logo: data.groomer_logo,
              phone: data.groomer_phone,
              password: password,
              alternativePhone: data.groomer_alernative_phone,
              bussinessRegistrationId: data.groomer_bussiness_registration_id,
              gstNumber: data.groomer_gst_number,
              workExperience: data.groomer_work_experience,
              provideService: data.groomer_provider_service,
              smsSecretKey: smsSecretKey,
            });
            const groomersData = await groomerData.save();

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
        const password = await authentication("abcd@123");
        await axios
          .get(
            `https://doffair-python-apis.azurewebsites.net/otp/sms/generate-otp?mobile_number=${data.veterinary_phone}`
          )
          .then(async (response) => {
            const smsSecretKey = response.data.secret_key;

            const veteranData = new Veteran({
              clinicName: data.veterinary_clinic_name,
              email: data.veterinary_email,
              password: password,
              logo: data.veterinary_logo,
              phone: data.veterinary_phone,
              alternativePhone: data.veterinary_alternative_phone,
              bussinessRegistrationId:
                data.veterinary_bussiness_registration_id,
              gstNumber: data.veterinary_gst_number,
              emergencyPhoneNumber: data.veterinary_emergency_phone_number,
              smsSecretKey: smsSecretKey,
            });

            // Insert data to db
            const veteransData = await veteranData.save();

            if (veteransData)
              return res.json({ success: true, data: veteransData });

            return res.json({
              success: false,
              message: "Error while saving veteran's Data",
            });
          })
          .catch((error) => {
            apiErrorHandler(error, req, res, "Sending Sms failed.");
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

        await axios
          .get(
            `https://doffair-python-apis.azurewebsites.net/otp/sms/validate-otp/${data.otp}?mobile_number=${data.phone}&secret_key=${groomer.smsSecretKey}`
          )
          .then(async (response) => {
            if (response.data.is_valid) {
              await Groomer.updateOne(
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
            return res.json({
              success: false,
              message: "Verification Failed",
            });
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
        console.log(`---data--`, data);

        // FIX ME
        await axios
          .get(
            `https://doffair-python-apis.azurewebsites.net/otp/sms/validate-otp/${data.otp}?mobile_number=${data.phone}&secret_key=${veteran.smsSecretKey}`
          )
          .then(async (response) => {
            console.log(`---response--`, response);
            if (response.data.is_valid) {
              await Veteran.updateOne(
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
            console.log(`-inside--error--`, error);
            return res.json({
              success: false,
              message: "Verification Failed",
            });
          });
      }
    } catch (error) {
      console.log(`-outsode--error--`, error);
      apiErrorHandler(error, req, res, "Verification failed.");
    }
  }

  async login(req, res) {
    try {
      const data = req.body;

      if (data.business_category === "groomer") {
        const groomer = await Groomer.findOne({
          email: data.email,
        }).exec();

        if (!groomer)
          return res.json({
            success: false,
            message: "Groomer Not Found",
          });

        const isPasswordMatch = await comparePassword(
          data.password,
          groomer.password
        );

        if (!isPasswordMatch)
          return res.json({ success: false, message: "Incorrect Password" });

        const sessionToken = await authentication(groomer._id.toString());
        const updatedGroomer = await Groomer.findByIdAndUpdate(
          { _id: groomer._id },
          { $set: { sessionToken } }
        );

        return res.json({
          success: true,
          message: "Login Successfully",
          data: updatedGroomer,
        });
      }
      if (data.business_category === "veteran") {
        const veteran = await Veteran.findOne({
          email: data.email,
        }).exec();

        if (!veteran)
          return res.json({
            success: false,
            message: "Veteran Not Found",
          });

        const isPasswordMatch = await comparePassword(
          data.password,
          veteran.password
        );
        if (!isPasswordMatch)
          return res.json({ success: false, message: "Incorrect Password" });

        const sessionToken = await authentication(veteran._id.toString());
        const updatedVeteran = await Veteran.findByIdAndUpdate(
          { _id: veteran._id },
          { $set: { sessionToken } }
        );

        return res.json({
          success: true,
          message: "Login Successfully",
          data: updatedVeteran,
        });
      }
    } catch (error) {
      apiErrorHandler(error, req, res, "Login failed.");
    }
  }

  async forgotPassword(req, res) {
    try {
    } catch (error) {
      apiErrorHandler(error, req, res, "Forgot Password failed.");
    }
  }
}
