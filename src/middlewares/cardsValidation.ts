import { NextFunction, Request, Response } from "express";
import { apiKeySchema } from "../schemas/apiKeySchema";
import { amountSchema, cardIdSchema, cardSchema, cardToActivateSchema, passwordSchema, paymentSchema } from "../schemas/cardSchema";
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

function cardIdValidation(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  validateSchema(cardIdSchema, { id });
  next();
}

function passwordFormatValidation(req: Request, res: Response, next: NextFunction) {
  const password = req.body;
  validateSchema(passwordSchema, password);
  next();
}

function amountValidation(req: Request, res: Response, next: NextFunction) {
  const amount = req.body;
  validateSchema(amountSchema, amount);
  next();
}

function paymentValidation(req: Request, res: Response, next: NextFunction) {
  const paymentData = req.body;
  validateSchema(paymentSchema, paymentData);
  next();
}

export { 
  createCardValidations, activateCardValidations, cardIdValidation, 
  passwordFormatValidation, amountValidation, paymentValidation 
};