import { Router } from "express";
import cardsRoute from "./cardsRoute";

const router = Router();
router.use(cardsRoute);

export default router;