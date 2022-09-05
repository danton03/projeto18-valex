import { Router } from "express";
import { activateCard, blockCard, createCard, showBalanceAndTransactions } from "../controllers/cardsController";
import { activateCardValidations, cardIdValidation, createCardValidations } from "../middlewares/cardsValidation";


const cardsRoute = Router();

cardsRoute.post("/cards", createCardValidations, createCard);
cardsRoute.patch("/cards", activateCardValidations, activateCard);
cardsRoute.get("/cards/:id", cardIdValidation, showBalanceAndTransactions);
cardsRoute.patch("/cards/block/:id", cardIdValidation, blockCard);

export default cardsRoute;