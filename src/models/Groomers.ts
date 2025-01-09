import mongoose from 'mongoose';

const GroomerSchema = new mongoose.Schema(
  {
    storeName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    logo: { type: String },
    phone: { type: String, required: true },
    alternativePhone: { type: String },
    bussinessRegistrationId: { type: String },
    gstNumber: { type: String },
    workExperience: { type: String },
    provideService: [
      { is_home_service: { type: Boolean, default: false } },
      { is_center_service: { type: Boolean, default: false } },
    ],
    smsSecretKey: { type: String },
    isVerification: { type: Boolean, default: false },
    sessionToken: { type: String },
    groomer_showcase: {
      groomer_cover_photo: {type: String},
      groomer_gallery: [
        {sending_image_url: {type: String}}
      ]
    },
    groomer_clinic_location: {
      groomer_apartment_or_building: {type:String},
      groomer_longitude: {type:String},
      groomer_latitude: {type:String},
      groomer_landmark: {type:String},
      groomer_area_street_road: {type:String}
  },
  groomer_services: [
    {
      groomer_service_image: {type:String},
      groomer_service_description: {type:String},
      groomer_service_size: {type:String},
      groomer_service_name: {type:String},
      groomer_service_price: {type:String},
      groomer_service_duration: {type:String},
      service_id: {type:String}
    }
  ],
  groomer_upload_documents: [
    {
      groomer_document_file_name: {type:String},
      groomer_document_type: {type:String},
      groomer_document_id: {type:String},
    }
  ],
  groomer_set_availabilty: [
    {
      day: {type:String},
      start_time: {type:String},
      end_time: {type:String},
    }
  ],
  groomer_bank_info:{
    groomer_bank_name: {type:String},
    groomer_bank_account_holder: {type:String},
    groomer_bank_account_number: {type:String},
    reenter_groomer_bank_account_number: {type:String},
    groomer_bank_ifsc_code: {type:String},
    groomer_account_holder_phone: {type:String},
  },
  groomer_is_want_sync: {type:String}
},
  {
    timestamps: true,
  }
);

export const Groomer = mongoose.model('groomers', GroomerSchema); //Interaction with DB
