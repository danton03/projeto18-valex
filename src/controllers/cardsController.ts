import { Request, Response } from "express";

export async function createCard(req: Request, res: Response) {
  return res.status(201).send('Cartão criado!');
}