import { NextFunction, Request, Response } from "express";
import { apiKeySchema } from "../schemas/apiKeySchema";
import { typeCardSchema } from "../schemas/typeCardSchema";
import { validateSchema } from "./validateSchema";

function createCardValidations(req: Request, res: Response, next: NextFunction) {
  const apiKey: string | string[] | undefined = req.headers["x-api-key"];
  const typeCard = req.body;
  validateSchema(apiKeySchema, apiKey);
  validateSchema(typeCardSchema, typeCard);
  next();
}

export { createCardValidations };