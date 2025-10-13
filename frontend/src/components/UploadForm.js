import React, { useState } from "react";
import { CloudUpload } from "lucide-react";

// DPRCard: reusable card to display a DPR summary and quick actions
function DPRCard({ dpr, onView }) {
  const pct = Math.round(dpr.overallScore ?? dpr.score ?? 0);
  const riskClass = (dpr.riskLevel || dpr.risk || "low").toLowerCase();

  return (
    <div
      className={`border rounded-2xl shadow-md p-4 flex flex-col gap-3 transition-all hover:shadow-lg hover:-translate-y-1 ${riskClass}`}
    >
      <div className="flex justify-between items-center">
        <div className="font-semibold">{dpr.title || dpr.filename}</div>
        <div className="font-bold text-blue-600">{pct}%</div>
      </div>
      <div className="text-sm text-gray-600">
        {dpr.site} • {dpr.author} • <small className="text-gray-400">{dpr.date}</small>
      </div>
      <div className="font-medium">Decision: <strong style={{ textTransform: "capitalize" }}>{dpr.decision || "review"}</strong></div>
      <p className="text-gray-500">{(dpr.feedback && dpr.feedback[0]) || dpr.feedback || "No quick feedback"}</p>
      <div className="flex gap-2 mt-2">
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-all"
          onClick={() => onView && onView(dpr)}
        >
          View
        </button>
        <button className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition-all">Feedback</button>
      </div>
    </div>
  );
}

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(null);
  const [dprList, setDprList] = useState([]);

  function submit(e) {
    e.preventDefault();
    if (!file) return alert("Please select a PDF file");

    setLoading(true);
    setPopup({ analyzing: true });

    setTimeout(() => {
      const completeness = Math.floor(Math.random() * 101); // 0-100%
      const riskLevels = ["Low", "Medium", "High"];
      const risk = riskLevels[Math.floor(Math.random() * riskLevels.length)];

      const newDPR = {
        title,
        filename: file.name,
        completeness,
        risk,
        date: new Date().toLocaleDateString(),
        score: completeness,
        overallScore: completeness,
        feedback: ["Auto-analysis completed"],
        author: "AI",
        site: "Project DPR",
        decision: risk === "High" ? "Review" : "Approved",
      };

      setDprList((prev) => [newDPR, ...prev]);
      setPopup({ analyzing: false, ...newDPR });
      setLoading(false);
      setTitle("");
      setFile(null);
    }, 2000);
  }

  return (
    <>
      {/* Upload Form */}
      <form
        onSubmit={submit}
        encType="multipart/form-data"
        className="upload-card max-w-md mx-auto rounded-2xl shadow-md border border-gray-100 bg-white/10 backdrop-blur-sm p-8 flex flex-col gap-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <div className="p-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 shadow-md text-white">
            <CloudUpload size={26} />
          </div>
          <h2 className="text-xl font-semibold text-white tracking-tight">
            Upload DPR for Analysis
          </h2>
          <p className="text-sm text-gray-200 text-center">
            Upload your project DPR (PDF). The system will extract and evaluate content automatically.
          </p>
        </div>

        {/* Title Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-gray-200 text-sm font-medium">Project Name</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Project name (DPR NAME)"
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-gray-800 placeholder-gray-400"
          />
        </div>

        {/* File Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-gray-200 text-sm font-medium">PDF File</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-gray-800"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`mt-2 flex items-center justify-center gap-2 rounded-xl py-2.5 font-semibold text-white shadow-md transition-all ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 hover:shadow-lg"
          }`}
        >
          {loading ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              Analyzing...
            </>
          ) : (
            <>
              <CloudUpload size={18} />
              Upload & Analyze
            </>
          )}
        </button>

        <p className="text-xs text-gray-400 text-center">
          🔒 Files are processed securely and stored for analysis.
        </p>
      </form>

      {/* Popup */}
      {popup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl flex flex-col gap-6 relative">
            {popup.analyzing ? (
              <>
                <h3 className="text-xl font-semibold text-gray-800 text-center">
                  Analyzing Project...
                </h3>
                <p className="text-gray-600 text-center">
                  Fetching NLP and ML models.
                </p>
                <div className="flex justify-center mt-4">
                  <span className="animate-spin rounded-full h-12 w-12 border-4 border-b-4 border-blue-600"></span>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-gray-800 text-center">
                  Project Analysis
                </h3>

                {/* Completeness Circle */}
                <div className="flex justify-center my-4">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        className="text-gray-200"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="48"
                        cx="64"
                        cy="64"
                      />
                      <circle
                        className="text-blue-600"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 48}
                        strokeDashoffset={2 * Math.PI * 48 * (1 - popup.completeness / 100)}
                        stroke="currentColor"
                        fill="transparent"
                        r="48"
                        cx="64"
                        cy="64"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-gray-800">{popup.completeness}%</span>
                      <span className="text-sm text-gray-500">Completeness</span>
                    </div>
                  </div>
                </div>

                {/* Risk Histogram */}
                <div className="flex flex-col gap-3 mt-4">
                  <p className="text-gray-700 font-medium text-center">Risk Histogram</p>
                  <div className="flex justify-around items-end h-40 gap-6 border-b border-gray-300 relative">
                    {["Low", "Medium", "High"].map((level) => {
                      const value = popup.risk === level ? 71.45 : 0;
                      const color =
                        level === "High"
                          ? "bg-red-600"
                          : level === "Medium"
                          ? "bg-yellow-400"
                          : "bg-green-600";
                      return (
                        <div key={level} className="flex flex-col items-center h-full">
                          <div className="flex flex-col justify-end h-full w-10">
                            <div
                              className={`${color} rounded-t-lg transition-all duration-700 ease-out`}
                              style={{ height: `${value}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-semibold text-gray-500 mt-1">{level}</span>
                          <span className="text-xs text-gray-500 mt-0.5">{value}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => setPopup(null)}
                  className="mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}

     {/* DPR Cards Section */}
<div className="mt-10 max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 rounded-xl">
  {dprList.map((dpr, idx) => {
    const pct = Math.round(dpr.overallScore ?? dpr.score ?? 0);
    const riskClass = (dpr.riskLevel || dpr.risk || 'low').toLowerCase();

    return (
      <div
        key={idx}
        className={`card dpr-card ${riskClass} border rounded-xl shadow-md p-4 flex flex-col gap-3 transition-all hover:shadow-lg hover:-translate-y-1`}
      >
        <div className="card-top flex justify-between items-center">
          <div className="file-name font-semibold">{dpr.title}</div>
          <div className="score font-bold text-blue-600">{pct}%</div>
        </div>
        <div className="card-body text-sm text-gray-600">
          <div className="meta">
            {dpr.site} • {dpr.author} • <small className="muted text-gray-400">{dpr.date}</small>
          </div>
          <div className="risk font-medium">
            Decision: <strong style={{ textTransform: 'capitalize' }}>{dpr.decision || 'review'}</strong>
          </div>
          <p className="feedback text-gray-500">{(dpr.feedback && dpr.feedback[0]) || dpr.feedback || 'No quick feedback'}</p>
        </div>
        <div className="card-actions flex gap-2 mt-2">
          <button
            className="btn bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-all"
            onClick={() => alert(JSON.stringify(dpr, null, 2))}
          >
            View
          </button>
          <button className="btn ghost bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition-all">Feedback</button>
        </div>
      </div>
    );
  })}
</div>


    </>
  );
}
