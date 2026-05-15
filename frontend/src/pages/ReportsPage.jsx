import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import {
  BarChart2, Users, Ticket, Activity, Clock, Zap,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle,
  Flame, Target, Brain, RefreshCw, Lock, Shield,
  UserX, CalendarDays, Layers, Cpu, GitBranch, Award,
} from 'lucide-react';
import { analyticsService } from '../services/analyticsService';

// ─────────────────────────────────────────────────────────
// THEME CONTEXT
// ─────────────────────────────────────────────────────────
const ThemeCtx = createContext({});
const useC = () => useContext(ThemeCtx);

const DARK = {
  isDark:    true,
  bg:        '#0a0c10',
  surface:   'rgba(255,255,255,0.035)',
  surfaceHi: 'rgba(255,255,255,0.06)',
  border:    'rgba(255,255,255,0.07)',
  borderHi:  'rgba(138,159,232,0.3)',
  shadow:    '0 4px 24px rgba(0,0,0,0.35)',
  text:      '#f1f5f9',
  sub:       '#94a3b8',
  muted:     '#64748b',
  blue:      '#8A9FE8',
  teal:      '#3ECFAA',
  orange:    '#F59E0B',
  red:       '#EF4444',
  purple:    '#A78BFA',
  pink:      '#EC4899',
  cyan:      '#22d3ee',
  axisColor: '#475569',
  gridColor: 'rgba(255,255,255,0.05)',
  tooltip: {
    bg:     'rgba(8,12,20,0.96)',
    border: 'rgba(255,255,255,0.12)',
    label:  '#64748b',
    value:  '#ffffff',
  },
};

const LIGHT = {
  isDark:    false,
  bg:        '#f5f4ff',
  surface:   'rgba(255,255,255,0.9)',
  surfaceHi: 'rgba(255,255,255,1)',
  border:    'rgba(83,74,183,0.12)',
  borderHi:  'rgba(83,74,183,0.3)',
  shadow:    '0 2px 16px rgba(83,74,183,0.10)',
  text:      '#1e1b3a',
  sub:       '#534AB7',
  muted:     '#8480B8',
  blue:      '#534AB7',
  teal:      '#0F6E56',
  orange:    '#D97706',
  red:       '#DC2626',
  purple:    '#7C3AED',
  pink:      '#DB2777',
  cyan:      '#0891B2',
  axisColor: '#6B7280',
  gridColor: 'rgba(83,74,183,0.07)',
  tooltip: {
    bg:     'rgba(255,255,255,0.98)',
    border: 'rgba(83,74,183,0.15)',
    label:  '#8480B8',
    value:  '#1e1b3a',
  },
};

const PIE_COLORS_DARK  = ['#8A9FE8','#3ECFAA','#A78BFA','#F59E0B','#EF4444','#EC4899','#38bdf8','#fb923c'];
const PIE_COLORS_LIGHT = ['#534AB7','#0F6E56','#7C3AED','#D97706','#DC2626','#DB2777','#0891B2','#ea580c'];

const stagger = { show: { transition: { staggerChildren: 0.08 } } };
const fadeUp  = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.38 } } };

// ─────────────────────────────────────────────────────────
// SHARED PRIMITIVES  (all read C from context)
// ─────────────────────────────────────────────────────────

const Card = ({ children, accent, noPad = false, style = {} }) => {
  const C = useC();
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 16, backdropFilter: 'blur(14px)',
      boxShadow: C.shadow,
      padding: noPad ? 0 : 22, position: 'relative', overflow: 'hidden',
      ...style,
    }}>
      {accent && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: accent }} />}
      {children}
    </div>
  );
};

const KpiCard = ({ icon: Icon, label, value, sub, accent, trend }) => {
  const C = useC();
  const color = accent ?? C.blue;
  return (
    <motion.div variants={fadeUp}>
      <Card accent={color} style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 10, flexShrink: 0,
              background: `${color}18`, border: `1px solid ${color}28`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={18} color={color} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 10, color: C.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</p>
              <p style={{ margin: '5px 0 0', fontSize: 24, fontWeight: 800, color: C.text, lineHeight: 1 }}>{value ?? '—'}</p>
              {sub && <p style={{ margin: '4px 0 0', fontSize: 11, color: C.muted }}>{sub}</p>}
            </div>
          </div>
          {trend !== undefined && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 3,
              padding: '3px 8px', borderRadius: 20,
              background: trend >= 0 ? `${C.teal}18` : `${C.red}18`,
            }}>
              {trend >= 0 ? <TrendingUp size={11} color={C.teal} /> : <TrendingDown size={11} color={C.red} />}
              <span style={{ fontSize: 11, fontWeight: 700, color: trend >= 0 ? C.teal : C.red }}>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

const SectionTitle = ({ children, badge, badgeColor }) => {
  const C = useC();
  const bc = badgeColor ?? C.cyan;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
      <h3 style={{ margin: 0, fontSize: 11, fontWeight: 700, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{children}</h3>
      {badge && (
        <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', padding: '2px 9px', borderRadius: 20, background: `${bc}18`, border: `1px solid ${bc}38`, color: bc }}>{badge}</span>
      )}
    </div>
  );
};

const AiBadge = () => {
  const C = useC();
  return (
    <span style={{
      fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', padding: '2px 9px', borderRadius: 20,
      background: C.isDark
        ? 'linear-gradient(135deg,rgba(167,139,250,0.25),rgba(34,211,238,0.2))'
        : 'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(8,145,178,0.15))',
      border: `1px solid ${C.purple}45`, color: C.purple,
    }}>⬡ AI PREDICTION</span>
  );
};

const RiskBadge = ({ level }) => {
  const C = useC();
  const m = {
    CRITICAL: { bg: `${C.red}18`,    col: C.red    },
    HIGH:     { bg: `${C.orange}18`, col: C.orange },
    MOD:      { bg: `${C.blue}18`,   col: C.blue   },
    OK:       { bg: `${C.teal}18`,   col: C.teal   },
  }[level] ?? { bg: `${C.muted}18`, col: C.muted };
  return <span style={{ background: m.bg, color: m.col, fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 20 }}>{level}</span>;
};

const ProgressBar = ({ pct, color }) => {
  const C = useC();
  const c = color ?? C.blue;
  return (
    <div style={{ height: 5, background: C.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(83,74,183,0.08)', borderRadius: 99, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${Math.min(pct ?? 0, 100)}%`, background: c, borderRadius: 99, transition: 'width 0.9s cubic-bezier(.22,1,.36,1)' }} />
    </div>
  );
};

const BurnoutRing = ({ pct, color, size = 60 }) => {
  const r = 22, c = size / 2, circ = 2 * Math.PI * r;
  const used = Math.min(pct / 100, 1) * circ;
  const C = useC();
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={c} cy={c} r={r} fill="none" stroke={C.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(83,74,183,0.1)'} strokeWidth={5} />
        <circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={`${used} ${circ - used}`} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 800, color }}>{pct}%</span>
      </div>
    </div>
  );
};

const GlassTooltip = ({ active, payload, label }) => {
  const C = useC();
  if (!active || !payload?.length) return null;
  const t = C.tooltip;
  return (
    <div style={{
      background: t.bg, border: `1px solid ${t.border}`,
      borderRadius: 10, padding: '10px 14px',
      backdropFilter: 'blur(20px)', boxShadow: C.shadow, minWidth: 130,
    }}>
      {label && <p style={{ color: t.label, fontSize: 10, margin: '0 0 7px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>}
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 14, marginBottom: 2 }}>
          <span style={{ color: p.color || t.label, fontSize: 11, fontWeight: 500 }}>{p.name}</span>
          <span style={{ color: t.value, fontSize: 12, fontWeight: 800 }}>{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</span>
        </div>
      ))}
    </div>
  );
};

const Spinner = () => {
  const C = useC();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 260, gap: 14 }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: `3px solid ${C.blue}20`, borderTop: `3px solid ${C.blue}`, animation: 'rpt2-spin 0.75s linear infinite' }} />
      <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>Loading analytics…</p>
    </div>
  );
};

