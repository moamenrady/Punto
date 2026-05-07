import React, { useState, useEffect, useMemo } from 'react';
import '../reports.css';
import { analyticsService } from '../services/analyticsService';

// ── Helpers ──
const DONUT_COLORS = ['#534AB7','#8A9FE8','#3ECFAA','#F59E0B','#EF4444','#8B5CF6','#EC4899'];
const DAY_LABELS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const Spinner = () => (
  <div className="rpt-spinner-container">
    <div className="rpt-spinner" />
    <p style={{ color:'#9CA3AF', fontSize:'0.875rem' }}>Loading…</p>
  </div>
);

const EmptyState = ({ icon = '📭', title, sub }) => (
  <div className="rpt-empty">
    <div className="rpt-empty-icon">{icon}</div>
    <p className="rpt-empty-title">{title}</p>
    {sub && <p className="rpt-empty-sub">{sub}</p>}
  </div>
);

const KpiCard = ({ icon, bg, label, value, sub }) => (
  <div className="rpt-card">
    <div className="rpt-kpi">
      <div className="rpt-kpi-icon" style={{ background: bg }}>{icon}</div>
      <div>
        <p className="rpt-card-title">{label}</p>
        <p className="rpt-card-value">{value}</p>
        {sub && <p className="rpt-card-sub">{sub}</p>}
      </div>
    </div>
  </div>
);

// SVG Donut
const DonutChart = ({ data = [], size = 140 }) => {
  const total = data.reduce((a, d) => a + d.value, 0);
  if (!total) return null;
  const r = 50, cx = 60, cy = 60, C = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="rpt-donut-container">
      <svg width={size} height={size} viewBox="0 0 120 120">
        {data.map((d, i) => {
          const pct = d.value / total;
          const dash = pct * C;
          const o = offset;
          offset += dash;
          return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={DONUT_COLORS[i % DONUT_COLORS.length]}
            strokeWidth="18" strokeDasharray={`${dash} ${C - dash}`} strokeDashoffset={-o}
            style={{ transition:'stroke-dasharray .8s ease, stroke-dashoffset .8s ease' }} />;
        })}
        <text x={cx} y={cy} textAnchor="middle" dy="0.35em" style={{ fontSize:'1rem', fontWeight:800, fill:'#111827' }}>{total}</text>
      </svg>
      <div className="rpt-donut-legend">
        {data.map((d, i) => (
          <div key={i} className="rpt-donut-legend-item">
            <span className="rpt-donut-legend-dot" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
            {d.label}: {d.value} ({total ? Math.round(d.value/total*100) : 0}%)
          </div>
        ))}
      </div>
    </div>
  );
};

