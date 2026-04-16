import React from 'react';

const DonutChartWidget = ({ tickets }) => {
  // Aggregate data
  const stats = tickets.reduce(
    (acc, t) => {
      if (t.status === 'Open') acc.open++;
      else if (t.status === 'In progress') acc.inProgress++;
      else if (t.status === 'Assigned') acc.assigned++;
      return acc;
    },
    { open: 0, inProgress: 0, assigned: 0 }
  );

  const total = stats.open + stats.inProgress + stats.assigned;

  // Chart parameters
  const strokeWidth = 14;
  const radius = 50;
  const circumference = 2 * Math.PI * radius; // ~314.159

  const calcDash = (value) => {
    return `${(value / total) * circumference} ${circumference}`;
  };

  const segments = [
    { label: 'Opened', value: stats.open, color: '#22c55e', bg: '#dcfce7' },
    { label: 'In Progress', value: stats.inProgress, color: '#f59e0b', bg: '#fef3c7' },
    { label: 'Assigned', value: stats.assigned, color: '#3b82f6', bg: '#dbeafe' }
  ];

  return (
    <div className="ds-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, marginBottom: 24 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h2 className="ds-card-title">Active Ticket Status Breakdown</h2>
        <p style={{ fontSize: '0.78rem', color: '#9CA3AF', marginTop: -8, marginBottom: 16 }}>
          Real-time overview of current outstanding support requests.
        </p>

        <div style={{ display: 'flex', gap: 24 }}>
          {segments.map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '1rem', flexShrink: 0,
                backgroundColor: s.bg, color: s.color
              }}>
                {s.value}
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', lineHeight: 1.2 }}>{s.label}</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
                  {total > 0 ? Math.round((s.value / total) * 100) : 0}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SVG Donut Chart */}
      <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
        {total === 0 ? (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', color: '#9CA3AF', fontWeight: 500 }}>
            No Data
          </div>
        ) : (
          <svg width="100%" height="100%" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background ring */}
            <circle cx="60" cy="60" r={radius} fill="none" stroke="#F3F4F6" strokeWidth={strokeWidth} />

            {stats.open > 0 && (
              <circle
                cx="60" cy="60" r={radius} fill="none" stroke="#22c55e" strokeWidth={strokeWidth} strokeLinecap="round"
                strokeDasharray={calcDash(stats.open)} strokeDashoffset={0}
              />
            )}

            {stats.inProgress > 0 && (
              <circle
                cx="60" cy="60" r={radius} fill="none" stroke="#f59e0b" strokeWidth={strokeWidth} strokeLinecap="round"
                strokeDasharray={calcDash(stats.inProgress)} strokeDashoffset={-(stats.open / total) * circumference}
              />
            )}

            {stats.assigned > 0 && (
              <circle
                cx="60" cy="60" r={radius} fill="none" stroke="#3b82f6" strokeWidth={strokeWidth} strokeLinecap="round"
                strokeDasharray={calcDash(stats.assigned)} strokeDashoffset={-((stats.open + stats.inProgress) / total) * circumference}
              />
            )}
          </svg>
        )}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#111827', lineHeight: 1 }}>{total}</span>
          <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2 }}>Tickets</span>
        </div>
      </div>
    </div>
  );
};

export default DonutChartWidget;
