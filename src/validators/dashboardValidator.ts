import Joi from "joi";

export const todaysListingValidator = {
    body: Joi.object().keys({
        business_category: Joi.string().required().valid('groomer', 'veteran'),
        page: Joi.number().required(),
        pageSize: Joi.number().required(),
        searchString: Joi.string().allow('').optional(),
        sortBy: Joi.string()
    })
}