// ML routes: trigger model training / prediction endpoints
const express = require('express');
const router = express.Router();

const mlController = require('../controllers/mlController');

// POST → Run Prediction
router.post('/predict', mlController.predictRisk);

// POST → Train Model
router.post('/train', mlController.trainModel);

module.exports = router;
