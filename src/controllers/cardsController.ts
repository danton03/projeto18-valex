import { Request, Response } from "express";
import { storeCard } from "../services/createCardServices";

export async function createCard(req: Request, res: Response) {
  const { apiKey } = res.locals;
  const {type, employeeId} = req.body; //type = tipo de cartão
  const cardData = {
    apiKey,
    employeeId, 
    type
  }
  await storeCard(cardData);
  return res.status(201).send('Cartão criado!');
}