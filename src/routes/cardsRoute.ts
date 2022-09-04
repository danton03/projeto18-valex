import { Router } from "express";
import { activateCard, createCard } from "../controllers/cardsController";
import { activateCardValidations, createCardValidations } from "../middlewares/cardsValidation";


const cardsRoute = Router();

cardsRoute.post("/card", createCardValidations, createCard);
cardsRoute.patch("/card", activateCardValidations, activateCard);

export default cardsRoute;