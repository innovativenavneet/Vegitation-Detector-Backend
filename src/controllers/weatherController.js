import { getWeatherForecast, getCurrentWeather } from "../services/weatherService.js";
import { validateCoordinates } from "../utils/coordinateUtils.js";

/**
 * Get weather forecast for agricultural planning
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function getWeatherData(req, res) {
  try {
    const { latitude, longitude, days = 7 } = req.query;

    // Validate coordinates
    if (!latitude || !longitude) {
      return res.status(400).json({ 
        error: "latitude and longitude are required" 
      });
    }

    if (!validateCoordinates(parseFloat(latitude), parseFloat(longitude))) {
      return res.status(400).json({ 
        error: "Invalid coordinates provided" 
      });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const forecastDays = parseInt(days);

    // Get weather forecast
    const weatherData = await getWeatherForecast(lat, lon, forecastDays);

    res.json({
      ...weatherData,
      metadata: {
        location: { latitude: lat, longitude: lon },
        forecastDays,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Weather data error:', error);
    res.status(500).json({ 
      error: "Failed to fetch weather data",
      details: error.message 
    });
  }
}

/**
 * Get current weather conditions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function getCurrentWeatherData(req, res) {
  try {
    const { latitude, longitude } = req.query;

    // Validate coordinates
    if (!latitude || !longitude) {
      return res.status(400).json({ 
        error: "latitude and longitude are required" 
      });
    }

    if (!validateCoordinates(parseFloat(latitude), parseFloat(longitude))) {
      return res.status(400).json({ 
        error: "Invalid coordinates provided" 
      });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    // Get current weather
    const currentWeather = await getCurrentWeather(lat, lon);

    res.json({
      ...currentWeather,
      metadata: {
        location: { latitude: lat, longitude: lon },
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Current weather error:', error);
    res.status(500).json({ 
      error: "Failed to fetch current weather",
      details: error.message 
    });
  }
} 