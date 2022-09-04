import { NextFunction, Request, Response } from "express";
import { apiKeySchema } from "../schemas/apiKeySchema";
import { cardSchema, cardToActivateSchema } from "../schemas/cardSchema";
import { validateSchema } from "./validateSchema";

function createCardValidations(req: Request, res: Response, next: NextFunction) {
  const apiKey: string | string[] | undefined = req.headers["x-api-key"];
  const cardData: object = req.body;
  validateSchema(apiKeySchema, apiKey);
  validateSchema(cardSchema, cardData);
  res.locals.apiKey = apiKey;
  next();
}

function activateCardValidations(req: Request, res: Response, next: NextFunction) {
  const cardData: object = req.body;
  validateSchema(cardToActivateSchema, cardData);
  next();
}

export { createCardValidations, activateCardValidations };