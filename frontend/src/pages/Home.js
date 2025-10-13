import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';

export default function Home() {
  const navigate = useNavigate();
  function handleStart() { 
    navigate('/dashboard');
  }
  return (
    <div>
      <Navbar />
      <HeroSection onStart={handleStart} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <section className="features-grid" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px,1fr))', gap:16}}>
          <div className="card card-surface">
            <h3 style={{marginTop:0}}>Automated Extraction</h3>
            <p className="muted">OCR and structured parsing from PDFs to extract quantities and progress notes.</p>
          </div>
          <div className="card card-surface">
            <h3 style={{marginTop:0}}>NLP Quality Checks</h3>
            <p className="muted">Language-aware checks highlight inconsistencies, missing items and compliance gaps.</p>
          </div>
          <div className="card card-surface">
            <h3 style={{marginTop:0}}>Risk Scoring</h3>
            <p className="muted">A predictive model ranks DPRs by risk so teams can triage work.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
