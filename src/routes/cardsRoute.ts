import { Router } from "express";
import { createCard } from "../controllers/cardsController";
import { createCardValidations } from "../middlewares/cardsValidation";


const cardsRoute = Router();

cardsRoute.post("/card", createCardValidations, createCard);

export default cardsRoute;