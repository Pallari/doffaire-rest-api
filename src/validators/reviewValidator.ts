import Joi from "joi";

export const reviewListingValidator = {
    body: Joi.object().keys({
        sortBy: Joi.string(),
        page: Joi.number().required(),
        pageSize: Joi.number().required(),
    })
}