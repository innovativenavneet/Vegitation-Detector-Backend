import express from "express";
import { getNdviData } from "../controllers/NDVIController.js";

const router = express.Router();

router.get("/", getNdviData);

export default router;