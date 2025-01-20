import Joi from 'joi';

export const updateDetail = {
    body: Joi.object().keys({
        id: Joi.string().required(),
        veterinary_showcase: Joi.object().keys({
            veterinary_cover_photo: Joi.string(),
            veterinary_gallery: Joi.array(),
        }),
        veterinary_clinic_location: Joi.object().keys({
            veterinary_apartment_or_building: Joi.string(),
            veterinary_longitude: Joi.number(),
            veterinary_latitude: Joi.number(),
            veterinary_landmark: Joi.string(),
            veterinary_area_street_road: Joi.string()
        }),
        veterinary_add_doctor: Joi.array().items(Joi.object().keys({
            add_doctor_clinic_name: Joi.string(),
            add_doctor_email: Joi.string(),
            add_doctor_phone_number: Joi.string(),
            add_doctor_alternate_phone_number: Joi.string(),
            add_doctor_doctor_experienc_in: Joi.string(),
            add_doctor_doctor_experienc: Joi.string(),
            add_doctor_consultancy_fees: Joi.string(),
            add_doctor_doctor_about: Joi.string(),
            add_doctor_send_image: Joi.string(),
            doctor_id: Joi.string(),
        })),
        veterinary_upload_documents: Joi.array().items(Joi.object().keys({
            veterinary_document_file_name: Joi.string(),
            veterinary_document_type: Joi.string(),
            veterinary_document_id: Joi.string()
        })),
        veterinary_set_availabilty: Joi.array().items(Joi.object().keys({
            day: Joi.string(),
            start_time: Joi.string(),
            end_time: Joi.string()
        })),
        veterinary_bank_info: Joi.object().keys({
            veterinary_bank_name: Joi.string(),
            veterinary_bank_account_holder: Joi.string(),
            veterinary_bank_account_number: Joi.string(),
            reenter_veterinary_bank_account_number: Joi.string(),
            veterinary_bank_ifsc_code: Joi.string(),
            veterinary_account_holder_phone: Joi.string(),
        })
    })
};



const updateDoctor = {
    params: Joi.object().keys({
      id: Joi.string().required()
    }),
    body: Joi.object()
      .keys({
        add_doctor_clinic_name: Joi.string(),
        add_doctor_email: Joi.string(),
        add_doctor_phone_number: Joi.string(),
        add_doctor_alternate_phone_number: Joi.string(),
        add_doctor_doctor_experienc_in: Joi.string(),
        add_doctor_doctor_experienc: Joi.string(),
        add_doctor_doctor_about: Joi.string(),
        add_doctor_send_image: Joi.string(),
        doctor_id: Joi.string(),
        _id: Joi.string()
      })
      .min(1),
  };
  
  export const deleteDoctor  = {
    params: Joi.object().keys({
      id: Joi.string().required(),
      doctorId: Joi.string().required(),
    }),
  };