import { generateCropSuggestions } from "../services/suggestionEngine.js";
import { validateCoordinates } from "../utils/coordinateUtils.js";

/**
 * Get crop suggestions based on NDVI data and location
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function getCropSuggestions(req, res) {
  try {
    const { latitude, longitude, currentNdvi, historicalNdvi, season, timeRange } = req.query;

    // Validate coordinates
    if (!validateCoordinates(parseFloat(latitude), parseFloat(longitude))) {
      return res.status(400).json({ 
        error: "Invalid coordinates provided" 
      });
    }

    // Validate NDVI data
    if (!currentNdvi || isNaN(parseFloat(currentNdvi))) {
      return res.status(400).json({ 
        error: "Current NDVI value is required and must be a number" 
      });
    }

    const coordinates = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    };

    const currentNdviValue = parseFloat(currentNdvi);
    const historicalNdviValue = historicalNdvi ? parseFloat(historicalNdvi) : null;

    // Generate suggestions
    const suggestions = generateCropSuggestions(
      currentNdviValue,
      historicalNdviValue,
      coordinates,
      season || 'current'
    );

    // Add metadata
    const response = {
      suggestions,
      metadata: {
        location: coordinates,
        timestamp: new Date().toISOString(),
        timeRange: timeRange || 'current',
        season: season || 'current'
      }
    };

    res.json(response);

  } catch (error) {
    console.error('Error generating suggestions:', error);
    res.status(500).json({ 
      error: "Failed to generate crop suggestions",
      details: error.message 
    });
  }
}

/**
 * Get historical NDVI comparison data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export async function getHistoricalComparison(req, res) {
  try {
    const { latitude, longitude, year } = req.query;

    // Validate coordinates
    if (!validateCoordinates(parseFloat(latitude), parseFloat(longitude))) {
      return res.status(400).json({ 
        error: "Invalid coordinates provided" 
      });
    }

    // Mock historical data - in real implementation, this would fetch from database
    const historicalData = {
      currentYear: {
        january: 0.45,
        february: 0.52,
        march: 0.58,
        april: 0.62,
        may: 0.65,
        june: 0.68,
        july: 0.72,
        august: 0.70,
        september: 0.65,
        october: 0.58,
        november: 0.52,
        december: 0.48
      },
      previousYear: {
        january: 0.42,
        february: 0.48,
        march: 0.55,
        april: 0.58,
        may: 0.62,
        june: 0.65,
        july: 0.68,
        august: 0.66,
        september: 0.62,
        october: 0.55,
        november: 0.48,
        december: 0.45
      }
    };

    const comparison = {
      location: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      },
      comparison: {
        currentYear: historicalData.currentYear,
        previousYear: historicalData.previousYear,
        averageChange: '+8.5%',
        trend: 'improving'
      },
      insights: [
        'Vegetation health has improved by 8.5% compared to last year',
        'Peak vegetation period shows 4% increase',
        'Consistent improvement across all months'
      ]
    };

    res.json(comparison);

  } catch (error) {
    console.error('Error fetching historical comparison:', error);
    res.status(500).json({ 
      error: "Failed to fetch historical comparison data",
      details: error.message 
    });
  }
} 