// Bar Chart
const BarChart = ({ data = [], color = '#534AB7', maxH = 140 }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="rpt-bar-chart" style={{ height: maxH }}>
      {data.map((d, i) => (
        <div key={i} className="rpt-bar-wrapper" title={`${d.label}: ${d.value}`}>
          <span className="rpt-bar-value">{d.value}</span>
          <div className="rpt-bar" style={{ height: `${(d.value / max) * 100}%`, background: color }} />
          <span className="rpt-bar-label">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

const RiskBadge = ({ level }) => {
  const cls = level === 'CRITICAL' ? 'rpt-badge-critical' : level === 'HIGH' ? 'rpt-badge-high' : level === 'MOD' ? 'rpt-badge-mod' : 'rpt-badge-ok';
  return <span className={`rpt-badge ${cls}`}>{level}</span>;
};

// ── TABS ──
const TABS = [
  { key: 'overview', label: '📊 Overview' },
  { key: 'users', label: '👤 Users' },
  { key: 'tickets', label: '🎫 Tickets' },
  { key: 'work', label: '⚙️ Work & Activity' },
  { key: 'shifts', label: '📅 Shifts' },
  { key: 'sprints', label: '🚀 Sprints' },
];

// ═══════════════════════════════════════════════
// Main Page
// ═══════════════════════════════════════════════
const ReportsPage = ({ user }) => {
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [cache, setCache] = useState({});

  const isAdmin = user?.role === 'admin' || user?.role === 'manager';

  // Fetch helper with cache
  const fetchData = async (key, fn) => {
    if (cache[key] !== undefined) return cache[key];
    try {
      setLoading(true);
      const data = await fn();
      setCache(prev => ({ ...prev, [key]: data }));
      return data;
    } catch (e) {
      console.error(`Analytics fetch [${key}]:`, e);
      setCache(prev => ({ ...prev, [key]: null }));
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch on tab change
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (tab === 'overview') {
          await Promise.all([
            fetchData('globalKpis', analyticsService.getGlobalKPIs),
            fetchData('ticketKpis', analyticsService.getTicketKPIs),
            fetchData('demographics', analyticsService.getDemographics),
          ]);
        } else if (tab === 'users') {
          await Promise.all([
            fetchData('demographics', analyticsService.getDemographics),
            fetchData('growth', analyticsService.getGrowthTrend),
            fetchData('churn', analyticsService.getChurnRiskList),
          ]);
        } else if (tab === 'tickets') {
          await Promise.all([
            fetchData('weeklyTrends', analyticsService.getWeeklyTrends),
            fetchData('categories', analyticsService.getTicketsByCategory),
            fetchData('resolution', analyticsService.getResolutionAnalytics),
          ]);
        } else if (tab === 'work') {
          await Promise.all([
            fetchData('heatmap', analyticsService.getActivityHeatmap),
            fetchData('teamOutput', analyticsService.getTeamOutput),
            fetchData('workload', analyticsService.getMemberWorkload),
          ]);
        } else if (tab === 'shifts') {
          await Promise.all([
            fetchData('attendance', analyticsService.getAttendanceTrend),
          ]);
        } else if (tab === 'sprints') {
          await Promise.all([
            fetchData('sprintOverview', analyticsService.getSprintStatusOverview),
            fetchData('globalKpis', analyticsService.getGlobalKPIs),
          ]);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [tab]);

  if (!isAdmin) {
    return (
      <div className="rpt-page">
        <EmptyState icon="🔒" title="Access Restricted" sub="Reports & Analytics is available for admin and manager roles only." />
      </div>
    );
  }

  // ── Tab Renderers ──
  const renderOverview = () => {
    const gk = cache.globalKpis;
    const tk = cache.ticketKpis;
    const demo = cache.demographics;
    return (
      <>
        <div className="rpt-section">
          <h3 className="rpt-section-title">🚀 Sprint KPIs</h3>
          <div className="rpt-grid rpt-grid-4">
            <KpiCard icon="⚡" bg="#EDE9FE" label="Avg Velocity" value={gk?.avgVelocity ?? '—'} />
            <KpiCard icon="✅" bg="#D1FAE5" label="Completion Rate" value={gk?.completionRate ?? '—'} />
            <KpiCard icon="🏃" bg="#DBEAFE" label="Active Sprints" value={gk?.activeSprints ?? 0} />
            <KpiCard icon="📋" bg="#FEF3C7" label="Backlog Tasks" value={gk?.backlogTasks ?? 0} />
          </div>
        </div>
        <div className="rpt-section">
          <h3 className="rpt-section-title">🎫 Ticket KPIs</h3>
          <div className="rpt-grid rpt-grid-4">
            <KpiCard icon="📬" bg="#FEF3C7" label="Open Tickets" value={tk?.openTickets ?? 0} />
            <KpiCard icon="🔥" bg="#FEE2E2" label="Critical" value={tk?.criticalTickets ?? 0} />
            {tk?.statusDistribution?.map((s, i) => (
              <KpiCard key={i} icon="📌" bg="#EEF1FD" label={s._id || 'Unknown'} value={s.count} />
            ))}
          </div>
        </div>
        {demo && (
          <div className="rpt-section">
            <h3 className="rpt-section-title">👤 User Demographics</h3>
            <div className="rpt-grid rpt-grid-2">
              <div className="rpt-card">
                <p className="rpt-card-title">Total Users</p>
                <p className="rpt-card-value">{demo.totalUsers}</p>
              </div>
              <div className="rpt-card">
                <p className="rpt-card-title">Role Distribution</p>
                <DonutChart data={(demo.roleDistribution || []).map(r => ({ label: r.role, value: r.count }))} />
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  const renderUsers = () => {
    const demo = cache.demographics;
    const growth = cache.growth;
    const churn = cache.churn;
    return (
      <>
        {demo && (
          <div className="rpt-section">
            <h3 className="rpt-section-title">👥 Role Distribution</h3>
            <div className="rpt-grid rpt-grid-2">
              <div className="rpt-card">
                <p className="rpt-card-title">Total Users</p>
                <p className="rpt-card-value">{demo.totalUsers}</p>
              </div>
              <div className="rpt-card">
                <p className="rpt-card-title">Roles</p>
                <DonutChart data={(demo.roleDistribution || []).map(r => ({ label: r.role, value: r.count }))} />
              </div>
            </div>
          </div>
        )}
        {growth && growth.length > 0 && (
          <div className="rpt-section">
            <h3 className="rpt-section-title">📈 User Growth Trend</h3>
            <div className="rpt-card">
              <BarChart data={growth.map(g => ({ label: g.period, value: g.newUsers }))} color="#534AB7" />
            </div>
          </div>
        )}
        {churn && churn.length > 0 && (
          <div className="rpt-section">
            <h3 className="rpt-section-title">⚠️ Churn Risk (Inactive 14+ days)</h3>
            <div className="rpt-card" style={{ overflowX: 'auto' }}>
              <table className="rpt-table">
                <thead>
                  <tr><th>ID</th><th>Name</th><th>Tasks</th><th>Days Inactive</th><th>Risk %</th><th>Level</th></tr>
                </thead>
                <tbody>
                  {churn.map((u, i) => (
                    <tr key={i}>
                      <td style={{ fontFamily:'monospace', fontSize:'0.75rem' }}>{u.custom_id}</td>
                      <td style={{ fontWeight:600 }}>{u.name}</td>
                      <td>{u.taskCount}</td>
                      <td>{u.daysInactive}d</td>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <div className="rpt-progress-track" style={{ width:80 }}>
                            <div className="rpt-progress-fill" style={{ width:`${u.riskScorePercentage}%`, background: u.riskScorePercentage >= 80 ? '#EF4444' : '#F59E0B' }} />
                          </div>
                          <span style={{ fontSize:'0.75rem', fontWeight:700 }}>{u.riskScorePercentage}%</span>
                        </div>
                      </td>
                      <td><RiskBadge level={u.riskLevel} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {(!churn || churn.length === 0) && !loading && (
          <div className="rpt-card"><EmptyState icon="🎉" title="No churn risk" sub="All users have been active recently" /></div>
        )}
      </>
    );
  };

  const renderTickets = () => {
    const trends = cache.weeklyTrends;
    const cats = cache.categories;
    const res = cache.resolution;
    return (
      <>
        {trends && (
          <div className="rpt-section">
            <h3 className="rpt-section-title">📈 Weekly Ticket Trends</h3>
            <div className="rpt-grid rpt-grid-2">
              <div className="rpt-card">
                <p className="rpt-card-title">Opened Per Week</p>
                <BarChart data={(trends.openedPerWeek || []).slice(-12).map(w => ({ label: `W${w._id?.week}`, value: w.count }))} color="#534AB7" />
              </div>
              <div className="rpt-card">
                <p className="rpt-card-title">Resolved Per Week</p>
                <BarChart data={(trends.resolvedPerWeek || []).slice(-12).map(w => ({ label: `W${w._id?.week}`, value: w.count }))} color="#3ECFAA" />
              </div>
            </div>
          </div>
        )}
        {cats && cats.length > 0 && (
          <div className="rpt-section">
            <h3 className="rpt-section-title">📂 Tickets by Category</h3>
            <div className="rpt-card">
              <DonutChart data={cats.map(c => ({ label: c.category, value: c.count }))} />
            </div>
          </div>
        )}
        {res && (
          <div className="rpt-section">
            <h3 className="rpt-section-title">⏱️ Resolution Analytics</h3>
            <div className="rpt-grid rpt-grid-2">
              <div className="rpt-card">
                <p className="rpt-card-title">Overall Avg Resolution</p>
                <p className="rpt-card-value">{res.overallAverageHours}h</p>
              </div>
              <div className="rpt-card" style={{ overflowX:'auto' }}>
                <p className="rpt-card-title">By Priority</p>
                <table className="rpt-table">
                  <thead><tr><th>Priority</th><th>Avg Hours</th><th>Tickets</th></tr></thead>
                  <tbody>
                    {(res.breakdownByPriority || []).map((r, i) => (
                      <tr key={i}><td style={{ fontWeight:600, textTransform:'capitalize' }}>{r.priority}</td><td>{r.avgResolutionHours}h</td><td>{r.ticketCount}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  const renderWork = () => {
    const heatmap = cache.heatmap;
    const teamOut = cache.teamOutput;
    const workload = cache.workload;
    return (
      <>
        {heatmap && (
          <div className="rpt-section">
            <h3 className="rpt-section-title">🗓️ Activity Heatmap</h3>
            <div className="rpt-grid rpt-grid-2">
              <div className="rpt-card">
                <p className="rpt-card-title">By Hour of Day</p>
                <BarChart data={(heatmap.byTimeOfDay || []).map(h => ({ label: `${h._id}:00`, value: h.activityCount }))} color="#8A9FE8" />
              </div>
              <div className="rpt-card">
                <p className="rpt-card-title">By Day of Week</p>
                <BarChart data={(heatmap.byDayOfWeek || []).map(d => ({ label: DAY_LABELS[d._id - 1] || d._id, value: d.activityCount }))} color="#3ECFAA" />
              </div>
            </div>
          </div>
        )}
        {teamOut && teamOut.length > 0 && (
          <div className="rpt-section">
            <h3 className="rpt-section-title">🏆 Team Output Comparison</h3>
            <div className="rpt-card" style={{ overflowX:'auto' }}>
              <table className="rpt-table">
                <thead><tr><th>Team</th><th>Tasks Completed</th><th>Hours Logged</th></tr></thead>
                <tbody>
                  {teamOut.map((t, i) => (
                    <tr key={i}><td style={{ fontWeight:600 }}>{t.teamName}</td><td>{t.tasksCompleted}</td><td>{t.hoursLogged}h</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {workload && workload.length > 0 && (
          <div className="rpt-section">
            <h3 className="rpt-section-title">🔥 Member Workload & Burnout Risk</h3>
            <div className="rpt-card" style={{ overflowX:'auto' }}>
              <table className="rpt-table">
                <thead><tr><th>Name</th><th>Tasks</th><th>Hours</th><th>Burnout</th><th>Risk</th></tr></thead>
                <tbody>
                  {workload.map((m, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight:600 }}>{m.name}</td>
                      <td>{m.tasksCount}</td>
                      <td>{m.hoursLogged}h</td>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <div className="rpt-progress-track" style={{ width:80 }}>
                            <div className="rpt-progress-fill" style={{ width:`${m.burnoutPercentage}%`, background: m.burnoutPercentage >= 80 ? '#EF4444' : m.burnoutPercentage >= 50 ? '#F59E0B' : '#3ECFAA' }} />
                          </div>
                          <span style={{ fontSize:'0.75rem', fontWeight:700 }}>{m.burnoutPercentage}%</span>
                        </div>
                      </td>
                      <td><RiskBadge level={m.riskLevel} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {(!heatmap && !teamOut?.length && !workload?.length) && !loading && (
          <div className="rpt-card"><EmptyState icon="📭" title="No work data yet" sub="Work activity data will appear once tasks are tracked" /></div>
        )}
      </>
    );
  };

  const renderShifts = () => {
    const att = cache.attendance;
    return (
      <>
        {att && att.length > 0 ? (
          <div className="rpt-section">
            <h3 className="rpt-section-title">📊 Weekly Attendance Trend</h3>
            <div className="rpt-card">
              <BarChart data={att.map(a => ({ label: a.week, value: a.presentPercentage }))} color="#3ECFAA" maxH={180} />
              <p className="rpt-card-sub" style={{ marginTop:12, textAlign:'center' }}>Attendance % per week</p>
            </div>
          </div>
        ) : !loading ? (
          <div className="rpt-card"><EmptyState icon="📅" title="No shift data" sub="Shift attendance will appear once schedules are created" /></div>
        ) : null}
      </>
    );
  };

  const renderSprints = () => {
    const overview = cache.sprintOverview;
    const gk = cache.globalKpis;
    return (
      <>
        {gk && (
          <div className="rpt-section">
            <h3 className="rpt-section-title">📊 Global Sprint KPIs</h3>
            <div className="rpt-grid rpt-grid-4">
              <KpiCard icon="⚡" bg="#EDE9FE" label="Avg Velocity" value={gk.avgVelocity ?? '—'} />
              <KpiCard icon="✅" bg="#D1FAE5" label="Completion Rate" value={gk.completionRate ?? '—'} />
              <KpiCard icon="🏃" bg="#DBEAFE" label="Active Sprints" value={gk.activeSprints ?? 0} />
              <KpiCard icon="📋" bg="#FEF3C7" label="Backlog Tasks" value={gk.backlogTasks ?? 0} />
            </div>
          </div>
        )}
        {overview && overview.length > 0 && (
          <div className="rpt-section">
            <h3 className="rpt-section-title">🏁 Sprint Status Overview</h3>
            <div className="rpt-card" style={{ overflowX:'auto' }}>
              <table className="rpt-table">
                <thead><tr><th>Sprint</th><th>Total Tasks</th><th>Status Breakdown</th></tr></thead>
                <tbody>
                  {overview.map((s, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight:600 }}>{s.sprintName}</td>
                      <td>{s.totalTasks}</td>
                      <td>
                        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                          {(s.statuses || []).map((st, j) => {
                            const bg = st.status === 'completed' ? '#D1FAE5' : st.status === 'in_progress' ? '#FEF3C7' : '#EEF1FD';
                            const color = st.status === 'completed' ? '#059669' : st.status === 'in_progress' ? '#D97706' : '#534AB7';
                            return <span key={j} className="rpt-badge" style={{ background:bg, color }}>{st.status}: {st.count}</span>;
                          })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {(!overview || overview.length === 0) && !loading && (
          <div className="rpt-card"><EmptyState icon="🚀" title="No sprint data" sub="Sprint analytics will appear once sprints are created" /></div>
        )}
      </>
    );
  };

  const renderTab = () => {
    if (loading && Object.keys(cache).length === 0) return <Spinner />;
    switch (tab) {
      case 'overview': return renderOverview();
      case 'users': return renderUsers();
      case 'tickets': return renderTickets();
      case 'work': return renderWork();
      case 'shifts': return renderShifts();
      case 'sprints': return renderSprints();
      default: return null;
    }
  };

  return (
    <div className="rpt-page">
      <div className="rpt-header">
        <div>
          <h1>Reports & Analytics</h1>
          <p>Comprehensive insights across your organization</p>
        </div>
      </div>

      <div className="rpt-tabs">
        {TABS.map(t => (
          <button key={t.key} className={`rpt-tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {loading && Object.keys(cache).length > 0 && (
        <div style={{ display:'flex', justifyContent:'center', marginBottom:16 }}>
          <div className="rpt-spinner" style={{ width:20, height:20, borderWidth:2 }} />
        </div>
      )}

      {renderTab()}
    </div>
  );
};

export default ReportsPage;
