import { calculateNdvi } from "../services/GeoTIFFService.js";

export async function getNdviData(req, res) {
  try {
    const ndviResult = await calculateNdvi();
    res.json(ndviResult);
  } catch (err) {
    res.status(500).json({ error: "NDVI computation failed" });
  }
}