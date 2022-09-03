import joi from "joi";

const apiKeySchema: joi.StringSchema = joi.string().trim().required();

export { apiKeySchema };