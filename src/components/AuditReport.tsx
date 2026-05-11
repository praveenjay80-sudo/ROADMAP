import React from 'react';

interface GapAnalysis {
  omissions: Array<{ title: string; reason: string }>;
  alternativePaths: Array<{ standard: string; alternative: string; note: string }>;
  researchFrontiers: string[];
}

interface CanonAssurance {
  coverageScore: string;
  corePillars: Array<{ pillar: string; coveredBy: string; status: 'verified' | 'partial' }>;
  expertConfidence: string;
}

const AuditReport: React.FC<{ gapData: GapAnalysis; assuranceData: CanonAssurance }> = ({ gapData, assuranceData }) => {
  if (!gapData && !assuranceData) return null;

  return (
    <div className="audit-report">
      {assuranceData && (
        <div className="report-section assurance-check">
          <h3>✅ Mastery Assurance Checklist</h3>
          <p className="section-intro">This checklist verifies that the roadmap covers the absolute "Pillars of the Canon" for this topic.</p>

          <div className="assurance-stats">
            <div className="stat-card">
              <span className="stat-value">{assuranceData.coverageScore}%</span>
              <span className="stat-label">Canon Coverage Score</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{assuranceData.expertConfidence}</span>
              <span className="stat-label">Curator Confidence</span>
            </div>
          </div>

          <div className="pillars-list">
            {assuranceData.corePillars.map((item, idx) => (
              <div key={idx} className={`pillar-item status-${item.status}`}>
                <div className="pillar-status">{item.status === 'verified' ? '✓' : '⚠'}</div>
                <div className="pillar-content">
                  <strong>{item.pillar}</strong>
                  <span>Covered by: {item.coveredBy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {gapData && (
        <>
          <div className="report-section">
            <h3>🔍 Significant Omissions</h3>
            <p className="section-intro">These works are notable but were excluded from the main graph to maintain clarity or reduce redundancy.</p>
            <div className="report-grid">
              {gapData.omissions.map((item, idx) => (
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
              {gapData.alternativePaths.map((item, idx) => (
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
              {gapData.researchFrontiers.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default AuditReport;
