"use client";

import React, { useState } from 'react';
import axios from 'axios';
import RoadmapGraph from '@/components/RoadmapGraph';
import AuditReport from '@/components/AuditReport';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  const [selectedRelated, setSelectedRelated] = useState('');
  const [selectedNarrow, setSelectedNarrow] = useState('');

  const handleGenerate = async (e?: React.FormEvent, overrideTopic?: string) => {
    if (e) e.preventDefault();
    const targetTopic = overrideTopic || topic;
    if (!targetTopic) return;

    setLoading(true);
    setError('');
    setData(null);
    if (!overrideTopic) {
      setTopic(targetTopic);
    }

    try {
      console.log('Requesting roadmap for:', targetTopic);
      const response = await axios.get('/api/roadmap', {
        params: { topic: targetTopic },
        headers: { 'x-goog-api-key': apiKey }
      });
      console.log('API Response received:', response.data);

      if (!response.data || !response.data.nodes || response.data.nodes.length === 0) {
        throw new Error('API returned an empty roadmap. Please try a different topic.');
      }

      setData(response.data);
      setSelectedRelated('');
      setSelectedNarrow('');
    } catch (err: any) {
      console.error('Front-end Error:', err);
      const msg = err.response?.data?.error || err.message || 'Failed to generate roadmap';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Academic Roadmap <span>Explorer</span></h1>
        <p>Seminal works, breakthroughs, and pedagogical paths for any topic.</p>
      </header>

      <main className="app-main">
        <form className="search-form" onSubmit={(e) => handleGenerate(e)}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter an academic topic (e.g., Quantum Mechanics)..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="topic-input"
            />
            <input
              type="password"
              placeholder="Google API Key (optional if set in server)..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="key-input"
            />
            <button type="submit" disabled={loading} className="generate-btn">
              {loading ? <span className="loader"></span> : 'Generate Roadmap'}
            </button>
          </div>

          {data && (
            <div className="discovery-group">
              <div className="dropdown-container">
                <label>Related Terms:</label>
                <div className="select-with-btn">
                  <select 
                    value={selectedRelated} 
                    onChange={(e) => setSelectedRelated(e.target.value)}
                    className="term-select"
                  >
                    <option value="">Select Related Term...</option>
                    {data.relatedTerms?.map((term: string) => (
                      <option key={term} value={term}>{term}</option>
                    ))}
                  </select>
                  <button 
                    type="button" 
                    onClick={() => handleGenerate(undefined, selectedRelated)}
                    disabled={!selectedRelated || loading}
                    className="pivot-btn"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div className="dropdown-container">
                <label>Narrow Terms:</label>
                <div className="select-with-btn">
                  <select 
                    value={selectedNarrow} 
                    onChange={(e) => setSelectedNarrow(e.target.value)}
                    className="term-select"
                  >
                    <option value="">Select Narrow Term...</option>
                    {data.narrowTerms?.map((term: string) => (
                      <option key={term} value={term}>{term}</option>
                    ))}
                  </select>
                  <button 
                    type="button" 
                    onClick={() => handleGenerate(undefined, selectedNarrow)}
                    disabled={!selectedNarrow || loading}
                    className="pivot-btn"
                  >
                    Generate
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
        {error && <div className="error-message">{error}</div>}

        {data && (
          <div className="nav-shortcuts">
            <button 
              onClick={() => document.getElementById('audit-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="jump-btn"
            >
              ↓ Jump to Mastery Assurance & Audit
            </button>
          </div>
        )}

        <div className="graph-wrapper">
          {data ? (
            <RoadmapGraph data={data} />
          ) : (
            <div className="placeholder">
              {loading ? 'Consulting the experts...' : 'Search for a topic to visualize your learning path.'}
            </div>
          )}
        </div>

        {data && (
          <div id="audit-section" className="audit-section-wrapper">
            <h2>🛡️ AI Audit: Mastery Assurance & Gap Analysis</h2>
            <AuditReport gapData={data.gapAnalysis} assuranceData={data.canonAssurance} />
          </div>
        )}
      </main>
    </div>
  );
}
