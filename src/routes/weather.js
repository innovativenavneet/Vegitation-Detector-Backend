import express from "express";
import { getWeatherData, getCurrentWeatherData } from "../controllers/weatherController.js";

const router = express.Router();

// GET /api/weather - Get weather forecast for agricultural planning
router.get("/", getWeatherData);

// GET /api/weather/current - Get current weather conditions
router.get("/current", getCurrentWeatherData);

export default router; 