import { Request, Response } from "express";
import { activateCardService, createCardService } from "../services/cardServices";

export async function createCard(req: Request, res: Response) {
  const { apiKey } = res.locals;
  const {type, employeeId} = req.body; //type = tipo de cartão
  const cardData = {
    apiKey,
    employeeId, 
    type
  }
  const createdCard: object = await createCardService(cardData);
  return res.status(201).send(createdCard);
}

export async function activateCard(req: Request, res: Response) {
  const cardData = req.body;
  await activateCardService(cardData);
  return res.status(200).send("Cartão ativado!");
}