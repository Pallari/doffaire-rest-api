import Joi from 'joi';

export const register = {
  body: Joi.object().keys({
    business_category: Joi.string().required().valid('groomer', 'veteran'),
    groomer_email: Joi.string().email(),
    groomer_logo: Joi.string(),
    groomer_store_name: Joi.string(),
    groomer_phone: Joi.string(),
    groomer_alernative_phone: Joi.string(),
    groomer_bussiness_registration_id: Joi.string(),
    groomer_gst_number: Joi.string(),
    groomer_work_experience: Joi.string(),
    groomer_provider_service: Joi.array(),
    veterinary_clinic_name: Joi.string(),
    veterinary_email: Joi.string(),
    veterinary_logo: Joi.string(),
    veterinary_phone: Joi.string(),
    veterinary_alternative_phone: Joi.string(),
    veterinary_bussiness_registration_id: Joi.string(),
    veterinary_gst_number: Joi.string(),
    veterinary_emergency_phone_number: Joi.string(),
  })
};

export const verification = {
  body: Joi.object().keys({
    business_category: Joi.string().required().valid('groomer', 'veteran'),
    otp: Joi.string().required(),
    phone: Joi.string().required(),
  })
};

export const login = {
  body: Joi.object().keys({
    business_category: Joi.string().required().valid('groomer', 'veteran'),
    email: Joi.string().required(),
    password: Joi.string().required(),
  })
};

export const forgotPassword = {
  body: Joi.object().keys({
    business_category: Joi.string().required().valid('groomer', 'veteran'),
    email: Joi.string().required(),
  })
};
