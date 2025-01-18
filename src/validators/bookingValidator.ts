import Joi from "joi";

export const listing  = {
  body: Joi.object().keys({
    business_category: Joi.string().required().valid('groomer', 'veteran'),
    page: Joi.number().required(),
    pageSize: Joi.number().required(),
    pageName: Joi.string().required().valid("ongoing" ,"upcoming", "past"),
    searchString: Joi.string(),
    sortBy: Joi.string()
  })
};