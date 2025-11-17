// backend/src/controllers/mlController.js

exports.predictRisk = async (req, res) => {
    try {
        // your logic here
        res.json({ message: "Prediction done" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.trainModel = async (req, res) => {
    try {
        // your training logic here
        res.json({ message: "Training started" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
