/**
 * Weather service for agricultural recommendations
 * Integrates with weather APIs for crop planning
 */

/**
 * Get weather forecast for a location
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @param {number} days - Number of days for forecast
 * @returns {Object} - Weather forecast data
 */
export async function getWeatherForecast(latitude, longitude, days = 7) {
  try {
    // Mock weather data - in real implementation, this would call weather APIs
    // like IMD (Indian Meteorological Department), OpenWeatherMap, etc.
    
    const forecast = [];
    const currentDate = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i);
      
      // Generate realistic weather data based on season
      const month = date.getMonth();
      let temperature, humidity, rainfall;
      
      if (month >= 5 && month <= 9) { // Monsoon season
        temperature = (Math.random() * 10 + 25).toFixed(1); // 25-35°C
        humidity = (Math.random() * 20 + 70).toFixed(1); // 70-90%
        rainfall = (Math.random() * 15 + 5).toFixed(1); // 5-20mm
      } else { // Dry season
        temperature = (Math.random() * 15 + 20).toFixed(1); // 20-35°C
        humidity = (Math.random() * 30 + 40).toFixed(1); // 40-70%
        rainfall = (Math.random() * 5).toFixed(1); // 0-5mm
      }
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        temperature: parseFloat(temperature),
        humidity: parseFloat(humidity),
        rainfall: parseFloat(rainfall),
        windSpeed: (Math.random() * 10 + 5).toFixed(1),
        description: getWeatherDescription(parseFloat(temperature), parseFloat(humidity), parseFloat(rainfall))
      });
    }
    
    return {
      location: { latitude, longitude },
      forecast,
      summary: generateWeatherSummary(forecast),
      agriculturalImpact: analyzeAgriculturalImpact(forecast)
    };
    
  } catch (error) {
    console.error('Weather forecast error:', error);
    throw new Error('Failed to fetch weather forecast');
  }
}

/**
 * Get current weather conditions
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {Object} - Current weather data
 */
export async function getCurrentWeather(latitude, longitude) {
  try {
    const currentDate = new Date();
    const month = currentDate.getMonth();
    
    // Generate current weather data
    let temperature, humidity, rainfall;
    
    if (month >= 5 && month <= 9) { // Monsoon season
      temperature = (Math.random() * 10 + 25).toFixed(1);
      humidity = (Math.random() * 20 + 70).toFixed(1);
      rainfall = (Math.random() * 15 + 5).toFixed(1);
    } else { // Dry season
      temperature = (Math.random() * 15 + 20).toFixed(1);
      humidity = (Math.random() * 30 + 40).toFixed(1);
      rainfall = (Math.random() * 5).toFixed(1);
    }
    
    return {
      location: { latitude, longitude },
      current: {
        temperature: parseFloat(temperature),
        humidity: parseFloat(humidity),
        rainfall: parseFloat(rainfall),
        windSpeed: (Math.random() * 10 + 5).toFixed(1),
        description: getWeatherDescription(parseFloat(temperature), parseFloat(humidity), parseFloat(rainfall)),
        timestamp: currentDate.toISOString()
      }
    };
    
  } catch (error) {
    console.error('Current weather error:', error);
    throw new Error('Failed to fetch current weather');
  }
}

/**
 * Generate weather description based on conditions
 * @param {number} temperature - Temperature in Celsius
 * @param {number} humidity - Humidity percentage
 * @param {number} rainfall - Rainfall in mm
 * @returns {string} - Weather description
 */
function getWeatherDescription(temperature, humidity, rainfall) {
  if (rainfall > 10) {
    return 'Heavy Rain';
  } else if (rainfall > 5) {
    return 'Light Rain';
  } else if (humidity > 80) {
    return 'Humid';
  } else if (temperature > 30) {
    return 'Hot';
  } else if (temperature < 15) {
    return 'Cool';
  } else {
    return 'Pleasant';
  }
}

/**
 * Generate weather summary
 * @param {Array} forecast - Weather forecast array
 * @returns {Object} - Weather summary
 */
function generateWeatherSummary(forecast) {
  const avgTemperature = (forecast.reduce((sum, day) => sum + day.temperature, 0) / forecast.length).toFixed(1);
  const avgHumidity = (forecast.reduce((sum, day) => sum + day.humidity, 0) / forecast.length).toFixed(1);
  const totalRainfall = forecast.reduce((sum, day) => sum + day.rainfall, 0).toFixed(1);
  
  return {
    averageTemperature: parseFloat(avgTemperature),
    averageHumidity: parseFloat(avgHumidity),
    totalRainfall: parseFloat(totalRainfall),
    daysWithRain: forecast.filter(day => day.rainfall > 0).length,
    temperatureRange: {
      min: Math.min(...forecast.map(day => day.temperature)),
      max: Math.max(...forecast.map(day => day.temperature))
    }
  };
}

/**
 * Analyze agricultural impact of weather
 * @param {Array} forecast - Weather forecast array
 * @returns {Object} - Agricultural impact analysis
 */
function analyzeAgriculturalImpact(forecast) {
  const summary = generateWeatherSummary(forecast);
  
  let impact = {
    irrigation: '',
    cropHealth: '',
    recommendations: []
  };
  
  // Analyze irrigation needs
  if (summary.totalRainfall < 20) {
    impact.irrigation = 'High irrigation needed due to low rainfall';
    impact.recommendations.push('Increase irrigation frequency');
  } else if (summary.totalRainfall < 50) {
    impact.irrigation = 'Moderate irrigation may be needed';
    impact.recommendations.push('Monitor soil moisture levels');
  } else {
    impact.irrigation = 'Sufficient rainfall, reduce irrigation';
    impact.recommendations.push('Reduce irrigation to prevent waterlogging');
  }
  
  // Analyze crop health impact
  if (summary.averageTemperature > 35) {
    impact.cropHealth = 'High temperature stress on crops';
    impact.recommendations.push('Consider shade nets or cooling measures');
  } else if (summary.averageTemperature < 10) {
    impact.cropHealth = 'Low temperature may slow growth';
    impact.recommendations.push('Consider crop protection measures');
  } else {
    impact.cropHealth = 'Optimal temperature conditions';
  }
  
  // Humidity impact
  if (summary.averageHumidity > 80) {
    impact.recommendations.push('High humidity - monitor for fungal diseases');
  } else if (summary.averageHumidity < 40) {
    impact.recommendations.push('Low humidity - increase irrigation frequency');
  }
  
  return impact;
} 