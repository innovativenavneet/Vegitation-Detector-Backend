/**
 * Coordinate utilities for processing and validating geographic coordinates
 */

/**
 * Validates if coordinates are within valid ranges
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {boolean} - True if coordinates are valid
 */
export function validateCoordinates(latitude, longitude) {
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    latitude >= -90 && latitude <= 90 &&
    longitude >= -180 && longitude <= 180
  );
}

/**
 * Calculates distance between two coordinate points using Haversine formula
 * @param {number} lat1 - First latitude
 * @param {number} lon1 - First longitude
 * @param {number} lat2 - Second latitude
 * @param {number} lon2 - Second longitude
 * @returns {number} - Distance in kilometers
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Converts coordinates to a standardized format
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {Object} - Standardized coordinate object
 */
export function standardizeCoordinates(latitude, longitude) {
  return {
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    formatted: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
  };
}

/**
 * Generates a bounding box around a point
 * @param {number} latitude - Center latitude
 * @param {number} longitude - Center longitude
 * @param {number} radiusKm - Radius in kilometers
 * @returns {Object} - Bounding box coordinates
 */
export function generateBoundingBox(latitude, longitude, radiusKm = 1) {
  const latDelta = radiusKm / 111.32; // Approximate km per degree latitude
  const lonDelta = radiusKm / (111.32 * Math.cos(latitude * Math.PI / 180));
  
  return {
    north: latitude + latDelta,
    south: latitude - latDelta,
    east: longitude + lonDelta,
    west: longitude - lonDelta
  };
} 