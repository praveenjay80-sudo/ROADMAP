import React from 'react';

interface GapAnalysis {
  omissions: Array<{ title: string; reason: string }>;
  alternativePaths: Array<{ standard: string; alternative: string; note: string }>;
  researchFrontiers: string[];
}

const AuditReport: React.FC<{ data: GapAnalysis }> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="audit-report">
      <div className="report-section">
        <h3>🔍 Significant Omissions</h3>
        <p className="section-intro">These works are notable but were excluded from the main graph to maintain clarity or reduce redundancy.</p>
        <div className="report-grid">
          {data.omissions.map((item, idx) => (
            <div key={idx} className="report-item">
              <strong>{item.title}</strong>
              <span>{item.reason}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="report-section">
        <h3>🛤️ Alternative Pedagogical Paths</h3>
        <p className="section-intro">Depending on your background (e.g., Physics vs. Math), you might prefer these alternatives.</p>
        <div className="report-grid">
          {data.alternativePaths.map((item, idx) => (
            <div key={idx} className="report-item">
              <div className="alt-swap">
                <span className="alt-from">{item.standard}</span>
                <span className="alt-arrow">→</span>
                <span className="alt-to">{item.alternative}</span>
              </div>
              <span>{item.note}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="report-section">
        <h3>🚀 Ultra-Niche Research Frontiers</h3>
        <p className="section-intro">Cutting-edge areas currently active in journals that are beyond the scope of a general roadmap.</p>
        <ul className="frontier-list">
          {data.researchFrontiers.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AuditReport;
