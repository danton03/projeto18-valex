import { Router } from "express";
import { 
  activateCard, blockCard, createCard, purchase, rechargeCard,
  showBalanceAndTransactions, unblockCard 
} from "../controllers/cardsController";
import { 
  activateCardValidations, amountValidation, cardIdValidation, 
  createCardValidations, passwordFormatValidation, paymentValidation 
} from "../middlewares/cardsValidation";

const cardsRoute = Router();

cardsRoute.post("/cards", createCardValidations, createCard);
cardsRoute.patch("/cards", activateCardValidations, activateCard);
cardsRoute.get("/cards/:id", cardIdValidation, showBalanceAndTransactions);
cardsRoute.patch("/cards/block/:id", cardIdValidation, passwordFormatValidation, blockCard);
cardsRoute.patch("/cards/unblock/:id", cardIdValidation, passwordFormatValidation, unblockCard);
cardsRoute.post("/cards/recharge/:id", cardIdValidation, amountValidation, rechargeCard);
cardsRoute.post("/cards/payment", paymentValidation, purchase);

export default cardsRoute;