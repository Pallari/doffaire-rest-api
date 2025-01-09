import Joi from 'joi';

export const updateDetail = {
  body: Joi.object().keys({
    id: Joi.string().required(),
    groomer_showcase: Joi.object().keys({
        groomer_cover_photo:Joi.string(),
        groomer_gallery: Joi.array(),
    }),
    groomer_clinic_location: Joi.object().keys({
        groomer_apartment_or_building: Joi.string(),
        groomer_longitude: Joi.number(),
        groomer_latitude: Joi.number(),
        groomer_landmark: Joi.string(),
        groomer_area_street_road: Joi.string()
    }),
    groomer_services: Joi.array(),
    groomer_upload_documents: Joi.array(),
    groomer_set_availabilty: Joi.array(),
    groomer_bank_info: Joi.object().keys({
        groomer_bank_name: Joi.string(),
        groomer_bank_account_holder: Joi.string(),
        groomer_bank_account_number: Joi.string(),
        reenter_groomer_bank_account_number: Joi.string(),
        groomer_bank_ifsc_code: Joi.string(),
        groomer_account_holder_phone: Joi.string(),
    })
  })
};