import joi from "joi";

const typeCardSchema: joi.ObjectSchema = joi.object({
  type: joi.string().valid(
  'groceries', 
  'restaurant', 
  'transport', 
  'education', 
  'health'
  )
  .required()
})

export { typeCardSchema };