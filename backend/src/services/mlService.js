// mlService.js
// ML service: connects Node.js (Express) to Python FastAPI microservice for real model predictions

import axios from "axios";
import { spawn } from "child_process";

const FASTAPI_URL = "http://127.0.0.1:8000/predict";

export const mlService = {
  /**
   * Send features to FastAPI ML model and get prediction result
   * @param {Object} features - Input data (same structure FastAPI expects)
   * @returns {Object} prediction result from Python
   */
  async predictRisk(features) {
    try {
      // Call FastAPI endpoint
      const response = await axios.post(FASTAPI_URL, features);
      return response.data; // FastAPI returns JSON like { risk_level: 2 } or similar
    } catch (err) {
      console.error("❌ Error calling FastAPI microservice:", err.message);
      throw new Error("ML prediction failed. Check FastAPI server logs.");
    }
  },

  /**
   * Optional: trigger Python model training (if you add /train endpoint later)
   * Or run local Python script directly
   */
  async trainModel(datasetPath) {
    return new Promise((resolve, reject) => {
      if (!datasetPath) {
        return resolve({
          status: "skipped",
          message: "No dataset path provided (demo mode)",
        });
      }

      const py = spawn("python3", ["ml/train_xgb.py", datasetPath]);
      py.stdout.on("data", (data) => console.log("📊 Python:", data.toString()));
      py.stderr.on("data", (data) =>
        console.error("🐍 Python Error:", data.toString())
      );
      py.on("close", (code) => {
        if (code === 0) resolve({ status: "ok", message: "Training completed" });
        else reject(new Error("Training failed (non-zero exit code)"));
      });
    });
  },
};
