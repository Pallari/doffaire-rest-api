import mongoose from "mongoose";

const VeteranSchema = new mongoose.Schema(
  {
    clinicName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    logo: { type: String },
    phone: { type: String, required: true },
    alternativePhone: { type: String },
    bussinessRegistrationId: { type: String },
    gstNumber: { type: String },
    emergencyPhoneNumber: { type: String },
    smsSecretKey: { type: String },
    isVerification: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const Veteran = mongoose.model("veteran", VeteranSchema); //Interaction with DB
