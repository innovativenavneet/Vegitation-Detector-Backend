import express from "express";
import { getLocationOptions } from "../controllers/locationController.js";

const router = express.Router();

router.post("/", getLocationOptions);

export default router;