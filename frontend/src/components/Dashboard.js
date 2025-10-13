
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import DPRCard from './DPRCard';
import DPRDetail from './DPRDetail';
import UploadForm from './UploadForm';
import DPRAnalyzer from './DPRAnalyzer';


export default function Dashboard() {
  const [dprs, setDprs] = useState([]);
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('English'); // <-- new language state
  const [offline, setOffline] = useState(false); // <-- offline toggle

  useEffect(() => {
    // lightweight health check (non-blocking)
    axios.get('/api/health')
      .then(() => { })
      .catch(() => { });

    // Mock DPR data for offline/demo use. Each DPR contains fields used by cards and detail view.
    setDprs([
      { id: '1', title: 'Road widening - Sector 7', date: '2025-09-30', author: 'Inspector A', site: 'Roadworks A', text: 'Progress report...', images: [], nlpScore: 78, imageScore: 82, overallScore: 80, riskLevel: 'Low', decision: 'approve', feedback: ['Complete budget section'] },
      { id: '2', title: 'Health centre upgrade', date: '2025-08-21', author: 'Inspector B', site: 'Health Site B', text: 'Missing attachments and sketches', images: [], nlpScore: 45, imageScore: 60, overallScore: 52, riskLevel: 'Medium', decision: 'review', feedback: ['Missing floor plans', 'Budget mismatch'] },
      { id: '3', title: 'Tourism gazebo', date: '2025-07-11', author: 'Inspector C', site: 'Tourism C', text: 'Environmental concern flagged', images: [], nlpScore: 92, imageScore: 40, overallScore: 66, riskLevel: 'High', decision: 'reject', feedback: ['Unrealistic timeline', 'Insufficient EIA'] },
      { id: '4', title: 'Bridge rehabilitation', date: '2025-10-01', author: 'Inspector D', site: 'Bridge D', text: 'All documents provided', images: [], nlpScore: 61, imageScore: 70, overallScore: 66, riskLevel: 'Medium', decision: 'review', feedback: ['Clarify material specs'] }
    ]);
  }, []);

  const filtered = dprs.filter(d => {
    const byRisk = filter === 'All' ? true : d.riskLevel === filter;
    const byQuery = query.trim() === '' ? true : (d.title + d.site + d.author + (d.text || '')).toLowerCase().includes(query.toLowerCase());
    return byRisk && byQuery;
  });

  const riskCounts = dprs.reduce((acc, d) => { acc[d.riskLevel] = (acc[d.riskLevel] || 0) + 1; return acc; }, {});
  const chartData = Object.keys(riskCounts).map(k => ({ risk: k, count: riskCounts[k] }));

  function openDetail(dpr) { setSelected(dpr); }
  function closeDetail() { setSelected(null); }
  function handleUpload(newDpr) {
    const id = String(Date.now());
    const item = { id, ...newDpr };
    setDprs(prev => [item, ...prev]);
    setShowUpload(false);
    setSelected(item);
  }

  return (
    <div className="dashboard-root">
      <div className="dashboard-header flex flex-wrap items-center justify-between gap-4">
        <div>
  <h2 className="text-3xl font-bold text-white-800">Recent DPRs</h2>
  <small className="text-lg text-white-600">AI-assisted review, quick decisions, and actionable feedback</small>
</div>


        <div className="controls flex flex-wrap items-center gap-3">
          {/* Search */}
          <input className="search border rounded px-2 py-1" placeholder="Search DPRs by title, site, author..." value={query} onChange={e => setQuery(e.target.value)} />

          {/* Risk Filter */}
          <label className="flex items-center gap-1">
            Filter:
            <select value={filter} onChange={e => setFilter(e.target.value)} className="border rounded px-1 py-1">
              <option>All</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </label>

          {/* Language Selector */}
          <label className="flex items-center gap-1">
            Language:
            <select value={language} onChange={e => setLanguage(e.target.value)} className="border rounded px-1 py-1">
              <option>English</option>
              <option>Hindi</option>
              <option>Assamese</option>
              <option>Bengali</option>
            </select>
          </label>

      {/* Offline Slider */}
<div className="flex items-center gap-2">
  <span className="text-sm text-white-700">Offline</span>
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      checked={offline}
      onChange={(e) => setOffline(e.target.checked)}
      className="sr-only peer"
    />
    {/* Track */}
    <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-all duration-300"></div>
    {/* Thumb */}
    <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-all duration-300 peer-checked:translate-x-6"></div>
  </label>
</div>


          {/* Upload Button */}
          <button className="btn bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-all" onClick={() => setShowUpload(s => !s)}>
            {showUpload ? 'Close' : 'Upload DPR'}
          </button>
        </div>
      </div>

      {showUpload && <UploadForm onUpload={handleUpload} />}

      <div className="cards-grid mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(d => (
          <DPRCard key={d.id} dpr={d} onView={() => openDetail(d)} />
        ))}

        {/* Analytics card */}
        <div className="card analytics-card border rounded p-3">
          <h3 className="font-semibold mb-2">Quality by Risk</h3>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="risk" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="count" fill="var(--accent, #3b82f6)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="analytics-footer mt-2 text-sm text-gray-500">
            <small>{dprs.length} total DPRs</small>
          </div>
        </div>
        
        {/* GENAI */}
        <div className="card analytics-card">
          <DPRAnalyzer />
        </div>
      </div>

      {selected && <DPRDetail dpr={selected} onClose={closeDetail} />}
    </div>
  );
}
