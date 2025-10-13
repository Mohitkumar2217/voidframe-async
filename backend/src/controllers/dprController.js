// Controller for DPR endpoints: orchestrates analysis services and DB models
const Dpr = require('../models/Dpr');
const textService = require('../services/textService');
const imageService = require('../services/imageService');
const mlService = require('../services/mlService');
const { analyzeDPR } = require("../services/genaiService"); 

// async function analyzeDPR(text, structuredField) {
//   const wordCount = text.split(/\s+/).length;
//   const complexity = wordCount > 300 ? "Detailed" : "Brief";

//   // Simulated logic: check for keywords and generate pseudo-analysis
//   const hasBudget = /budget|cost|finance/i.test(text);
//   const hasTimeline = /timeline|duration|month/i.test(text);
//   const hasManpower = /manpower|team|staff/i.test(text);

//   return {
//     issues: [
//       !hasBudget && "Missing cost or financial details.",
//       !hasTimeline && "Project duration/timeline not defined.",
//       !hasManpower && "Manpower distribution section missing.",
//     ].filter(Boolean),

//     feasibility_insights: [
//       `DPR length classified as: ${complexity}`,
//       "Technical feasibility appears reasonable based on available details.",
//       "No major structural inconsistencies detected in report.",
//     ],

//     suggestions: [
//       "Add risk assessment and mitigation section.",
//       "Include sustainability or scalability projections.",
//       "Cross-verify cost distribution against industry norms.",
//     ],
//   };
// }

module.exports = {
  async uploadDPR(req, res) {
    try {
      const { originalname, path } = req.file || {};
      const dpr = new Dpr({ filename: originalname, status: 'processing' });
      await dpr.save();

      // Text extraction from PDF
      const textResults = await textService.analyzeTextFromFile(path);
      // Image analysis placeholder (could be extended to parse embedded images)
      const imageResults = await imageService.analyzeImageFromPath(path);

      // Combine features and run risk prediction
      const features = { ...textResults.features, ...imageResults.features };
      const risk = await mlService.predictRisk(features);

      dpr.analysis = { text: textResults, image: imageResults, risk };
      // Add top-level decision fields for easier frontend binding
      dpr.status = 'done';
      dpr.decision = risk.decision;
      dpr.riskLevel = risk.level;
      dpr.overallScore = Math.round(((textResults.score || 0) + (imageResults.score || 0)) / 2 * 100);
      dpr.feedback = (risk.reasons || []).join('; ');
      await dpr.save();

      res.json(dpr);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to process DPR' });
    }
  },

  async getDprById(req, res) {
    const dpr = await Dpr.findById(req.params.id);
    if (!dpr) return res.status(404).json({ error: 'Not found' });
    res.json(dpr);
  },

  async submitFeedback(req, res) {
    const { feedback } = req.body;
    const dpr = await Dpr.findById(req.params.id);
    if (!dpr) return res.status(404).json({ error: 'Not found' });
    dpr.feedback = feedback;
    await dpr.save();
    res.json({ success: true });
  },

   async handleDPR(req, res) {
    console.log("Incoming DPR analyze request:", req.body);
    try {
      const { dprText, structuredFields } = req.body;
      if (!dprText) throw new Error("Missing DPR text");

      // ✅ Call the GenAI API service
      const analysis = await analyzeDPR(dprText, structuredFields);

      res.json({ success: true, analysis });
    } catch (err) {
      console.error("DPR analyze error:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
};