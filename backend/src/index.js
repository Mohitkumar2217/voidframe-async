// Entry point for DPR Evaluator backend
// Sets up Express server, connects to MongoDB, and mounts routes

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');
const config = require('./config');

const app = express();
// app.use(cors());
app.use(cors({ origin: "http://localhost:5000" }));
app.use(bodyParser.json());
app.use(express.json());

// Mount API routes
app.use('/api', routes);

const PORT = process.env.PORT || 5000;

// Try to connect to MongoDB; if it fails, fall back to running without persistence
// mongoose.connect(process.env.MONGO_URI || config.mongoUri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
//   .then(() => {
//     console.log('Connected to MongoDB');
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch(err => {
//     console.error('Failed to connect to MongoDB, starting server without DB', err);
//     // Start server without DB - controllers should handle missing DB gracefully
//     app.listen(PORT, () => console.log(`Server running on port ${PORT} (no DB)`));
//   });
