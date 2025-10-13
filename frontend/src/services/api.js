// Simple API client for frontend to call backend endpoints
import axios from 'axios';

const api = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000' });

export default {
  // Upload a DPR file (PDF or docx)
  async uploadDpr(formData) {
    return handle(api.post('/api/dpr/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }));
  },

  // Get DPR result by ID
  async getDpr(id) {
    return handle(api.get(`/api/dpr/${id}`));
  },

  // Direct DPR text analysis (no file)
  async analyzeText(dprText) {
    return handle(api.post('/api/dpr/analyze', { dprText }));
  },

  // ML-based feature prediction
  async predict(features) {
    return handle(api.post('/api/ml/predict', features));
  },
};
