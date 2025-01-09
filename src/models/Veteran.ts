import mongoose from 'mongoose';

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
    sessionToken: { type: String },
    otp: {type: String},
    veterinary_center_info : {
     veterinary_logo: { type: String },
     veterinary_clinic_name: { type: String },
     veterinary_email: { type: String },
     veterinary_phone: { type: String },
     veterinary_alernative_phone: { type: String },
     veterinary_bussiness_registration_id: { type: String },
     veterinary_gst_number: { type: String },
     veterinary_emergency_phone_number:  { type: String },
    },
    veterinary_showcase: {
      veterinary_cover_photo:  { type: String },
      veterinary_gallery: {
        sending_image_url: { type: String },
      }
    },
    veterinary_clinic_location: {
      veterinary_apartment_or_building: { type: String },
      veterinary_area_street_road: { type: String },
      veterinary_longitude: { type: String },
      veterinary_latitude: { type: String },
      veterinary_landmark:  { type: String },
    },
    veterinary_add_doctor: {
        add_doctor_clinic_name:  { type: String },
        add_doctor_email: { type: String },
        add_doctor_phone_number:  { type: String },
        add_doctor_alternate_phone_number:  { type: String },
        add_doctor_doctor_experienc_in:  { type: String },
        add_doctor_doctor_experienc: { type: String },
        add_doctor_doctor_about: { type: String },
        add_doctor_send_image:  { type: String },
        doctor_id:  { type: String },
    },
    veterinary_upload_documents:[
      {
        veterinary_document_file_name:  { type: String },
        veterinary_document_type:  { type: String },
        veterinary_document_id:  { type: String },
    }
    ],
    veterinary_set_availabilty: [
      {
        day: {type:String},
        start_time: {type:String},
        end_time: {type:String},
      }
    ],
    veterinary_bank_info: {
      veterinary_bank_name:  { type: String },
      veterinary_bank_account_holder:  { type: String },
      veterinary_bank_account_number:  { type: String },
      reenter_veterinary_bank_account_number:  { type: String },
      veterinary_bank_ifsc_code:  { type: String },
      veterinary_account_holder_phone:  { type: String },
  },
  veterinary_is_want_sync:  { type: String },
  },
  {
    timestamps: true,
  }
);

export const Veteran = mongoose.model('veteran', VeteranSchema); //Interaction with DB
