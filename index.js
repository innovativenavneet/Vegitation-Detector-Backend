import express from "express";
import cors from "cors";
import morgan from "morgan";
import ndviRoute from "./src/routes/ndvi.js";
import locationRoute from "./src/routes/location.js";
import suggestionsRoute from "./src/routes/suggestions.js";
import weatherRoute from "./src/routes/weather.js";
import admin from "firebase-admin";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 4000;

const serviceAccount = JSON.parse(fs.readFileSync("serviceAccountKey.json", "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "agro-ndvi.firebasestorage.app", 
});

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/ndvi", ndviRoute);
app.use("/api/location", locationRoute);
app.use("/api/suggestions", suggestionsRoute);
app.use("/api/weather", weatherRoute);

app.listen(PORT, () => {
  console.log(`✅ NDVI API running at http://localhost:${PORT}`);
});
