import { fromArrayBuffer } from "geotiff";
import admin from "firebase-admin";
import { getNdviData } from "../controllers/NDVIController.js";

export async function calculateNdvi() {
  const bucket = admin.storage().bucket();
  const [redBuffer] = await bucket.file("red.tif").download();
  const [nirBuffer] = await bucket.file("nir.tif").download();

  const redTiff = await fromArrayBuffer(redBuffer.buffer);
  const nirTiff = await fromArrayBuffer(nirBuffer.buffer);

  const redImage = await redTiff.getImage();
  const nirImage = await nirTiff.getImage();

  const redRaster = (await redImage.readRasters())[0];
  const nirRaster = (await nirImage.readRasters())[0];

  const ndvi = [];
  let sum = 0,
    count = 0;
  const maxPixels = 1000000;
  for (let i = 0; i < Math.min(redRaster.length, maxPixels); i++) {
    const red = redRaster[i];
    const nir = nirRaster[i];
    if (nir + red !== 0) {
      const val = (nir - red) / (nir + red);
      ndvi.push(val);
      sum += val;
      count++;
    } else {
      ndvi.push(0);
    }
  }
  const meanNdvi = (sum / count).toFixed(4);
  return {
    meanNdvi,
    sample: ndvi.slice(0, 100),
    width: redImage.getWidth(),
    height: redImage.getHeight(),
  };
}