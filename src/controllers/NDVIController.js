import { calculateNdvi } from "../services/GeoTIFFService.js";
import { validateCoordinates, generateBoundingBox } from "../utils/coordinateUtils.js";

export async function getNdviData(req, res) {
  try {
    const { latitude, longitude, area } = req.query;
    
    // If coordinates provided, validate them
    if (latitude && longitude) {
      if (!validateCoordinates(parseFloat(latitude), parseFloat(longitude))) {
        return res.status(400).json({ error: "Invalid coordinates provided" });
      }
    }

    const ndviResult = await calculateNdvi();
    
    // Enhanced response with chart-ready data
    const enhancedResponse = {
      ...ndviResult,
      chartData: generateChartData(ndviResult.meanNdvi),
      areaInfo: area ? { selectedArea: area } : null,
      coordinates: latitude && longitude ? {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        boundingBox: generateBoundingBox(parseFloat(latitude), parseFloat(longitude))
      } : null,
      timestamp: new Date().toISOString()
    };

    res.json(enhancedResponse);
  } catch (err) {
    console.error('NDVI computation error:', err);
    res.status(500).json({ error: "NDVI computation failed", details: err.message });
  }
}

/**
 * Generate chart-ready data for NDVI trends
 * @param {number} currentNdvi - Current NDVI value
 * @returns {Object} - Chart data structure
 */
function generateChartData(currentNdvi) {
  const currentDate = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Generate mock historical data for the past 12 months
  const historicalData = [];
  const currentMonth = currentDate.getMonth();
  
  for (let i = 11; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    const monthName = months[monthIndex];
    
    // Generate realistic NDVI values based on season
    let ndviValue;
    if (monthIndex >= 5 && monthIndex <= 9) { // Monsoon and post-monsoon
      ndviValue = (Math.random() * 0.3 + 0.4).toFixed(3); // 0.4-0.7 range
    } else { // Winter and summer
      ndviValue = (Math.random() * 0.2 + 0.2).toFixed(3); // 0.2-0.4 range
    }
    
    historicalData.push({
      month: monthName,
      ndvi: parseFloat(ndviValue),
      year: monthIndex > currentMonth ? currentDate.getFullYear() - 1 : currentDate.getFullYear()
    });
  }
  
  // Add current month with actual NDVI value
  historicalData[historicalData.length - 1] = {
    month: months[currentMonth],
    ndvi: parseFloat(currentNdvi),
    year: currentDate.getFullYear(),
    isCurrent: true
  };

  return {
    labels: historicalData.map(d => d.month),
    datasets: [
      {
        label: 'NDVI Values',
        data: historicalData.map(d => d.ndvi),
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4
      }
    ],
    currentValue: parseFloat(currentNdvi),
    trend: historicalData[historicalData.length - 1].ndvi > historicalData[historicalData.length - 2].ndvi ? 'increasing' : 'decreasing',
    averageValue: (historicalData.reduce((sum, d) => sum + d.ndvi, 0) / historicalData.length).toFixed(3)
  };
}