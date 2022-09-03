import joi from "joi";

export function validateSchema(schema: joi.Schema, data: any) {
  // console.log(data);
  const validation = schema.validate(data, {abortEarly: false});
  if (validation.error) {
    console.log(validation.error.message);
    throw { 
      code: 'IncompatibleFormat', 
      message: 'Os dados fornecidos não estão no formato esperado.' 
    }
  }
}