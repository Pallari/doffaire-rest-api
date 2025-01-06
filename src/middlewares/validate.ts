import * as Joi from "joi";
import { apiErrorHandler } from "../handlers/errorHandler";
import { pick } from "../utils/pick";

export const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ["params", "query", "body"]);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: "key" }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details
      .map((details) => details.message)
      .join(", ");

    return res.json({ success: false, message: errorMessage });
  }
  Object.assign(req, value);
  return next();
};
