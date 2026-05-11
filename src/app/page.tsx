"use client";

import React, { useState } from 'react';
import axios from 'axios';
import RoadmapGraph from '@/components/RoadmapGraph';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) return;

    setLoading(true);
    setError('');
    setData(null);

    try {
      const response = await axios.get('/api/roadmap', {
        params: { topic },
        headers: { 'x-goog-api-key': apiKey }
      });
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate roadmap');
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
        <form className="search-form" onSubmit={handleGenerate}>
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
        </form>

        {error && <div className="error-message">{error}</div>}

        <div className="graph-wrapper">
          {data ? (
            <RoadmapGraph data={data} />
          ) : (
            <div className="placeholder">
              {loading ? 'Consulting the experts...' : 'Search for a topic to visualize your learning path.'}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
