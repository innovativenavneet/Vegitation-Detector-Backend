import express from "express";
import { getCropSuggestions, getHistoricalComparison } from "../controllers/suggestionController.js";

const router = express.Router();

// GET /api/suggestions - Get crop suggestions based on NDVI data
router.get("/", getCropSuggestions);

// GET /api/suggestions/historical - Get historical NDVI comparison
router.get("/historical", getHistoricalComparison);

export default router; 