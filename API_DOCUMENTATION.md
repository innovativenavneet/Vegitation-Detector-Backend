# 🌾 Agriculture Backend API Documentation

## Overview
This backend provides comprehensive agricultural data analysis and recommendations using NDVI (Normalized Difference Vegetation Index) data, weather information, and smart crop suggestions.

## Base URL
```
http://localhost:4000/api
```

## Authentication
Currently, no authentication is required for these endpoints.

---

## 📍 Location Management

### POST /api/location
Get location options and nearby landmarks for a given coordinate.

**Request Body:**
```json
{
  "latitude": 28.6139,
  "longitude": 77.2090,
  "radius": 5
}
```

**Response:**
```json
{
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090,
    "formatted": "28.613900, 77.209000"
  },
  "areaOptions": [
    {
      "id": "field_a",
      "name": "North Field",
      "type": "agricultural",
      "coordinates": [28.6159, 77.2100],
      "area_hectares": 12.5,
      "currentCrop": "Wheat",
      "irrigationType": "Sprinkler"
    }
  ],
  "nearbyLandmarks": [
    {
      "name": "Village Center",
      "type": "settlement",
      "coordinates": [28.6189, 77.2120],
      "distance_km": 1.2,
      "description": "Main village area with market"
    }
  ],
  "boundingBox": {
    "north": 28.6239,
    "south": 28.6039,
    "east": 77.2190,
    "west": 77.1990
  },
  "radius_km": 5,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 🌱 NDVI Data Analysis

### GET /api/ndvi
Get NDVI data with chart-ready information and vegetation analysis.

**Query Parameters:**
- `latitude` (optional): Latitude coordinate
- `longitude` (optional): Longitude coordinate
- `area` (optional): Selected area name

**Example Request:**
```
GET /api/ndvi?latitude=28.6139&longitude=77.2090&area=North Field
```

**Response:**
```json
{
  "meanNdvi": "0.6234",
  "sample": [0.61, 0.63, 0.62, ...],
  "width": 1024,
  "height": 1024,
  "chartData": {
    "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    "datasets": [
      {
        "label": "NDVI Values",
        "data": [0.45, 0.52, 0.58, 0.62, 0.65, 0.68, 0.72, 0.70, 0.65, 0.58, 0.52, 0.48],
        "borderColor": "#4CAF50",
        "backgroundColor": "rgba(76, 175, 80, 0.1)",
        "tension": 0.4
      }
    ],
    "currentValue": 0.6234,
    "trend": "increasing",
    "averageValue": "0.585"
  },
  "areaInfo": {
    "selectedArea": "North Field"
  },
  "coordinates": {
    "latitude": 28.6139,
    "longitude": 77.2090,
    "boundingBox": {
      "north": 28.6239,
      "south": 28.6039,
      "east": 77.2190,
      "west": 77.1990
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 🧠 Smart Suggestions

### GET /api/suggestions
Get crop recommendations and agricultural suggestions based on NDVI data.

**Query Parameters:**
- `latitude` (required): Latitude coordinate
- `longitude` (required): Longitude coordinate
- `currentNdvi` (required): Current NDVI value
- `historicalNdvi` (optional): Historical NDVI value for comparison
- `season` (optional): Current season (default: "current")
- `timeRange` (optional): Time range for analysis

**Example Request:**
```
GET /api/suggestions?latitude=28.6139&longitude=77.2090&currentNdvi=0.6234&historicalNdvi=0.5890&season=monsoon
```

**Response:**
```json
{
  "suggestions": {
    "vegetationHealth": {
      "status": "Good",
      "percentage": 75,
      "description": "Healthy vegetation, good growing conditions",
      "ndviValue": 0.6234
    },
    "cropRecommendations": [
      {
        "crop": "Rice",
        "confidence": "High",
        "reason": "Excellent soil moisture and vegetation density",
        "expectedYield": "High"
      },
      {
        "crop": "Wheat",
        "confidence": "High",
        "reason": "Optimal growing conditions",
        "expectedYield": "High"
      }
    ],
    "irrigationAdvice": "Optimal moisture levels. Maintain current irrigation schedule.",
    "yieldPrediction": {
      "prediction": "Medium-High",
      "confidence": "Medium",
      "ndviBased": 0.6234,
      "recommendation": "Continue current practices"
    },
    "historicalComparison": {
      "change": "+5.8%",
      "percentageChange": "5.8",
      "trend": "slightly_improving",
      "description": "Moderate improvement in vegetation health",
      "currentValue": 0.6234,
      "historicalValue": 0.5890
    }
  },
  "metadata": {
    "location": {
      "latitude": 28.6139,
      "longitude": 77.2090
    },
    "timestamp": "2024-01-15T10:30:00.000Z",
    "timeRange": "current",
    "season": "monsoon"
  }
}
```

### GET /api/suggestions/historical
Get historical NDVI comparison data.

**Query Parameters:**
- `latitude` (required): Latitude coordinate
- `longitude` (required): Longitude coordinate
- `year` (optional): Year for comparison

**Example Request:**
```
GET /api/suggestions/historical?latitude=28.6139&longitude=77.2090&year=2024
```

**Response:**
```json
{
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090
  },
  "comparison": {
    "currentYear": {
      "january": 0.45,
      "february": 0.52,
      "march": 0.58,
      "april": 0.62,
      "may": 0.65,
      "june": 0.68,
      "july": 0.72,
      "august": 0.70,
      "september": 0.65,
      "october": 0.58,
      "november": 0.52,
      "december": 0.48
    },
    "previousYear": {
      "january": 0.42,
      "february": 0.48,
      "march": 0.55,
      "april": 0.58,
      "may": 0.62,
      "june": 0.65,
      "july": 0.68,
      "august": 0.66,
      "september": 0.62,
      "october": 0.55,
      "november": 0.48,
      "december": 0.45
    },
    "averageChange": "+8.5%",
    "trend": "improving"
  },
  "insights": [
    "Vegetation health has improved by 8.5% compared to last year",
    "Peak vegetation period shows 4% increase",
    "Consistent improvement across all months"
  ]
}
```

---

## 🌦️ Weather Integration

### GET /api/weather
Get weather forecast for agricultural planning.

**Query Parameters:**
- `latitude` (required): Latitude coordinate
- `longitude` (required): Longitude coordinate
- `days` (optional): Number of days for forecast (default: 7)

**Example Request:**
```
GET /api/weather?latitude=28.6139&longitude=77.2090&days=7
```

**Response:**
```json
{
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090
  },
  "forecast": [
    {
      "date": "2024-01-15",
      "temperature": 28.5,
      "humidity": 75.2,
      "rainfall": 8.3,
      "windSpeed": 12.1,
      "description": "Light Rain"
    }
  ],
  "summary": {
    "averageTemperature": 27.8,
    "averageHumidity": 72.5,
    "totalRainfall": 45.2,
    "daysWithRain": 4,
    "temperatureRange": {
      "min": 24.2,
      "max": 31.5
    }
  },
  "agriculturalImpact": {
    "irrigation": "Moderate irrigation may be needed",
    "cropHealth": "Optimal temperature conditions",
    "recommendations": [
      "Monitor soil moisture levels",
      "High humidity - monitor for fungal diseases"
    ]
  },
  "metadata": {
    "location": {
      "latitude": 28.6139,
      "longitude": 77.2090
    },
    "forecastDays": 7,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### GET /api/weather/current
Get current weather conditions.

**Query Parameters:**
- `latitude` (required): Latitude coordinate
- `longitude` (required): Longitude coordinate

**Example Request:**
```
GET /api/weather/current?latitude=28.6139&longitude=77.2090
```

**Response:**
```json
{
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090
  },
  "current": {
    "temperature": 28.5,
    "humidity": 75.2,
    "rainfall": 8.3,
    "windSpeed": 12.1,
    "description": "Light Rain",
    "timestamp": "2024-01-15T10:30:00.000Z"
  },
  "metadata": {
    "location": {
      "latitude": 28.6139,
      "longitude": 77.2090
    },
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 🚀 Complete Workflow Example

Here's how a farmer would use the complete API workflow:

1. **Enter Location:**
   ```
   POST /api/location
   {
     "latitude": 28.6139,
     "longitude": 77.2090,
     "radius": 5
   }
   ```

2. **Get NDVI Data:**
   ```
   GET /api/ndvi?latitude=28.6139&longitude=77.2090&area=North Field
   ```

3. **Get Crop Suggestions:**
   ```
   GET /api/suggestions?latitude=28.6139&longitude=77.2090&currentNdvi=0.6234&season=monsoon
   ```

4. **Check Weather Forecast:**
   ```
   GET /api/weather?latitude=28.6139&longitude=77.2090&days=7
   ```

5. **Historical Comparison:**
   ```
   GET /api/suggestions/historical?latitude=28.6139&longitude=77.2090
   ```

---

## 📊 Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "details": "Additional error details (if available)"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad Request (invalid parameters)
- `500`: Internal Server Error

---

## 🔧 Features Implemented

✅ **Location-based NDVI data retrieval**
✅ **Area/landmark selection support**
✅ **Graph and chart data output (NDVI trends)**
✅ **Yield suggestion engine based on vegetation analysis**
✅ **Historical NDVI comparison (year-on-year)**
✅ **API endpoints for frontend integration**
✅ **Weather integration for agricultural planning**
✅ **Smart crop recommendations**
✅ **Coordinate validation and processing**
✅ **Comprehensive error handling**

---

## 🎯 Use Case Example

"A farmer opens the app, enters his farm's coordinates (28.6139, 77.2090). The backend fetches satellite-based NDVI data for the area and compares it with past years. It returns easy-to-understand graphs showing vegetation has improved by 8.5% from last July, and suggests 'consider cultivating Rice for better yield based on current vegetation health' along with weather-based irrigation recommendations." 