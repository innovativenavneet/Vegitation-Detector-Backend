export async function getLocationOptions(req, res) {
  try {
    const { latitude, longitude } = req.body;

    // Dummy logic: In real use, query a GIS service or database
    if (!latitude || !longitude) {
      return res.status(400).json({ error: "latitude and longitude required" });
    }

    // Example: Return nearby landmarks and area options
    res.json({
      areaOptions: [
        { name: "Field A", coordinates: [latitude + 0.001, longitude + 0.001] },
        { name: "Field B", coordinates: [latitude - 0.001, longitude - 0.001] }
      ],
      nearbyLandmarks: [
        { name: "Village Center", distance_km: 1.2 },
        { name: "Water Source", distance_km: 0.8 }
      ]
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to process location input" });
  }
}