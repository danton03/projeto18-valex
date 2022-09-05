import joi from "joi";

const cardSchema: joi.ObjectSchema = joi.object({
  employeeId: joi.number().required(),
  type: joi.string().valid(
  'groceries', 
  'restaurant', 
  'transport', 
  'education', 
  'health'
  )
  .required()
})

const cardToActivateSchema: joi.ObjectSchema = joi.object({
  id: joi.number().required(),
  cvc: joi.string().pattern(/[0-9]{3}/).required(),
  password: joi.string().pattern(/[0-9]{4}/).required()
})

const cardIdSchema: joi.ObjectSchema = joi.object({
  id: joi.number().min(1).required()
})

const passwordSchema: joi.ObjectSchema = joi.object({
  password: joi.string().pattern(/[0-9]{4}/).required()
})

export { cardSchema, cardToActivateSchema, cardIdSchema, passwordSchema };