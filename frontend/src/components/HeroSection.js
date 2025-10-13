import React from 'react';
import StartButton from './StartButton';

// HeroSection: refined formal hero with concise copy and CTA
export default function HeroSection({ onStart }) {
  return (
    <section className="hero-formal py-16" aria-labelledby="hero-heading">
      <div className="max-w-6xl mx-auto px-4">
        <div className="hero-inner" style={{display:'flex', alignItems:'center', gap:36, flexWrap:'wrap'}}>
          <div style={{flex:'1 1 480px'}}>
            <h1 id="hero-heading" className="hero-title" style={{fontSize:32, margin:0}}>DPR Assessment — Clear, Accurate, Trusted</h1>
            <p className="hero-sub" style={{marginTop:10, color:'var(--muted)'}}>Upload daily progress reports and get automated extraction, checks, and an evidence-backed risk score to prioritise action.</p>

            <div style={{marginTop:18, display:'flex', gap:12}}>
              <StartButton onClick={onStart} />
              <a href="/dashboard" className="btn btn-ghost" style={{alignSelf:'center'}}>Open Dashboard</a>
            </div>
          </div>

          <aside style={{width:340}} aria-hidden="true">
            <div className="card card-surface" style={{padding:16}}>
              <h4 style={{margin:0, marginBottom:8, fontWeight:700}}>Recent DPRs</h4>
              <ul style={{margin:0, padding:0, listStyle:'none', display:'grid', gap:8}}>
                <li className="chip">Site A — 3 flags</li>
                <li className="chip">Site B — 1 flag</li>
                <li className="chip">Site C — No flags</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
