import { validateCoordinates, calculateDistance, generateBoundingBox } from "../utils/coordinateUtils.js";

export async function getLocationOptions(req, res) {
  try {
    const { latitude, longitude, radius = 5 } = req.body;

    // Validate coordinates
    if (!latitude || !longitude) {
      return res.status(400).json({ error: "latitude and longitude required" });
    }

    if (!validateCoordinates(parseFloat(latitude), parseFloat(longitude))) {
      return res.status(400).json({ error: "Invalid coordinates provided" });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    // Enhanced area options with more realistic data
    const areaOptions = [
      {
        id: "field_a",
        name: "North Field",
        type: "agricultural",
        coordinates: [lat + 0.002, lon + 0.001],
        area_hectares: 12.5,
        currentCrop: "Wheat",
        irrigationType: "Sprinkler"
      },
      {
        id: "field_b", 
        name: "South Field",
        type: "agricultural",
        coordinates: [lat - 0.001, lon - 0.002],
        area_hectares: 8.3,
        currentCrop: "Rice",
        irrigationType: "Flood"
      },
      {
        id: "field_c",
        name: "East Field", 
        type: "agricultural",
        coordinates: [lat + 0.001, lon + 0.003],
        area_hectares: 15.2,
        currentCrop: "Pulses",
        irrigationType: "Drip"
      }
    ];

    // Enhanced nearby landmarks
    const nearbyLandmarks = [
      {
        name: "Village Center",
        type: "settlement",
        coordinates: [lat + 0.005, lon + 0.003],
        distance_km: calculateDistance(lat, lon, lat + 0.005, lon + 0.003),
        description: "Main village area with market"
      },
      {
        name: "Water Reservoir",
        type: "water_source",
        coordinates: [lat - 0.002, lon - 0.001],
        distance_km: calculateDistance(lat, lon, lat - 0.002, lon - 0.001),
        description: "Primary water source for irrigation"
      },
      {
        name: "Forest Area",
        type: "natural",
        coordinates: [lat + 0.008, lon - 0.004],
        distance_km: calculateDistance(lat, lon, lat + 0.008, lon - 0.004),
        description: "Protected forest area"
      }
    ];

    // Generate bounding box for the area
    const boundingBox = generateBoundingBox(lat, lon, parseFloat(radius));

    const response = {
      location: {
        latitude: lat,
        longitude: lon,
        formatted: `${lat.toFixed(6)}, ${lon.toFixed(6)}`
      },
      areaOptions,
      nearbyLandmarks,
      boundingBox,
      radius_km: parseFloat(radius),
      timestamp: new Date().toISOString()
    };

    res.json(response);
  } catch (err) {
    console.error('Location processing error:', err);
    res.status(500).json({ error: "Failed to process location input", details: err.message });
  }
}