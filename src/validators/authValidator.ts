import * as Joi from "joi";

export const register = {
  body: Joi.object().keys({
    business_category: Joi.string().valid("groomer", "veteran"),
    groomer_email: Joi.string().required().email(),
    groomer_logo: Joi.string().required(),
    groomer_store_name: Joi.string().required(),
    groomer_phone: Joi.string().required(),
    groomer_alernative_phone: Joi.string().required(),
    groomer_bussiness_registration_id: Joi.string().required(),
    groomer_gst_number: Joi.string().required(),
    groomer_work_experience: Joi.string().required(),
    groomer_provider_service: Joi.array().required(),
  }),
};
