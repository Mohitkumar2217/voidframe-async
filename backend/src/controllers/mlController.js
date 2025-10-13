import { mlService } from "../services/mlService.js";

export const predictController = {
  async predictRisk(req, res) {
    try {
      const features = req.body; // the frontend sends input JSON
      const result = await mlService.predictRisk(features);
      res.json(result);
    } catch (err) {
      console.error("Prediction error:", err);
      res.status(500).json({ error: "Prediction failed" });
    }
  },
};
