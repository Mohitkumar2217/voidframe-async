import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';

// Top navigation bar used across the site. Uses React Router `Link` for client-side navigation.
export default function Navbar() {
  const navigate = useNavigate();
  function handleLogout() {
    navigate('/');
  }

  return (
    <nav className="site-nav" role="navigation" aria-label="Main navigation">
      <div className="container nav-row" style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:20}}>
        <div className="nav-left" style={{display:'flex', alignItems:'center', gap:12}}>
          {/* Ministry logo (place at frontend/public/images/ministry-logo.png) */}
          <Link to="/" aria-label="Ministry Home">
            <img src="..ministry_logo" alt="Ministry logo" className="ministry-logo" />
          </Link>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/dpr" className="nav-link">DPRs</Link>
        </div>

        <div className="nav-center" style={{textAlign:'center'}}>
          <Link to="/" className="brand" style={{textDecoration:'none', display:'inline-flex', alignItems:'center', gap:12}}>
            <span className="logo" aria-hidden="true" style={{display:'inline-block', width:44, height:28, background: 'linear-gradient(90deg, var(--accent), var(--accent-2))', borderRadius:6}}></span>
            <div style={{display:'flex', flexDirection:'column', lineHeight:1}}>
              <span style={{color:'var(--accent)', fontWeight:700}}>AI-Powered DPR Assessment</span>
              <small style={{color:'var(--muted)'}}>Quality Review & Risk Prediction</small>
            </div>
          </Link>
        </div>

        <div className="nav-right" style={{display:'flex', alignItems:'center', gap:12}}>
          <input aria-label="Search" placeholder="Search DPRs" className="search-input" style={{padding:'8px 10px', borderRadius:6, border:'1px solid var(--border)'}} />
          <LanguageSelector />
          <button onClick={handleLogout} className="btn btn-ghost" aria-label="Logout">Logout</button>
        </div>
      </div>
    </nav>
  );
}
