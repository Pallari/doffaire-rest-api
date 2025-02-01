import Joi from "joi";

export const reviewListingValidator = {
    body: Joi.object().keys({
        business_category: Joi.string().required().valid('groomer', 'veteran'),
        page: Joi.number().required(),
        pageSize: Joi.number().required(),
    })
}