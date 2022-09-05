import { Request, Response } from "express";
import { activateCardService, blockCardService, createCardService, generateBalanceService, unblockCardService } from "../services/cardServices";

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

export async function showBalanceAndTransactions(req: Request, res: Response) {
  const cardId: number = Number(req.params.id);
  const balanceAndTransactions = await generateBalanceService(cardId);
  return res.status(200).send(balanceAndTransactions);
}

export async function blockCard(req: Request, res: Response) {
  const { password } = req.body;
  const cardId: number = Number(req.params.id);
  await blockCardService(cardId, password);
  return res.status(200).send("Cartão bloqueado");
}

export async function unblockCard(req: Request, res: Response) {
  const { password } = req.body;
  const cardId: number = Number(req.params.id);
  await unblockCardService(cardId, password);
  return res.status(200).send("Cartão desbloqueado");
}

export async function rechargeCard(req: Request, res: Response) {
  const { password } = req.body;
  const cardId: number = Number(req.params.id);
  await unblockCardService(cardId, password);
  return res.status(200).send("Cartão desbloqueado");
}