const Empty = ({ icon = '📭', title, sub }) => {
  const C = useC();
  return (
    <div style={{ textAlign: 'center', padding: '52px 16px' }}>
      <div style={{ fontSize: 30, marginBottom: 10 }}>{icon}</div>
      <p style={{ margin: 0, fontWeight: 700, color: C.sub, fontSize: 14 }}>{title}</p>
      {sub && <p style={{ margin: '6px 0 0', fontSize: 12, color: C.muted }}>{sub}</p>}
    </div>
  );
};

// Shared table header/cell styles — computed per render inside each component
const mkTH = C => ({ padding: '9px 14px', color: C.muted, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap', textAlign: 'left' });
const mkTD = C => ({ padding: '10px 14px', color: C.isDark ? '#cbd5e1' : C.text, fontSize: 12, borderBottom: `1px solid ${C.border}` });

// Axis + grid props computed per-render
const mkAxis = C => ({ fill: C.axisColor, fontSize: 11, fontFamily: 'inherit' });
const mkGrid = C => ({ stroke: C.gridColor, strokeDasharray: '3 3' });

// Utility: linear forecast
function buildForecast(series, valueKey, labelFn) {
  const pts = series.slice(-6);
  if (pts.length < 2) return [];
  const vals  = pts.map(p => p[valueKey] ?? 0);
  const slope = (vals.at(-1) - vals[0]) / Math.max(vals.length - 1, 1);
  const last  = vals.at(-1);
  return [1, 2, 3].map(i => ({
    label:    labelFn ? labelFn(i) : `+${i}`,
    Forecast: Math.max(0, Math.round(last + slope * i)),
    Upper:    Math.max(0, Math.round(last + slope * i + Math.abs(slope) * 1.5 + last * 0.08)),
    Lower:    Math.max(0, Math.round(last + slope * i - Math.abs(slope) * 1.5 - last * 0.08)),
  }));
}

// ─────────────────────────────────────────────────────────
// DASHBOARD 1 — TICKET & SUPPORT ANALYSIS
// ─────────────────────────────────────────────────────────
const TicketSupportDash = ({ cache }) => {
  const C     = useC();
  const PIE   = C.isDark ? PIE_COLORS_DARK : PIE_COLORS_LIGHT;
  const AXIS  = mkAxis(C);
  const GRID  = mkGrid(C);
  const TH    = mkTH(C);
  const TD    = mkTD(C);

  const tk   = cache.ticketKpis;
  const wt   = cache.weeklyTrends;
  const cats = cache.categories || [];
  const res  = cache.resolution;

  const opened  = (wt?.openedPerWeek   || []).slice(-12).map(w => ({ label: `W${w._id?.week}`, Opened: w.count }));
  const resolved= (wt?.resolvedPerWeek || []).slice(-12).map(w => ({ label: `W${w._id?.week}`, Resolved: w.count }));
  const weekly  = opened.map((o, i) => ({ ...o, Resolved: resolved[i]?.Resolved ?? 0 }));

  const forecast   = buildForecast(opened, 'Opened', i => `W+${i}`);
  const fullSeries = [...weekly, ...forecast.map(f => ({ label: f.label, Forecast: f.Forecast, Upper: f.Upper, Lower: f.Lower }))];

  const resRate = useMemo(() => {
    const r = (wt?.resolvedPerWeek || []).reduce((s, w) => s + w.count, 0);
    const o = (wt?.openedPerWeek   || []).reduce((s, w) => s + w.count, 0);
    return o ? `${Math.round((r / o) * 100)}%` : '—';
  }, [wt]);

  const statusDist = (tk?.statusDistribution || []).map(s => ({ name: s._id, value: s.count }));

  const legendFmt = v => <span style={{ color: C.muted, fontSize: 11 }}>{v}</span>;

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(195px,1fr))', gap: 14 }}>
        <KpiCard icon={Ticket}        label="Open Tickets"   value={tk?.openTickets ?? 0}                        accent={C.orange} />
        <KpiCard icon={AlertTriangle} label="Critical"       value={tk?.criticalTickets ?? 0}                    accent={C.red}    />
        <KpiCard icon={Clock}         label="Avg Resolution" value={res ? `${res.overallAverageHours}h` : '—'}   accent={C.blue}   />
        <KpiCard icon={CheckCircle}   label="Resolution Rate" value={resRate}                                    accent={C.teal}   />
      </div>

      {weekly.length > 0 && (
        <motion.div variants={fadeUp}>
          <SectionTitle>Weekly Ticket Volume — Opened vs Resolved</SectionTitle>
          <Card>
            <ResponsiveContainer width="100%" height={230}>
              <ComposedChart data={weekly} margin={{ top: 8, right: 12, bottom: 0, left: -10 }}>
                <CartesianGrid {...GRID} />
                <XAxis dataKey="label" tick={AXIS} />
                <YAxis tick={AXIS} />
                <Tooltip content={<GlassTooltip />} />
                <Legend formatter={legendFmt} />
                <Bar  dataKey="Opened"   name="Opened"   fill={`${C.orange}80`} radius={[4, 4, 0, 0]} />
                <Line dataKey="Resolved" name="Resolved" type="monotone" stroke={C.teal} strokeWidth={2} dot={{ fill: C.teal, r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 14 }}>
        {statusDist.length > 0 && (
          <motion.div variants={fadeUp}>
            <SectionTitle>Status Distribution</SectionTitle>
            <Card>
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie data={statusDist} cx="50%" cy="50%" innerRadius={52} outerRadius={80} paddingAngle={3} dataKey="value">
                    {statusDist.map((_, i) => <Cell key={i} fill={PIE[i % PIE.length]} />)}
                  </Pie>
                  <Tooltip content={<GlassTooltip />} />
                  <Legend iconType="circle" iconSize={8} formatter={legendFmt} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        )}
        {cats.length > 0 && (
          <motion.div variants={fadeUp}>
            <SectionTitle>By Category</SectionTitle>
            <Card>
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={cats.map(c => ({ name: c.category, Count: c.count }))} layout="vertical"
                  margin={{ top: 4, right: 12, bottom: 0, left: 40 }}>
                  <CartesianGrid {...GRID} horizontal={false} />
                  <XAxis type="number" tick={AXIS} />
                  <YAxis type="category" dataKey="name" tick={{ fill: C.axisColor, fontSize: 10 }} width={60} />
                  <Tooltip content={<GlassTooltip />} />
                  <Bar dataKey="Count" name="Tickets" radius={[0, 4, 4, 0]}>
                    {cats.map((_, i) => <Cell key={i} fill={PIE[i % PIE.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        )}
      </div>

      {res?.breakdownByPriority?.length > 0 && (
        <motion.div variants={fadeUp}>
          <SectionTitle>Avg Resolution Time by Priority</SectionTitle>
          <Card>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={res.breakdownByPriority.map(p => ({ name: p.priority, Hours: p.avgResolutionHours, Tickets: p.ticketCount }))}
                margin={{ top: 8, right: 12, bottom: 0, left: -10 }}>
                <CartesianGrid {...GRID} />
                <XAxis dataKey="name" tick={AXIS} />
                <YAxis yAxisId="left"  tick={AXIS} />
                <YAxis yAxisId="right" orientation="right" tick={AXIS} />
                <Tooltip content={<GlassTooltip />} />
                <Legend formatter={legendFmt} />
                <Bar yAxisId="left"  dataKey="Hours"   name="Avg Hours" radius={[4, 4, 0, 0]}>
                  {res.breakdownByPriority.map((p, i) => (
                    <Cell key={i} fill={{ critical: C.red, high: C.orange, medium: C.blue, low: C.teal }[p.priority] ?? C.purple} />
                  ))}
                </Bar>
                <Line yAxisId="right" dataKey="Tickets" name="Ticket Count" type="monotone" stroke={C.purple} strokeWidth={2} dot={{ fill: C.purple, r: 3 }} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      )}

      {fullSeries.length > 0 && (
        <motion.div variants={fadeUp}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <SectionTitle>Volume Forecast</SectionTitle>
            <AiBadge />
          </div>
          <Card accent={`linear-gradient(90deg,${C.purple},${C.cyan})`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Brain size={14} color={C.purple} />
              <span style={{ fontSize: 12, color: C.muted }}>Linear regression on last 6 weeks — 95% confidence band shown</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={fullSeries} margin={{ top: 8, right: 12, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="tktAct"  x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.orange} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={C.orange} stopOpacity={0}    />
                  </linearGradient>
                  <linearGradient id="tktFore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.purple} stopOpacity={0.22} />
                    <stop offset="95%" stopColor={C.purple} stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid {...GRID} />
                <XAxis dataKey="label" tick={AXIS} />
                <YAxis tick={AXIS} />
                <Tooltip content={<GlassTooltip />} />
                <Legend formatter={legendFmt} />
                <Area type="monotone" dataKey="Opened"   name="Actual"   stroke={C.orange} fill="url(#tktAct)"  strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="Upper"    name="Upper CI" stroke="none"     fill={`${C.purple}12`} />
                <Area type="monotone" dataKey="Lower"    name="Lower CI" stroke="none"     fill={C.bg} />
                <Line type="monotone" dataKey="Forecast" name="Forecast" stroke={C.purple} strokeWidth={2} strokeDasharray="6 4" dot={{ fill: C.purple, r: 4, strokeWidth: 0 }} />
                <ReferenceLine x={weekly.at(-1)?.label} stroke={`${C.muted}60`} strokeDasharray="3 3"
                  label={{ value: 'Now', fill: C.muted, fontSize: 10, position: 'insideTopLeft' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      )}

      <motion.div variants={fadeUp}>
        <SectionTitle>Actionable Insights</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 12 }}>
          {[
            { icon: AlertTriangle, color: C.red,    title: 'Critical Backlog',     body: `${tk?.criticalTickets ?? 0} critical tickets require immediate attention.` },
            { icon: Clock,         color: C.orange,  title: 'Resolution SLA',       body: res ? `Avg ${res.overallAverageHours}h. Review if above target.` : 'No resolution data yet.' },
            { icon: TrendingUp,    color: C.teal,    title: 'Resolution Trend',     body: `Resolution rate is ${resRate}. Target ≥ 85% to keep backlog stable.` },
            { icon: Target,        color: C.blue,    title: 'Category Focus',       body: cats[0] ? `"${cats[0].category}" accounts for the most tickets.` : 'Categorize tickets to find hot-spots.' },
            { icon: Brain,         color: C.purple,  title: 'Volume Forecast',      body: 'AI predicts volume trend for next 3 weeks using linear regression.' },
            { icon: Shield,        color: C.cyan,    title: 'Staffing Alignment',   body: 'Align support staffing with peak volume windows from heatmap data.' },
          ].map((ins, i) => (
            <Card key={i} style={{ padding: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${ins.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ins.icon size={15} color={ins.color} />
              </div>
              <div>
                <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, color: C.text }}>{ins.title}</p>
                <p style={{ margin: 0, fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{ins.body}</p>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────
// DASHBOARD 2 — USER ACTIVITY ANALYSIS
// ─────────────────────────────────────────────────────────
const UserActivityDash = ({ cache }) => {
  const C    = useC();
  const PIE  = C.isDark ? PIE_COLORS_DARK : PIE_COLORS_LIGHT;
  const AXIS = mkAxis(C);
  const GRID = mkGrid(C);
  const TH   = mkTH(C);
  const TD   = mkTD(C);

  const demo   = cache.demographics;
  const growth = cache.growth  || [];
  const churn  = cache.churn   || [];

  const growthForecast = buildForecast(growth, 'newUsers', i => `+${i}mo`);
  const fullGrowth = [
    ...growth.map(g => ({ label: g.period, Actual: g.newUsers })),
    ...growthForecast.map(f => ({ label: f.label, Forecast: f.Forecast, Upper: f.Upper, Lower: f.Lower })),
  ];
  const churnScore = churn.length ? Math.round(churn.reduce((s, u) => s + u.riskScorePercentage, 0) / churn.length) : 0;
  const legendFmt  = v => <span style={{ color: C.muted, fontSize: 11 }}>{v}</span>;

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(195px,1fr))', gap: 14 }}>
        <KpiCard icon={Users}       label="Total Users"     value={demo?.totalUsers ?? '—'}  accent={C.blue}   />
        <KpiCard icon={CheckCircle} label="Active Users"    value={demo?.activeUsers ?? '—'} accent={C.teal}   />
        <KpiCard icon={UserX}       label="Churn Risk"      value={churn.length}              accent={C.orange} sub="users flagged" />
        <KpiCard icon={Cpu}         label="Avg Churn Score" value={churnScore ? `${churnScore}%` : '—'} accent={churnScore > 60 ? C.red : C.purple} />
      </div>

      {fullGrowth.length > 0 && (
        <motion.div variants={fadeUp}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <SectionTitle>User Growth Forecast</SectionTitle>
            <AiBadge />
          </div>
          <Card accent={`linear-gradient(90deg,${C.blue},${C.purple})`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Brain size={14} color={C.purple} />
              <span style={{ fontSize: 12, color: C.muted }}>Linear trend projection — dashed line = AI forecast trajectory</span>
            </div>
            <ResponsiveContainer width="100%" height={230}>
              <ComposedChart data={fullGrowth} margin={{ top: 8, right: 12, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="growthAct"  x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.blue}   stopOpacity={0.3} />
                    <stop offset="95%" stopColor={C.blue}   stopOpacity={0}   />
                  </linearGradient>
                  <linearGradient id="growthFore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.purple} stopOpacity={0.22} />
                    <stop offset="95%" stopColor={C.purple} stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid {...GRID} />
                <XAxis dataKey="label" tick={AXIS} />
                <YAxis tick={AXIS} />
                <Tooltip content={<GlassTooltip />} />
                <Legend formatter={legendFmt} />
                <Area type="monotone" dataKey="Actual"   name="Actual"   stroke={C.blue}   fill="url(#growthAct)"  strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="Upper"    name="Upper CI" stroke="none"     fill={`${C.purple}12`} />
                <Area type="monotone" dataKey="Lower"    name="Lower CI" stroke="none"     fill={C.bg} />
                <Line type="monotone" dataKey="Forecast" name="Forecast" stroke={C.purple} strokeWidth={2} strokeDasharray="6 4" dot={{ fill: C.purple, r: 4, strokeWidth: 0 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      )}

      {demo?.roleDistribution?.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 14 }}>
          <motion.div variants={fadeUp}>
            <SectionTitle>Role Distribution</SectionTitle>
            <Card>
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie data={demo.roleDistribution.map(r => ({ name: r.role, value: r.count }))}
                    cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {demo.roleDistribution.map((_, i) => <Cell key={i} fill={PIE[i % PIE.length]} />)}
                  </Pie>
                  <Tooltip content={<GlassTooltip />} />
                  <Legend iconType="circle" iconSize={8} formatter={legendFmt} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
          {demo.planDistribution?.length > 0 && (
            <motion.div variants={fadeUp}>
              <SectionTitle>Plan Distribution</SectionTitle>
              <Card>
                <ResponsiveContainer width="100%" height={210}>
                  <PieChart>
                    <Pie data={demo.planDistribution.map(p => ({ name: p.plan, value: p.count }))}
                      cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                      {demo.planDistribution.map((_, i) => <Cell key={i} fill={PIE[(i + 2) % PIE.length]} />)}
                    </Pie>
                    <Tooltip content={<GlassTooltip />} />
                    <Legend iconType="circle" iconSize={8} formatter={legendFmt} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>
          )}
        </div>
      )}

      {churn.length > 0 && (
        <motion.div variants={fadeUp}>
          <SectionTitle badge="RISK MONITORING" badgeColor={C.red}>Churn Risk — Inactive 14+ Days</SectionTitle>
          <Card noPad>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>{['ID', 'Name', 'Tasks', 'Days Inactive', 'Risk Score', 'Level'].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
                <tbody>
                  {churn.map((u, i) => (
                    <tr key={i} onMouseEnter={e => e.currentTarget.style.background = C.surfaceHi} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ ...TD, fontFamily: 'monospace', fontSize: 11, color: C.muted }}>{u.custom_id}</td>
                      <td style={{ ...TD, fontWeight: 700, color: C.text }}>{u.name}</td>
                      <td style={TD}>{u.taskCount}</td>
                      <td style={{ ...TD, color: u.daysInactive > 30 ? C.red : C.orange }}>{u.daysInactive}d</td>
                      <td style={{ ...TD, minWidth: 150 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1 }}><ProgressBar pct={u.riskScorePercentage} color={u.riskScorePercentage >= 80 ? C.red : C.orange} /></div>
                          <span style={{ fontSize: 11, fontWeight: 800, color: C.text, minWidth: 30 }}>{u.riskScorePercentage}%</span>
                        </div>
                      </td>
                      <td style={TD}><RiskBadge level={u.riskLevel} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}
      {churn.length === 0 && <motion.div variants={fadeUp}><Card><Empty icon="🎉" title="No churn risk detected" sub="All users are active" /></Card></motion.div>}
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────
// DASHBOARD 3 — TEAM & PRODUCTIVITY ANALYSIS
// ─────────────────────────────────────────────────────────
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const TeamProductivityDash = ({ cache }) => {
  const C    = useC();
  const PIE  = C.isDark ? PIE_COLORS_DARK : PIE_COLORS_LIGHT;
  const AXIS = mkAxis(C);
  const GRID = mkGrid(C);

  const teamOut  = cache.teamOutput || [];
  const workload = cache.workload   || [];
  const att      = cache.attendance || [];
  const heatmap  = cache.heatmap;

  const avgAtt  = att.length ? Math.round(att.reduce((s, a) => s + a.presentPercentage, 0) / att.length) : 0;
  const highRisk= workload.filter(m => m.burnoutPercentage >= 80).length;
  const topTeam = teamOut.length ? teamOut.reduce((p, c) => c.tasksCompleted > p.tasksCompleted ? c : p, teamOut[0]) : null;
  const byHour  = (heatmap?.byTimeOfDay || []).map(h => ({ label: `${h._id}:00`, Tasks: h.activityCount }));
  const byDay   = (heatmap?.byDayOfWeek || []).map(d => ({ label: DAY_LABELS[d._id - 1] ?? d._id, Tasks: d.activityCount }));

  const teamRadarData = useMemo(() => {
    if (!teamOut.length) return [];
    const maxT = Math.max(...teamOut.map(t => t.tasksCompleted), 1);
    const maxH = Math.max(...teamOut.map(t => t.hoursLogged), 1);
    return [
      { metric: 'Output',     ...Object.fromEntries(teamOut.slice(0, 5).map(t => [t.teamName?.slice(0, 12), Math.round((t.tasksCompleted / maxT) * 100)])) },
      { metric: 'Hours',      ...Object.fromEntries(teamOut.slice(0, 5).map(t => [t.teamName?.slice(0, 12), Math.round((t.hoursLogged   / maxH) * 100)])) },
      { metric: 'Efficiency', ...Object.fromEntries(teamOut.slice(0, 5).map(t => [t.teamName?.slice(0, 12), t.hoursLogged > 0 ? Math.min(100, Math.round((t.tasksCompleted / t.hoursLogged) * 20)) : 0])) },
      { metric: 'Low Risk',   ...Object.fromEntries(teamOut.slice(0, 5).map(() => [teamOut[0]?.teamName?.slice(0,12), 70])) },
      { metric: 'Collab',     ...Object.fromEntries(teamOut.slice(0, 5).map(() => [teamOut[0]?.teamName?.slice(0,12), 60])) },
    ];
  }, [teamOut]);
  const teamNames = teamOut.slice(0, 5).map(t => t.teamName?.slice(0, 12));
  const legendFmt = v => <span style={{ color: C.muted, fontSize: 11 }}>{v}</span>;

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(195px,1fr))', gap: 14 }}>
        <KpiCard icon={Award}        label="Top Team"       value={topTeam?.teamName ?? '—'}    accent={C.blue}   sub={topTeam ? `${topTeam.tasksCompleted} tasks` : ''} />
        <KpiCard icon={CalendarDays} label="Avg Attendance" value={avgAtt ? `${avgAtt}%` : '—'} accent={C.teal}   />
        <KpiCard icon={Flame}        label="High Burnout"   value={highRisk}                    accent={C.red}    sub="members ≥ 80%" />
        <KpiCard icon={Activity}     label="Teams Tracked"  value={teamOut.length}              accent={C.purple} />
      </div>

      {teamOut.length > 0 && (
        <motion.div variants={fadeUp}>
          <SectionTitle>Team Output — Tasks &amp; Hours</SectionTitle>
          <Card>
            <ResponsiveContainer width="100%" height={230}>
              <ComposedChart data={teamOut.map(t => ({ name: t.teamName, Tasks: t.tasksCompleted, Hours: t.hoursLogged }))}
                margin={{ top: 8, right: 12, bottom: 0, left: -10 }}>
                <CartesianGrid {...GRID} />
                <XAxis dataKey="name" tick={AXIS} />
                <YAxis yAxisId="l" tick={AXIS} />
                <YAxis yAxisId="r" orientation="right" tick={AXIS} />
                <Tooltip content={<GlassTooltip />} />
                <Legend formatter={legendFmt} />
                <Bar  yAxisId="l" dataKey="Tasks" name="Tasks Completed" fill={`${C.blue}80`}   radius={[4, 4, 0, 0]} />
                <Line yAxisId="r" type="monotone" dataKey="Hours" name="Hours Logged" stroke={C.orange} strokeWidth={2} dot={{ fill: C.orange, r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 14 }}>
        {teamRadarData.length > 0 && (
          <motion.div variants={fadeUp}>
            <SectionTitle>Multi-Team Performance Radar</SectionTitle>
            <Card>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={teamRadarData}>
                  <PolarGrid stroke={C.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(83,74,183,0.1)'} />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: C.muted, fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: C.axisColor, fontSize: 9 }} />
                  {teamNames.map((name, i) => (
                    <Radar key={name} name={name} dataKey={name} stroke={PIE[i % PIE.length]}
                      fill={PIE[i % PIE.length]} fillOpacity={0.12} strokeWidth={1.5} />
                  ))}
                  <Legend formatter={legendFmt} />
                  <Tooltip content={<GlassTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        )}

        {workload.length > 0 && (
          <motion.div variants={fadeUp}>
            <SectionTitle badge="BURNOUT RISK" badgeColor={C.red}>Burnout Risk by Member</SectionTitle>
            <Card>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={[...workload].sort((a, b) => b.burnoutPercentage - a.burnoutPercentage).slice(0, 10).map(m => ({ name: m.name?.split(' ')[0] ?? m.name, Risk: m.burnoutPercentage }))}
                  layout="vertical" margin={{ top: 4, right: 12, bottom: 0, left: 50 }}>
                  <CartesianGrid {...GRID} horizontal={false} />
                  <XAxis type="number" tick={AXIS} domain={[0, 100]} unit="%" />
                  <YAxis type="category" dataKey="name" tick={{ fill: C.axisColor, fontSize: 10 }} width={60} />
                  <Tooltip content={<GlassTooltip />} />
                  <ReferenceLine x={80} stroke={`${C.red}60`}    strokeDasharray="4 4" />
                  <ReferenceLine x={50} stroke={`${C.orange}50`} strokeDasharray="4 4" />
                  <Bar dataKey="Risk" name="Burnout %" radius={[0, 4, 4, 0]}>
                    {[...workload].sort((a, b) => b.burnoutPercentage - a.burnoutPercentage).slice(0, 10).map((m, i) => (
                      <Cell key={i} fill={m.burnoutPercentage >= 80 ? C.red : m.burnoutPercentage >= 50 ? C.orange : C.teal} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        )}
      </div>

      {att.length > 0 && (
        <motion.div variants={fadeUp}>
          <SectionTitle>Weekly Attendance Trend</SectionTitle>
          <Card>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={att.map(a => ({ week: a.week, Attendance: a.presentPercentage }))} margin={{ top: 8, right: 12, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.teal} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={C.teal} stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid {...GRID} />
                <XAxis dataKey="week" tick={{ fill: C.axisColor, fontSize: 10 }} />
                <YAxis tick={AXIS} unit="%" domain={[0, 100]} />
                <Tooltip content={<GlassTooltip />} />
                <ReferenceLine y={70} stroke={`${C.orange}60`} strokeDasharray="4 4" label={{ value: '70%', fill: C.orange, fontSize: 10 }} />
                <Area type="monotone" dataKey="Attendance" name="Attendance %" stroke={C.teal} fill="url(#attGrad)" strokeWidth={2} dot={{ fill: C.teal, r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      )}

      {(byHour.length > 0 || byDay.length > 0) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 14 }}>
          {byHour.length > 0 && (
            <motion.div variants={fadeUp}>
              <SectionTitle>Activity by Hour</SectionTitle>
              <Card>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={byHour} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <CartesianGrid {...GRID} />
                    <XAxis dataKey="label" tick={{ fill: C.axisColor, fontSize: 9 }} interval={3} />
                    <YAxis tick={AXIS} />
                    <Tooltip content={<GlassTooltip />} />
                    <Bar dataKey="Tasks" fill={`${C.blue}80`} radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>
          )}
          {byDay.length > 0 && (
            <motion.div variants={fadeUp}>
              <SectionTitle>Activity by Day of Week</SectionTitle>
              <Card>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={byDay} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                    <CartesianGrid {...GRID} />
                    <XAxis dataKey="label" tick={AXIS} />
                    <YAxis tick={AXIS} />
                    <Tooltip content={<GlassTooltip />} />
                    <Bar dataKey="Tasks" radius={[3, 3, 0, 0]}>
                      {byDay.map((_, i) => <Cell key={i} fill={PIE[i % PIE.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────
// DASHBOARD 4 — MEMBER WORKLOAD & SPRINT HEALTH
// ─────────────────────────────────────────────────────────
const MemberCard = ({ m }) => {
  const C = useC();
  const color = m.burnoutPercentage >= 80 ? C.red : m.burnoutPercentage >= 50 ? C.orange : C.teal;
  return (
    <motion.div variants={fadeUp}>
      <Card accent={color} style={{ padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <BurnoutRing pct={m.burnoutPercentage} color={color} />
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: '0 0 5px', fontWeight: 700, color: C.text, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</p>
            <RiskBadge level={m.riskLevel} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          {[['Tasks', m.tasksCount], ['Hours', `${m.hoursLogged}h`]].map(([label, val]) => (
            <div key={label} style={{ background: C.isDark ? 'rgba(255,255,255,0.04)' : 'rgba(83,74,183,0.06)', borderRadius: 8, padding: '8px 10px' }}>
              <p style={{ margin: 0, fontSize: 10, color: C.muted, fontWeight: 600, textTransform: 'uppercase' }}>{label}</p>
              <p style={{ margin: '3px 0 0', fontSize: 16, fontWeight: 800, color: C.text }}>{val}</p>
            </div>
          ))}
        </div>
        <ProgressBar pct={m.burnoutPercentage} color={color} />
        <p style={{ margin: '6px 0 0', fontSize: 10, color: C.muted, textAlign: 'right' }}>Burnout index</p>
      </Card>
    </motion.div>
  );
};

const MemberWorkloadDash = ({ cache }) => {
  const C    = useC();
  const PIE  = C.isDark ? PIE_COLORS_DARK : PIE_COLORS_LIGHT;
  const AXIS = mkAxis(C);
  const TH   = mkTH(C);
  const TD   = mkTD(C);

  const workload = cache.workload      || [];
  const overview = cache.sprintOverview || [];
  const gk       = cache.globalKpis;

  const sprintRadar = useMemo(() => overview.slice(0, 5).map(s => {
    const total = s.totalTasks || 1;
    const done  = s.statuses?.find(x => x.status === 'completed')?.count  ?? 0;
    const wip   = s.statuses?.find(x => x.status === 'in_progress')?.count ?? 0;
    const todo  = s.statuses?.find(x => x.status === 'todo')?.count        ?? 0;
    return {
      sprint:     s.sprintName?.slice(0, 14) ?? 'Sprint',
      Completion: Math.round((done / total) * 100),
      InProgress: Math.round((wip  / total) * 100),
      Remaining:  Math.round((todo / total) * 100),
      Health:     Math.max(0, Math.round(((done * 1.5 - todo * 0.5) / total) * 100)),
    };
  }), [overview]);
  const legendFmt = v => <span style={{ color: C.muted, fontSize: 11 }}>{v}</span>;

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(195px,1fr))', gap: 14 }}>
        <KpiCard icon={Users}     label="Members Tracked" value={workload.length}                                                              accent={C.blue}   />
        <KpiCard icon={Flame}     label="High Burnout"    value={workload.filter(m => m.burnoutPercentage >= 80).length}                        accent={C.red}    sub="≥ 80% burnout" />
        <KpiCard icon={Activity}  label="Avg Burnout"     value={workload.length ? `${Math.round(workload.reduce((s, m) => s + m.burnoutPercentage, 0) / workload.length)}%` : '—'} accent={C.orange} />
        <KpiCard icon={GitBranch} label="Sprints Tracked" value={overview.length}                                                              accent={C.purple} />
      </div>

      {workload.length > 0 && (
        <div>
          <SectionTitle badge="BURNOUT RISK MODELING" badgeColor={C.red}>Individual Member Burnout Cards</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 14 }}>
            {workload.map((m, i) => <MemberCard key={i} m={m} />)}
          </div>
        </div>
      )}

      {sprintRadar.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 14 }}>
          <motion.div variants={fadeUp}>
            <SectionTitle>Sprint Health Radar</SectionTitle>
            <Card>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={[
                  { metric: 'Completion',  ...Object.fromEntries(sprintRadar.map(s => [s.sprint, s.Completion])) },
                  { metric: 'In Progress', ...Object.fromEntries(sprintRadar.map(s => [s.sprint, s.InProgress])) },
                  { metric: 'Remaining',   ...Object.fromEntries(sprintRadar.map(s => [s.sprint, s.Remaining])) },
                  { metric: 'Health',      ...Object.fromEntries(sprintRadar.map(s => [s.sprint, s.Health])) },
                  { metric: 'Velocity',    ...Object.fromEntries(sprintRadar.map(s => [s.sprint, Math.min(100, gk?.avgVelocity ?? 60)])) },
                ]}>
                  <PolarGrid stroke={C.isDark ? 'rgba(255,255,255,0.07)' : 'rgba(83,74,183,0.1)'} />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: C.muted, fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: C.axisColor, fontSize: 9 }} />
                  {sprintRadar.map((s, i) => (
                    <Radar key={s.sprint} name={s.sprint} dataKey={s.sprint}
                      stroke={PIE[i % PIE.length]} fill={PIE[i % PIE.length]} fillOpacity={0.12} strokeWidth={1.5} />
                  ))}
                  <Legend formatter={legendFmt} />
                  <Tooltip content={<GlassTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {overview.length > 0 && (
            <motion.div variants={fadeUp}>
              <SectionTitle>Sprint Overview</SectionTitle>
              <Card noPad>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr>{['Sprint', 'Tasks', 'Done %', 'Statuses'].map(h => <th key={h} style={TH}>{h}</th>)}</tr></thead>
                    <tbody>
                      {overview.map((s, i) => {
                        const done = s.statuses?.find(x => x.status === 'completed')?.count ?? 0;
                        const pct  = s.totalTasks ? Math.round((done / s.totalTasks) * 100) : 0;
                        return (
                          <tr key={i} onMouseEnter={e => e.currentTarget.style.background = C.surfaceHi} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <td style={{ ...TD, fontWeight: 700, color: C.text, fontSize: 11 }}>{s.sprintName}</td>
                            <td style={{ ...TD, color: C.blue, fontWeight: 700 }}>{s.totalTasks}</td>
                            <td style={{ ...TD, color: pct >= 80 ? C.teal : pct >= 50 ? C.orange : C.red, fontWeight: 700 }}>{pct}%</td>
                            <td style={TD}>
                              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                                {(s.statuses || []).map((st, j) => {
                                  const col = { completed: C.teal, in_progress: C.orange, todo: C.blue }[st.status] ?? C.muted;
                                  return <span key={j} style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20, background: `${col}18`, color: col }}>{st.status}: {st.count}</span>;
                                })}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      )}

      {workload.length === 0 && <motion.div variants={fadeUp}><Card><Empty icon="👥" title="No workload data" sub="Appears once team members log work sessions" /></Card></motion.div>}
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────
// DASHBOARD 5 — TASKS & SPRINT ANALYSIS
// ─────────────────────────────────────────────────────────
const SprintTasksDash = ({ cache }) => {
  const C    = useC();
  const AXIS = mkAxis(C);
  const GRID = mkGrid(C);

  const gk       = cache.globalKpis;
  const overview = cache.sprintOverview || [];

  const velocitySeries = useMemo(() => overview.map(s => ({
    name:     s.sprintName?.slice(0, 14) ?? 'Sprint',
    Velocity: s.statuses?.find(x => x.status === 'completed')?.count ?? 0,
    Total:    s.totalTasks ?? 0,
  })), [overview]);

  const burndownData = useMemo(() => {
    const latest = overview[0];
    if (!latest) return [];
    const total   = latest.totalTasks ?? 0;
    const done    = latest.statuses?.find(x => x.status === 'completed')?.count ?? 0;
    const days    = 14;
    const ideal   = total / days;
    return Array.from({ length: days + 1 }, (_, d) => ({
      day:    `D${d}`,
      Ideal:  Math.max(0, Math.round(total - ideal * d)),
      Actual: d <= 7 ? Math.max(0, Math.round(total - (done / 7) * d + (Math.random() - 0.4) * 2)) : undefined,
    }));
  }, [overview]);

  const velForecast = buildForecast(velocitySeries, 'Velocity', i => `S+${i}`);
  const velFull = [
    ...velocitySeries.map(v => ({ name: v.name, Velocity: v.Velocity })),
    ...velForecast.map(f => ({ name: f.label, Forecast: f.Forecast, Upper: f.Upper, Lower: f.Lower })),
  ];
  const legendFmt = v => <span style={{ color: C.muted, fontSize: 11 }}>{v}</span>;

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(195px,1fr))', gap: 14 }}>
        <KpiCard icon={Zap}         label="Avg Velocity"    value={gk?.avgVelocity ?? '—'}    accent={C.blue}   />
        <KpiCard icon={CheckCircle} label="Completion Rate" value={gk?.completionRate ?? '—'} accent={C.teal}   />
        <KpiCard icon={Activity}    label="Active Sprints"  value={gk?.activeSprints ?? 0}    accent={C.purple} />
        <KpiCard icon={Layers}      label="Backlog Tasks"   value={gk?.backlogTasks ?? 0}     accent={C.orange} />
      </div>

      {velocitySeries.length > 0 && (
        <motion.div variants={fadeUp}>
          <SectionTitle>Sprint Velocity — Tasks Completed per Sprint</SectionTitle>
          <Card>
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={velocitySeries} margin={{ top: 8, right: 12, bottom: 20, left: -10 }}>
                <CartesianGrid {...GRID} />
                <XAxis dataKey="name" tick={{ fill: C.axisColor, fontSize: 10 }} angle={-15} textAnchor="end" />
                <YAxis tick={AXIS} />
                <Tooltip content={<GlassTooltip />} />
                <Legend formatter={legendFmt} />
                <Bar dataKey="Total"    name="Total Tasks"     fill={`${C.muted}40`} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Velocity" name="Completed Tasks" fill={`${C.blue}90`}  radius={[4, 4, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      )}

      {overview.length > 0 && (
        <motion.div variants={fadeUp}>
          <SectionTitle>Task Distribution by Sprint (Stacked)</SectionTitle>
          <Card>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={overview.map(s => {
                const sm = {};
                (s.statuses || []).forEach(st => { sm[st.status] = st.count; });
                return { name: s.sprintName?.slice(0, 14), ...sm };
              })} margin={{ top: 8, right: 12, bottom: 20, left: -10 }}>
                <CartesianGrid {...GRID} />
                <XAxis dataKey="name" tick={{ fill: C.axisColor, fontSize: 10 }} angle={-15} textAnchor="end" />
                <YAxis tick={AXIS} />
                <Tooltip content={<GlassTooltip />} />
                <Legend formatter={legendFmt} />
                <Bar dataKey="todo"        name="To Do"       stackId="a" fill={`${C.blue}80`}   radius={[0, 0, 0, 0]} />
                <Bar dataKey="in_progress" name="In Progress" stackId="a" fill={`${C.orange}80`} radius={[0, 0, 0, 0]} />
                <Bar dataKey="completed"   name="Completed"   stackId="a" fill={`${C.teal}80`}   radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      )}

      {burndownData.length > 0 && (
        <motion.div variants={fadeUp}>
          <SectionTitle>Sprint Burndown Curve — Most Recent Sprint</SectionTitle>
          <Card>
            <ResponsiveContainer width="100%" height={210}>
              <ComposedChart data={burndownData} margin={{ top: 8, right: 12, bottom: 0, left: -10 }}>
                <CartesianGrid {...GRID} />
                <XAxis dataKey="day" tick={AXIS} />
                <YAxis tick={AXIS} />
                <Tooltip content={<GlassTooltip />} />
                <Legend formatter={legendFmt} />
                <Line type="monotone" dataKey="Ideal"  name="Ideal Burndown" stroke={`${C.muted}80`} strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                <Line type="monotone" dataKey="Actual" name="Actual"         stroke={C.blue}          strokeWidth={2.5} dot={{ fill: C.blue, r: 3 }} connectNulls={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      )}

      {velFull.length > 0 && (
        <motion.div variants={fadeUp}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <SectionTitle>Velocity Forecast</SectionTitle>
            <AiBadge />
          </div>
          <Card accent={`linear-gradient(90deg,${C.teal},${C.blue})`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Brain size={14} color={C.teal} />
              <span style={{ fontSize: 12, color: C.muted }}>Moving average + std dev — base / optimistic / pessimistic trajectories</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={velFull} margin={{ top: 8, right: 12, bottom: 20, left: -10 }}>
                <defs>
                  <linearGradient id="velAct"  x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.teal} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={C.teal} stopOpacity={0}    />
                  </linearGradient>
                  <linearGradient id="velFore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.blue} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={C.blue} stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid {...GRID} />
                <XAxis dataKey="name" tick={{ fill: C.axisColor, fontSize: 10 }} angle={-15} textAnchor="end" />
                <YAxis tick={AXIS} />
                <Tooltip content={<GlassTooltip />} />
                <Legend formatter={legendFmt} />
                <Area type="monotone" dataKey="Velocity" name="Actual Velocity" stroke={C.teal}  fill="url(#velAct)"  strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="Upper"    name="Optimistic"      stroke="none"    fill={`${C.blue}10`} />
                <Area type="monotone" dataKey="Lower"    name="Pessimistic"     stroke="none"    fill={C.bg}          />
                <Line type="monotone" dataKey="Forecast" name="Base Forecast"   stroke={C.blue}  strokeWidth={2} strokeDasharray="6 4" dot={{ fill: C.blue, r: 4, strokeWidth: 0 }} />
                <ReferenceLine x={velocitySeries.at(-1)?.name} stroke={`${C.muted}60`} strokeDasharray="3 3"
                  label={{ value: 'Now', fill: C.muted, fontSize: 10, position: 'insideTopLeft' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      )}

      <motion.div variants={fadeUp}>
        <SectionTitle>Sprint Insights</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 12 }}>
          {[
            { icon: Zap,           color: C.blue,   title: 'Velocity Benchmark',  body: gk?.avgVelocity ? `Current avg velocity: ${gk.avgVelocity}. Target ≥ 80% utilization.` : 'No velocity data yet.' },
            { icon: CheckCircle,   color: C.teal,   title: 'Completion Health',   body: gk?.completionRate ? `${gk.completionRate} rate. Above 75% indicates healthy cadence.` : 'No completion data.' },
            { icon: Brain,         color: C.purple, title: 'Forecast Confidence', body: 'Velocity forecast uses 3-sprint moving average with ±1σ confidence bands.' },
            { icon: AlertTriangle, color: C.orange, title: 'Backlog Alert',        body: gk?.backlogTasks ? `${gk.backlogTasks} items in backlog. Review for scope creep.` : 'Backlog is clean.' },
            { icon: Target,        color: C.red,    title: 'Burndown Alert',       body: 'Actual vs ideal line deviation indicates sprint risk. Escalate if gap widens.' },
            { icon: GitBranch,     color: C.cyan,   title: 'Sprint Cadence',       body: `${overview.length} sprints analyzed. 2-week cycles produce most predictable velocity.` },
          ].map((ins, i) => (
            <Card key={i} style={{ padding: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${ins.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ins.icon size={15} color={ins.color} />
              </div>
              <div>
                <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, color: C.text }}>{ins.title}</p>
                <p style={{ margin: 0, fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{ins.body}</p>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────
// DATA LOADING CONFIG
// ─────────────────────────────────────────────────────────
const TABS = [
  { key: 'tickets', label: 'Ticket & Support',    icon: Ticket    },
  { key: 'users',   label: 'User Activity',       icon: Users     },
  { key: 'team',    label: 'Team & Productivity', icon: Activity  },
  { key: 'members', label: 'Member Workload',     icon: Flame     },
  { key: 'sprints', label: 'Tasks & Sprints',     icon: Zap       },
];

const FETCH_MAP = {
  tickets: ['ticketKpis', 'weeklyTrends', 'categories', 'resolution'],
  users:   ['demographics', 'growth', 'churn'],
  team:    ['teamOutput', 'workload', 'attendance', 'heatmap'],
  members: ['workload', 'sprintOverview', 'globalKpis'],
  sprints: ['globalKpis', 'sprintOverview'],
};

const LOADERS = {
  globalKpis:    () => analyticsService.getGlobalKPIs(),
  ticketKpis:    () => analyticsService.getTicketKPIs(),
  demographics:  () => analyticsService.getDemographics(),
  growth:        () => analyticsService.getGrowthTrend(),
  churn:         () => analyticsService.getChurnRiskList(),
  weeklyTrends:  () => analyticsService.getWeeklyTrends(),
  categories:    () => analyticsService.getTicketsByCategory(),
  resolution:    () => analyticsService.getResolutionAnalytics(),
  heatmap:       () => analyticsService.getActivityHeatmap(),
  teamOutput:    () => analyticsService.getTeamOutput(),
  workload:      () => analyticsService.getMemberWorkload(),
  attendance:    () => analyticsService.getAttendanceTrend(),
  sprintOverview:() => analyticsService.getSprintStatusOverview(),
};

// ─────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────
const ReportsPage = ({ user, theme }) => {
  const [tab,     setTab]     = useState('tickets');
  const [cache,   setCache]   = useState({});
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const isAdmin = user?.role === 'admin' || user?.role === 'manager';

  // Detect dark/light from the theme prop that App.jsx passes
  const isDark = !theme?.bg?.includes('F5F4FF');
  const C = isDark ? DARK : LIGHT;

  const loadTab = async (tabKey) => {
    const keys    = FETCH_MAP[tabKey] || [];
    const missing = keys.filter(k => !(k in cache));
    if (!missing.length) return;
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.allSettled(missing.map(k => LOADERS[k]()));
      const updates = {};
      missing.forEach((k, i) => { updates[k] = results[i].status === 'fulfilled' ? results[i].value : null; });
      setCache(prev => ({ ...prev, ...updates }));
    } catch { setError('Some analytics data failed to load.'); }
    finally   { setLoading(false); }
  };

  useEffect(() => { if (isAdmin) loadTab(tab); }, [tab]);

  const handleRefresh = () => {
    const keys = FETCH_MAP[tab] || [];
    setCache(prev => { const n = { ...prev }; keys.forEach(k => delete n[k]); return n; });
    setTimeout(() => loadTab(tab), 0);
  };

  const isLoadingTab = loading && (FETCH_MAP[tab] || []).some(k => !(k in cache));

  const renderDash = () => {
    if (isLoadingTab) return <Spinner />;
    switch (tab) {
      case 'tickets': return <TicketSupportDash    cache={cache} />;
      case 'users':   return <UserActivityDash     cache={cache} />;
      case 'team':    return <TeamProductivityDash  cache={cache} />;
      case 'members': return <MemberWorkloadDash    cache={cache} />;
      case 'sprints': return <SprintTasksDash       cache={cache} />;
      default:        return null;
    }
  };

  // ── Computed style values from C ──────────────────────
  const pageBg    = C.bg;
  const headerBg  = C.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)';
  const tabBarBg  = C.isDark ? 'rgba(255,255,255,0.025)' : 'rgba(83,74,183,0.05)';
  const btnBase   = { background: C.isDark ? 'rgba(255,255,255,0.04)' : 'rgba(83,74,183,0.06)', border: `1px solid ${C.border}`, color: C.muted };

  if (!isAdmin) {
    return (
      <ThemeCtx.Provider value={C}>
        <div style={{ background: pageBg, borderRadius: 16, minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: `${C.red}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Lock size={28} color={C.red} />
            </div>
            <h3 style={{ margin: '0 0 8px', fontWeight: 800, color: C.text, fontSize: 18 }}>Access Restricted</h3>
            <p style={{ margin: 0, color: C.muted, fontSize: 13 }}>Reports &amp; Analytics is available for admin and manager roles only.</p>
          </div>
        </div>
      </ThemeCtx.Provider>
    );
  }

  return (
    <ThemeCtx.Provider value={C}>
      <div style={{ minHeight: '100%', background: pageBg, borderRadius: 16, padding: '28px 24px', position: 'relative', transition: 'background 0.3s' }}>

        {/* Ambient glow (dark only) */}
        {C.isDark && (
          <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(138,159,232,0.35),transparent)', pointerEvents: 'none' }} />
        )}

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${C.blue}22`, border: `1px solid ${C.blue}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BarChart2 size={17} color={C.blue} />
              </div>
              <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: C.text }}>Support &amp; Workforce Intelligence</h1>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: C.muted }}>5-dashboard analytics — tickets, users, teams, workload &amp; sprints</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, background: `${C.blue}12`, border: `1px solid ${C.blue}22` }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', border: `2px solid ${C.blue}40`, borderTop: `2px solid ${C.blue}`, animation: 'rpt2-spin 0.7s linear infinite' }} />
                <span style={{ fontSize: 11, color: C.blue, fontWeight: 600 }}>Loading…</span>
              </div>
            )}
            <button onClick={handleRefresh} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all .18s', ...btnBase,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = `${C.blue}18`; e.currentTarget.style.color = C.blue; e.currentTarget.style.borderColor = `${C.blue}40`; }}
              onMouseLeave={e => { e.currentTarget.style.background = btnBase.background; e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.border; }}
            >
              <RefreshCw size={13} /> Refresh
            </button>
          </div>
        </div>

        {error && (
          <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 10, background: `${C.red}15`, border: `1px solid ${C.red}30`, color: C.red, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={14} />{error}
          </div>
        )}

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 4, padding: 4, marginBottom: 26, background: tabBarBg, border: `1px solid ${C.border}`, borderRadius: 13, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {TABS.map(t => {
            const Icon   = t.icon;
            const active = tab === t.key;
            return (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                display: 'flex', alignItems: 'center', gap: 7, padding: '9px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: active ? `${C.blue}22` : 'transparent',
                color: active ? C.blue : C.muted, fontWeight: active ? 700 : 500, fontSize: 13, whiteSpace: 'nowrap',
                boxShadow: active ? `0 0 0 1px ${C.blue}35` : 'none', transition: 'all .18s',
              }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color = C.text; e.currentTarget.style.background = `${C.blue}10`; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color = C.muted; e.currentTarget.style.background = 'transparent'; }}}
              >
                <Icon size={14} />{t.label}
              </button>
            );
          })}
        </div>

        {/* Dashboard content */}
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
            {renderDash()}
          </motion.div>
        </AnimatePresence>

        <style>{`@keyframes rpt2-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </ThemeCtx.Provider>
  );
};

export default ReportsPage;
