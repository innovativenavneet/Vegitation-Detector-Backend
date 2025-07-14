/**
 * Smart suggestion engine for crop recommendations based on NDVI data
 */

/**
 * Analyzes NDVI data and provides crop suggestions
 * @param {number} currentNdvi - Current NDVI value
 * @param {number} historicalNdvi - Historical NDVI value for comparison
 * @param {Object} coordinates - Location coordinates
 * @param {string} season - Current season
 * @returns {Object} - Suggestions and recommendations
 */
export function generateCropSuggestions(currentNdvi, historicalNdvi, coordinates, season = 'current') {
  const suggestions = {
    vegetationHealth: analyzeVegetationHealth(currentNdvi),
    cropRecommendations: [],
    irrigationAdvice: '',
    yieldPrediction: '',
    historicalComparison: compareWithHistorical(currentNdvi, historicalNdvi)
  };

  // Generate crop recommendations based on NDVI and season
  suggestions.cropRecommendations = getCropRecommendations(currentNdvi, season);
  
  // Generate irrigation advice
  suggestions.irrigationAdvice = getIrrigationAdvice(currentNdvi, historicalNdvi);
  
  // Predict yield based on vegetation health
  suggestions.yieldPrediction = predictYield(currentNdvi, historicalNdvi);

  return suggestions;
}

/**
 * Analyzes vegetation health based on NDVI value
 * @param {number} ndvi - NDVI value
 * @returns {Object} - Health analysis
 */
function analyzeVegetationHealth(ndvi) {
  let healthStatus, healthPercentage, description;
  
  if (ndvi >= 0.6) {
    healthStatus = 'Excellent';
    healthPercentage = 90;
    description = 'High vegetation density, optimal growing conditions';
  } else if (ndvi >= 0.4) {
    healthStatus = 'Good';
    healthPercentage = 75;
    description = 'Healthy vegetation, good growing conditions';
  } else if (ndvi >= 0.2) {
    healthStatus = 'Moderate';
    healthPercentage = 50;
    description = 'Moderate vegetation, may need attention';
  } else if (ndvi >= 0.1) {
    healthStatus = 'Poor';
    healthPercentage = 25;
    description = 'Low vegetation density, intervention needed';
  } else {
    healthStatus = 'Critical';
    healthPercentage = 10;
    description = 'Very low vegetation, immediate action required';
  }

  return {
    status: healthStatus,
    percentage: healthPercentage,
    description,
    ndviValue: ndvi
  };
}

/**
 * Compares current NDVI with historical data
 * @param {number} currentNdvi - Current NDVI value
 * @param {number} historicalNdvi - Historical NDVI value
 * @returns {Object} - Comparison analysis
 */
function compareWithHistorical(currentNdvi, historicalNdvi) {
  if (!historicalNdvi) {
    return {
      change: 'No historical data available',
      percentageChange: 0,
      trend: 'neutral'
    };
  }

  const percentageChange = ((currentNdvi - historicalNdvi) / historicalNdvi) * 100;
  let trend, description;

  if (percentageChange > 15) {
    trend = 'improving';
    description = 'Significant improvement in vegetation health';
  } else if (percentageChange > 5) {
    trend = 'slightly_improving';
    description = 'Moderate improvement in vegetation health';
  } else if (percentageChange > -5) {
    trend = 'stable';
    description = 'Vegetation health is stable';
  } else if (percentageChange > -15) {
    trend = 'declining';
    description = 'Moderate decline in vegetation health';
  } else {
    trend = 'critical_decline';
    description = 'Significant decline in vegetation health - immediate attention needed';
  }

  return {
    change: `${percentageChange > 0 ? '+' : ''}${percentageChange.toFixed(1)}%`,
    percentageChange: percentageChange.toFixed(1),
    trend,
    description,
    currentValue: currentNdvi,
    historicalValue: historicalNdvi
  };
}

/**
 * Generates crop recommendations based on NDVI and season
 * @param {number} ndvi - NDVI value
 * @param {string} season - Current season
 * @returns {Array} - Array of crop recommendations
 */
function getCropRecommendations(ndvi, season) {
  const recommendations = [];

  if (ndvi >= 0.5) {
    // High vegetation density - suitable for high-yield crops
    recommendations.push({
      crop: 'Rice',
      confidence: 'High',
      reason: 'Excellent soil moisture and vegetation density',
      expectedYield: 'High'
    });
    recommendations.push({
      crop: 'Wheat',
      confidence: 'High',
      reason: 'Optimal growing conditions',
      expectedYield: 'High'
    });
  } else if (ndvi >= 0.3) {
    // Moderate vegetation - suitable for drought-resistant crops
    recommendations.push({
      crop: 'Millet',
      confidence: 'Medium',
      reason: 'Moderate vegetation, drought-resistant crop recommended',
      expectedYield: 'Medium'
    });
    recommendations.push({
      crop: 'Pulses',
      confidence: 'Medium',
      reason: 'Good for moderate moisture conditions',
      expectedYield: 'Medium'
    });
  } else {
    // Low vegetation - focus on soil improvement
    recommendations.push({
      crop: 'Green Manure',
      confidence: 'High',
      reason: 'Low vegetation density, soil improvement needed',
      expectedYield: 'N/A (Soil improvement)'
    });
    recommendations.push({
      crop: 'Drought-resistant varieties',
      confidence: 'Medium',
      reason: 'Low moisture conditions',
      expectedYield: 'Low'
    });
  }

  return recommendations;
}

/**
 * Generates irrigation advice based on NDVI data
 * @param {number} currentNdvi - Current NDVI value
 * @param {number} historicalNdvi - Historical NDVI value
 * @returns {string} - Irrigation advice
 */
function getIrrigationAdvice(currentNdvi, historicalNdvi) {
  if (currentNdvi >= 0.6) {
    return 'Optimal moisture levels. Maintain current irrigation schedule.';
  } else if (currentNdvi >= 0.4) {
    return 'Good moisture levels. Consider slight increase in irrigation if trend is declining.';
  } else if (currentNdvi >= 0.2) {
    return 'Moderate moisture levels. Increase irrigation frequency and duration.';
  } else {
    return 'Low moisture levels. Immediate irrigation required. Consider drip irrigation for efficiency.';
  }
}

/**
 * Predicts yield based on vegetation health
 * @param {number} currentNdvi - Current NDVI value
 * @param {number} historicalNdvi - Historical NDVI value
 * @returns {Object} - Yield prediction
 */
function predictYield(currentNdvi, historicalNdvi) {
  let yieldPrediction, confidence;

  if (currentNdvi >= 0.6) {
    yieldPrediction = 'High';
    confidence = 'High';
  } else if (currentNdvi >= 0.4) {
    yieldPrediction = 'Medium-High';
    confidence = 'Medium';
  } else if (currentNdvi >= 0.2) {
    yieldPrediction = 'Medium';
    confidence = 'Medium';
  } else {
    yieldPrediction = 'Low';
    confidence = 'High';
  }

  return {
    prediction: yieldPrediction,
    confidence,
    ndviBased: currentNdvi,
    recommendation: currentNdvi < 0.3 ? 'Consider crop rotation or soil improvement' : 'Continue current practices'
  };
} 