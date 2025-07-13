import express from "express";
import { fromArrayBuffer } from "geotiff";
import admin from "firebase-admin";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Download GeoTIFF files from Firebase Storage
    const bucket = admin.storage().bucket();
    const [redBuffer] = await bucket.file("red.tif").download();
    const [nirBuffer] = await bucket.file("nir.tif").download();

    // Parse each buffer as a geotiff image
    const redTiff = await fromArrayBuffer(redBuffer.buffer);
    const nirTiff = await fromArrayBuffer(nirBuffer.buffer);

    // Get the first image bandwidth from each file
    const redImage = await redTiff.getImage();
    const nirImage = await nirTiff.getImage();

    // Get raster values from each image
    const redRaster = (await redImage.readRasters())[0];
    const nirRaster = (await nirImage.readRasters())[0];

    // Prepare to calculate NDVI
    const ndvi = [];
    let sum = 0;
    let count = 0;

    // Loop through every pixel and calculate NDVI
    const maxPixels = 1000000; // 1 million pixels max
    for (let i = 0; i < Math.min(redRaster.length, maxPixels); i++) {
      const red = redRaster[i];
      const nir = nirRaster[i];

      if ((nir + red) !== 0) {
        const val = (nir - red) / (nir + red);
        ndvi.push(val);
        sum += val;
        count++;
      } else {
        ndvi.push(0);
      }
    }

    // Calculate mean NDVI
    const meanNdvi = (sum / count).toFixed(4);

    res.json({
      meanNdvi,
      sample: ndvi.slice(0, 100),
      width: redImage.getWidth(),
      height: redImage.getHeight()
    });
  } catch (err) {
    console.error("Ndvi Error", err);
    res.status(500).json({ error: "NDVI computation failed" });
  }
});

export default router;