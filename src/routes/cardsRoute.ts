import { Router } from "express";
import { activateCard, blockCard, createCard, showBalanceAndTransactions, unblockCard } from "../controllers/cardsController";
import { activateCardValidations, cardIdValidation, createCardValidations, passwordFormatValidation } from "../middlewares/cardsValidation";


const cardsRoute = Router();

cardsRoute.post("/cards", createCardValidations, createCard);
cardsRoute.patch("/cards", activateCardValidations, activateCard);
cardsRoute.get("/cards/:id", cardIdValidation, showBalanceAndTransactions);
cardsRoute.patch("/cards/block/:id", cardIdValidation, passwordFormatValidation, blockCard);
cardsRoute.patch("/cards/unblock/:id", cardIdValidation, passwordFormatValidation, unblockCard);

export default cardsRoute;