import React, { useState, useRef, useEffect } from 'react';
import homeImg from './images/home.png';

/* ── Custom Select Dropdown ──────────────────────────────────── */
function CustomSelect({ value, onChange, options, placeholder, style, className }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find(o => (typeof o === 'object' ? o.value : o) === value);
  const displayLabel = selected
    ? (typeof selected === 'object' ? selected.label : selected)
    : (placeholder || 'Select...');

  function handleSelect(val) {
    onChange({ target: { value: val } });
    setOpen(false);
  }

  return (
    <div
      ref={ref}
      className={'custom-select-wrap ' + (className || '')}
      style={{ position: 'relative', ...style }}
    >
      <button
        type="button"
        className={'custom-select-btn' + (open ? ' open' : '')}
        onClick={() => setOpen(v => !v)}
      >
        <span className="custom-select-val">{displayLabel}</span>
        <svg className="custom-select-arrow" width="12" height="7" viewBox="0 0 12 7" fill="none">
          <path d="M1 1l5 5 5-5" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul className="custom-select-list">
          {placeholder && (
            <li
              className={'custom-select-opt' + (!value ? ' selected' : '')}
              onClick={() => handleSelect('')}
            >
              {placeholder}
            </li>
          )}
          {options.map((o, i) => {
            const val = typeof o === 'object' ? o.value : o;
            const lbl = typeof o === 'object' ? o.label : o;
            return (
              <li
                key={i}
                className={'custom-select-opt' + (value === val ? ' selected' : '')}
                onClick={() => handleSelect(val)}
              >
                {lbl}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
/* ── Custom Confirmation Modal ───────────────────────────────── */
function ConfirmModal({ isOpen, title, message, confirmText = 'Delete', cancelText = 'Cancel', onConfirm, onCancel, type = 'danger' }) {
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999999,
      padding: 16,
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        maxWidth: 420,
        width: '100%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        padding: '24px 24px 20px 24px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: type === 'danger' ? '#fee2e2' : '#e0f2fe',
          color: type === 'danger' ? '#dc2626' : '#0284c7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 26,
          margin: '0 auto 16px auto'
        }}>
          {type === 'danger' ? '⚠️' : '❓'}
        </div>
        <h3 style={{ margin: '0 0 8px 0', fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
          {title || 'Confirm Action'}
        </h3>
        <p style={{ margin: '0 0 24px 0', fontSize: 14, color: '#64748b', lineHeight: 1.5 }}>
          {message || 'Are you sure you want to proceed?'}
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 10,
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer'
            }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: 10,
              border: 'none',
              background: type === 'danger' ? 'linear-gradient(135deg, #dc2626, #b91c1c)' : 'linear-gradient(135deg, #1b5e20, #2e7d32)',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)'
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
/* ────────────────────────────────────────────────────────────── */

/* ── Form Modal (for forms with ≤ 10 fields) ─────────────────── */
function FormModal({ isOpen, onClose, title, icon, onSubmit, children, submitLabel = 'Save', cancelLabel = 'Cancel', size = 'md' }) {
  React.useEffect(() => {
    function handleKey(e) { if (e.key === 'Escape' && isOpen) onClose && onClose(); }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const maxWidths = { sm: 480, md: 620, lg: 820 };
  const maxW = maxWidths[size] || maxWidths.md;

  return (
    <div className="form-modal-backdrop" onClick={onClose}>
      <div className="form-modal-card" style={{ maxWidth: maxW }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="form-modal-header">
          {icon && (
            <div style={{ width: 38, height: 38, borderRadius: 10, background: '#e8f5e9', border: '1px solid #c8e6c9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: '#1b5e20', flexShrink: 0 }}>
              {icon}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.01em', fontFamily: 'inherit' }}>{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ border: 'none', background: 'transparent', color: '#64748b', width: 30, height: 30, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0, transition: 'all 0.15s ease' }}
            onMouseOver={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#0f172a'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
          >
            ✕
          </button>
        </div>
        {/* Body */}
        <div className="form-modal-body">{children}</div>
        {/* Footer */}
        <div className="form-modal-footer">
          <button
            type="button"
            onClick={onClose}
            style={{ padding: '9px 18px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#ffffff', color: '#334155', fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.15s ease' }}
            onMouseOver={e => e.currentTarget.style.background = '#f8fafc'}
            onMouseOut={e => e.currentTarget.style.background = '#ffffff'}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onSubmit}
            style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: '#1b5e20', color: '#ffffff', fontWeight: 600, fontSize: 14, cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', transition: 'all 0.15s ease' }}
            onMouseOver={e => e.currentTarget.style.background = '#2e7d32'}
            onMouseOut={e => e.currentTarget.style.background = '#1b5e20'}
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Full Page Form (for forms with many fields) ─────────────── */
function FullPageForm({ isOpen, onClose, title, icon, onSubmit, children, submitLabel = 'Save', cancelLabel = 'Cancel', subtitle }) {
  React.useEffect(() => {
    function handleKey(e) { if (e.key === 'Escape' && isOpen) onClose && onClose(); }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fullpage-backdrop" onClick={onClose}>
      <div className="fullpage-panel" onClick={e => e.stopPropagation()}>
        {/* Sticky Header */}
        <div className="fullpage-header">
          {icon && (
            <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
              {icon}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#fff' }}>{title}</h2>
            {subtitle && <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>{subtitle}</div>}
          </div>
          <button type="button" onClick={onClose} style={{ border: 'none', background: 'rgba(255,255,255,0.15)', color: '#fff', width: 36, height: 36, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700 }}>✕</button>
        </div>
        {/* Scrollable Body */}
        <div className="fullpage-body">{children}</div>
        {/* Sticky Footer */}
        <div className="fullpage-footer">
          <button type="button" onClick={onClose} style={{ padding: '11px 24px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', color: '#334155', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>{cancelLabel}</button>
          <button type="button" onClick={onSubmit} style={{ padding: '11px 28px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#1b5e20,#2e7d32)', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 14px rgba(27,94,32,0.35)' }}>{submitLabel}</button>
        </div>
      </div>
    </div>
  );
}
/* ────────────────────────────────────────────────────────────── */



function Header({ onOpenOrder, onNavHome, onOpenAdmin, frontendLocation, setFrontendLocation, availableLocations }) {
  return (
    <header className="site-header">
      <div className="header-inner" style={{ maxWidth: 'var(--container)', margin: '0 auto' }}>
        {/* Logo */}
        <div className="logo" style={{ cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); onNavHome && onNavHome() }}>
          <img src="/images/logo.svg" alt="Village Lunch" style={{ height: 40 }} />
          <div className="logo-text">
            <span className="logo-name">Village Lunch</span>
            <span className="logo-tagline">Taste the Tradition</span>
          </div>
        </div>

        {availableLocations && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 16 }}>📍</span>
            <select
              value={frontendLocation}
              onChange={(e) => setFrontendLocation(e.target.value)}
              style={{
                padding: '5px 20px 5px 10px', borderRadius: 8, border: '1px solid var(--border-color)',
                background: 'var(--bg-warm)', fontSize: 13, fontWeight: 600, color: 'var(--text-main)',
                cursor: 'pointer', outline: 'none', appearance: 'auto'
              }}
            >
              {availableLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        )}

        {/* Nav */}
        <nav className="nav">
          <a href="#home" onClick={(e) => { e.preventDefault(); onNavHome && onNavHome() }}>Home</a>
          <a href="#about">About Us</a>
          <a href="#menu">Menu</a>
          <a href="#gallery">Gallery</a>
          <a href="#reviews">Reviews</a>
          <a href="#contact">Contact</a>
        </nav>

        {/* Phone + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href="tel:+919019831951" className="header-phone">
            📞 +91 9019831951
          </a>
          <div className="actions">
            <button className="order" onClick={(e) => { e.preventDefault(); onOpenOrder && onOpenOrder() }}>🛒 Order Now</button>
          </div>
        </div>
      </div>
    </header>
  )
}

function AdminSubNav({ active, setActive }) {
  const links = ['Dashboard', 'Staff Dashboard', 'Menu / Food Management', 'Order Management', 'Reports & Analytics', 'Settings'];
  return (
    <div className="admin-subnav" style={{ marginBottom: 12 }}>
      <nav className="nav" style={{ display: 'flex', gap: 12 }}>
        {links.map(l => (
          <a key={l} href="#" onClick={(e) => { e.preventDefault(); setActive && setActive(l) }} className={l === active ? 'active' : ''}
            style={{ padding: '8px 10px', borderRadius: 6, background: 'transparent', color: l === active ? 'var(--accent)' : 'inherit', textDecoration: 'none', borderBottom: l === active ? '3px solid rgba(47,107,58,0.9)' : '3px solid transparent', transition: 'border-color .18s ease' }}>{l}</a>
        ))}
      </nav>
    </div>
  )
}

function StaffDashboard() {
  const [todayTasks, setTodayTasks] = useState([
    { id: 1, task: 'Prepare lunch specials (Village Thali & Biryani)', status: 'In Progress', done: false },
    { id: 2, task: 'Inventory check for rice & masalas', status: 'Completed', done: true },
    { id: 3, task: 'Dispatch evening takeaway orders', status: 'Pending', done: false },
    { id: 4, task: 'Clean & sanitize kitchen station B', status: 'Pending', done: false },
  ]);

  const toggleTask = (id) => {
    setTodayTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done, status: !t.done ? 'Completed' : 'Pending' } : t));
  };

  const attendanceSummary = { present: 18, absent: 2, onLeave: 1 };

  const hourlyActivity = [
    { hour: '8 AM', orders: 12 },
    { hour: '10 AM', orders: 18 },
    { hour: '12 PM', orders: 45 },
    { hour: '2 PM', orders: 38 },
    { hour: '4 PM', orders: 22 },
    { hour: '6 PM', orders: 35 },
    { hour: '8 PM', orders: 52 },
  ];

  const staffKpis = [
    { id: 's1', title: "Today's Orders Assigned", value: '34', trend: '+12%', icon: '📦', bgColor: '#e0f2fe', iconColor: '#0284c7' },
    { id: 's2', title: 'Kitchen Prep Queue', value: '5', trend: '-2', icon: '🍳', bgColor: '#fef3c7', iconColor: '#d97706' },
    { id: 's3', title: 'Avg Order Prep Time', value: '14m', trend: '-3m fast', icon: '⚡', bgColor: '#ecfdf5', iconColor: '#10b981' },
    { id: 's4', title: 'Attendance Score', value: '96%', trend: '24/25 days', icon: '🏆', bgColor: '#ede9fe', iconColor: '#7c3aed' },
  ];

  return (
    <section className="staff-dashboard container" style={{ padding: '12px 0' }}>
      <div className="kpi-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 20 }}>
        {staffKpis.map(k => (
          <div key={k.id} className="card kpi-interactive-card" style={{ padding: '18px 20px', background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 110 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>{k.title}</span>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: k.bgColor, color: k.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700 }}>
                {k.icon}
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a' }}>{k.value}</div>
              <div style={{ fontSize: 12, color: '#16a34a', fontWeight: 500, marginTop: 2 }}>{k.trend} vs average</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-section" style={{ marginBottom: 20 }}>
        <div className="dashboard-left" style={{ flex: 1.5 }}>
          <div className="card">
            <div className="card-head">
              <h4>Hourly Order Activity (Today)</h4>
              <small style={{ color: '#666' }}>Peak hours: 12 PM - 2 PM & 8 PM</small>
            </div>
            <div className="chart-area" style={{ height: 180, marginTop: 12 }}>
              <svg viewBox="0 0 500 140" preserveAspectRatio="none" width="100%" height="100%">
                {hourlyActivity.map((d, i) => {
                  const max = 60;
                  const x = (i / (hourlyActivity.length - 1)) * 460 + 20;
                  const barHeight = (d.orders / max) * 100;
                  const y = 120 - barHeight;
                  return (
                    <g key={i}>
                      <rect x={x - 14} y={y} width="28" height={barHeight} rx="6" fill="url(#staffChartGrad)" />
                      <text x={x} y={136} fontSize="11" textAnchor="middle" fill="#666">{d.hour}</text>
                      <text x={x} y={y - 6} fontSize="11" fontWeight="bold" textAnchor="middle" fill="#2f6b3a">{d.orders}</text>
                    </g>
                  );
                })}
                <defs>
                  <linearGradient id="staffChartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2f6b3a" />
                    <stop offset="100%" stopColor="#5aa35e" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        <div className="dashboard-right" style={{ flex: 1 }}>
          <div className="card">
            <h4>Workplace Attendance Summary</h4>
            <div className="att-summary" style={{ display: 'flex', justify: 'space-around', padding: '14px 0', background: '#f9fafb', borderRadius: 10, marginTop: 10 }}>
              <div style={{ textAlign: 'center' }}><div style={{ fontSize: 22, fontWeight: 800, color: '#2f6b3a' }}>{attendanceSummary.present}</div><small style={{ color: '#666' }}>Present</small></div>
              <div style={{ textAlign: 'center' }}><div style={{ fontSize: 22, fontWeight: 800, color: '#c96b2c' }}>{attendanceSummary.absent}</div><small style={{ color: '#666' }}>Absent</small></div>
              <div style={{ textAlign: 'center' }}><div style={{ fontSize: 22, fontWeight: 800, color: '#2b7aa6' }}>{attendanceSummary.onLeave}</div><small style={{ color: '#666' }}>On Leave</small></div>
            </div>
            <div style={{ marginTop: 14 }}>
              <StartWorkButton />
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="dashboard-left" style={{ flex: 1.5 }}>
          <div className="card">
            <h4>Today's Assigned Tasks</h4>
            <ul className="task-list" style={{ listStyle: 'none', padding: 0, margin: '10px 0 0' }}>
              {todayTasks.map(t => (
                <li key={t.id} style={{ display: 'flex', alignItems: 'center', justify: 'space-between', padding: '10px 12px', background: t.done ? '#f0fdf4' : '#fafafa', borderRadius: 8, marginBottom: 8, border: '1px solid #eee' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textDecoration: t.done ? 'line-through' : 'none', color: t.done ? '#888' : '#222' }}>
                    <input type="checkbox" checked={t.done} onChange={() => toggleTask(t.id)} style={{ width: 18, height: 18, accentColor: '#2f6b3a' }} />
                    <strong>{t.task}</strong>
                  </label>
                  <span className={`status-badge ${t.done ? 'done' : 'in-progress'}`} style={{ padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700, background: t.done ? '#dcfce7' : '#fef3c7', color: t.done ? '#15803d' : '#b45309' }}>
                    {t.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="dashboard-right" style={{ flex: 1 }}>
          <div className="card">
            <h4>Quick Actions</h4>
            <div className="quick-actions" style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
              <button className="btn primary" style={{ justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 6 }}>📋 View Active Orders</button>
              <button className="btn outline" style={{ justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 6 }}>📅 Request Leave</button>
              <button className="btn outline" style={{ justifyContent: 'center', display: 'flex', alignItems: 'center', gap: 6 }}>👤 Edit Profile</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function KPICards() {
  const kpis = [
    { id: 'k1', title: "Today's Orders", value: 24, trend: +8, suffix: '', color: 'linear-gradient(90deg,#2f6b3a,#5aa35e)' },
    { id: 'k2', title: 'Pending Orders', value: 6, trend: -12, suffix: '', color: 'linear-gradient(90deg,#c96b2c,#e07a3f)' },
    { id: 'k3', title: 'Avg Prep Time', value: '18m', trend: -5, suffix: '', color: 'linear-gradient(90deg,#2b7aa6,#5fb0dd)' },
    { id: 'k4', title: 'Attendance Rate', value: '90%', trend: +2, suffix: '', color: 'linear-gradient(90deg,#6b4ea3,#9b7fd6)' },
  ];

  return (
    <div className="kpi-row" style={{ marginBottom: 16 }}>
      {kpis.map(k => (
        <div key={k.id} className="kpi-card" style={{ background: k.color }}>
          <div className="kpi-top">
            <div className="kpi-title">{k.title}</div>
            <div className={"kpi-trend " + (k.trend >= 0 ? 'up' : 'down')}>{k.trend > 0 ? '▲' : k.trend < 0 ? '▼' : ''} {Math.abs(k.trend)}%</div>
          </div>
          <div className="kpi-value">{k.value}{k.suffix}</div>
          <div className="kpi-foot">Compared to last period</div>
        </div>
      ))}
    </div>
  )
}

function StaffAttendanceModule() {
  const [staffList, setStaffList] = useState([]);
  const [att, setAtt] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ staff: null, date: new Date().toISOString().slice(0, 10), present: true, shift: '', note: '' });

  React.useEffect(() => {
    let m = true;
    (async () => {
      try {
        const api = await import('./api');
        const [s, a] = await Promise.all([api.fetchStaff(), api.fetchStaffAttendance()]);
        if (!m) return;
        setStaffList(s || []);
        if (s && s.length > 0) setForm(f => ({ ...f, staff: f.staff || s[0].id }));
      } catch (e) { }
      finally { if (m) setLoading(false) }
    })();
    return () => m = false;
  }, []);

  async function mark() {
    try {
      const api = await import('./api');
      const created = await api.createStaffAttendance({ ...form, staff: parseInt(form.staff, 10) });
      setAtt(s => [created, ...s]);

      setForm(f => ({ ...f, note: '', shift: '' }));
    } catch (e) { alert('Failed to save attendance (maybe already exists).') }
  }

  if (loading) return <div>Loading attendance...</div>

  return (
    <div>
      <div className="module-actions">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select value={form.staff || ''} onChange={e => setForm({ ...form, staff: e.target.value })}>
            {staffList.map(s => <option key={s.id} value={s.id}>{s.name} — {s.role}</option>)}
          </select>
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
          <label style={{ display: 'flex', alignItems: 'center' }}><input type="checkbox" checked={form.present} onChange={e => setForm({ ...form, present: e.target.checked })} /> Present</label>
          <input placeholder="Shift" value={form.shift} onChange={e => setForm({ ...form, shift: e.target.value })} />
          <input placeholder="Note" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
          <button className="btn" onClick={mark}>Mark</button>
        </div>
      </div>

      <table className="admin-table"><thead><tr><th>Staff</th><th>Date</th><th>Present</th><th>Start Time</th><th>Shift</th><th>Note</th></tr></thead>
        <tbody>
          {att.map(a => {
            const s = staffList.find(x => x.id === a.staff) || staffList.find(x => x.id == a.staff) || { name: a.staff };
            const start = a.start_time || a.startTime || null;
            return (<tr key={a.id}><td>{s.name || a.staff}</td><td>{a.date}</td><td>{a.present ? 'Yes' : 'No'}</td><td>{start ? new Date(start).toLocaleString() : '—'}</td><td>{a.shift}</td><td>{a.note}</td></tr>)
          })}
        </tbody>
      </table>

    </div>
  )
}

function LeaveManagementModule() {
  const [staffList, setStaffList] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ staff: null, date: new Date().toISOString().slice(0, 10), reason: '' });

  React.useEffect(() => {
    let m = true;
    (async () => {
      try {
        const api = await import('./api');
        const [s, a] = await Promise.all([api.fetchStaff(), api.fetchStaffAttendance()]);
        if (!m) return;
        setStaffList(s || []);
        // leaves are attendances marked absent
        setLeaves((a || []).filter(x => !x.present));
        if (s && s.length > 0) setForm(f => ({ ...f, staff: f.staff || s[0].id }));
      } catch (e) { }
      finally { if (m) setLoading(false) }
    })();
    return () => m = false;
  }, []);

  async function requestLeave() {
    try {
      const api = await import('./api');
      const created = await api.createStaffAttendance({ staff: parseInt(form.staff, 10), date: form.date, present: false, note: 'Leave: ' + (form.reason || '') });
      setLeaves(s => [created, ...s]);
      setForm(f => ({ ...f, reason: '' }));
    } catch (e) { alert('Failed to request leave (maybe attendance exists).') }
  }

  if (loading) return <div>Loading leaves...</div>

  return (
    <div>
      <div className="module-actions">
        <select value={form.staff || ''} onChange={e => setForm({ ...form, staff: e.target.value })}>
          {staffList.map(s => <option key={s.id} value={s.id}>{s.name} — {s.role}</option>)}
        </select>
        <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
        <input placeholder="Reason" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} />
        <button className="btn" onClick={requestLeave}>Request Leave</button>
      </div>

      <table className="admin-table"><thead><tr><th>Staff</th><th>Date</th><th>Note</th></tr></thead>
        <tbody>{leaves.map(l => {
          const s = staffList.find(x => x.id === l.staff) || { name: l.staff };
          return <tr key={l.id}><td>{s.name}</td><td>{l.date}</td><td>{l.note}</td></tr>
        })}</tbody>
      </table>
    </div>
  )
}

function StaffProfile() {
  // show logged-in staff info from localStorage when available
  const [me, setMe] = useState(null);
  React.useEffect(() => {
    try { const s = JSON.parse(localStorage.getItem('staff_auth') || 'null'); setMe(s); } catch (e) { }
  }, [])
  if (!me) return (<div><h4>My Profile</h4><p>Please login to see your profile.</p></div>)
  return (<div><h4>My Profile</h4><p>Name: {me.name}<br />Role: {me.role}<br />ID: {me.id}</p></div>)
}

function AuthModal({ open, role = 'staff', onClose, onSuccess }) {
  const [activeRole, setActiveRole] = useState(role);
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [animating, setAnimating] = useState(false);

  React.useEffect(() => {
    setActiveRole(role);
    setErrorMsg('');
    setSuccessMsg('');
  }, [role, open]);

  React.useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && open) {
        onClose && onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  async function handleSubmit(e) {
    e && e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!form.email || !form.password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    if (mode === 'register' && !form.name) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    setLoading(true);
    try {
      const api = await import('./api');
      let res;
      if (mode === 'register') {
        res = await api.registerStaff({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          role: activeRole === 'admin' ? 'admin' : 'staff'
        });
        setSuccessMsg('Registration successful! Logging you in...');
      } else {
        res = await api.loginStaff({ email: form.email, password: form.password });
        setSuccessMsg('Login successful! Redirecting...');
      }

      const authData = {
        id: res.id || 1,
        name: res.name || form.name || 'User',
        role: res.role || activeRole,
        email: res.email || form.email
      };
      localStorage.setItem('staff_auth', JSON.stringify(authData));

      setTimeout(() => {
        setLoading(false);
        onSuccess && onSuccess(authData);
      }, 500);
    } catch (err) {
      setLoading(false);
      const msg = (err && (err.detail || err.message)) || 'Authentication failed. Please check your details.';
      setErrorMsg(msg);
    }
  }

  function fillDemoCredentials(demoRole) {
    setActiveRole(demoRole);
    setMode('login');
    if (demoRole === 'admin') {
      setForm({ name: '', email: 'admin@villagelunch.com', password: 'admin123password', phone: '' });
    } else {
      setForm({ name: '', email: 'staff@villagelunch.com', password: 'staff123password', phone: '' });
    }
    setErrorMsg('');
  }

  function switchMode(newMode) {
    if (newMode === mode) return;
    setAnimating(true);
    setTimeout(() => { setMode(newMode); setErrorMsg(''); setAnimating(false); }, 200);
  }

  return (
    <div className="auth-fullscreen-overlay" onClick={onClose}>
      <div className="auth-fullscreen-card" onClick={e => e.stopPropagation()}>

        {/* ── Left Branding Panel ── */}
        <div className="auth-brand-panel">
          <button className="auth-back-btn" onClick={onClose} aria-label="Back to home">
            ← Back to Home
          </button>
          <div className="auth-brand-content">
            <div className="auth-brand-logo">
              <div className="auth-logo-icon">🍛</div>
              <div>
                <div className="auth-logo-name">Village Lunch</div>
                <div className="auth-logo-tag">Taste the Tradition</div>
              </div>
            </div>
            <h2 className="auth-brand-headline">
              {activeRole === 'admin'
                ? 'Admin Command Center'
                : 'Staff Management Portal'}
            </h2>
            <p className="auth-brand-sub">
              {activeRole === 'admin'
                ? 'Manage orders, staff, and analytics for your entire restaurant operation.'
                : 'Track attendance, manage leaves, and stay connected with your team.'}
            </p>
            <div className="auth-brand-features">
              {activeRole === 'admin' ? (
                <>
                  <div className="auth-feature-item"><span className="auth-feature-dot"></span>Full Dashboard &amp; Analytics</div>
                  <div className="auth-feature-item"><span className="auth-feature-dot"></span>Staff &amp; Order Management</div>
                  <div className="auth-feature-item"><span className="auth-feature-dot"></span>Real-time Reports</div>
                </>
              ) : (
                <>
                  <div className="auth-feature-item"><span className="auth-feature-dot"></span>Attendance Tracking</div>
                  <div className="auth-feature-item"><span className="auth-feature-dot"></span>Leave Management</div>
                  <div className="auth-feature-item"><span className="auth-feature-dot"></span>Personal Dashboard</div>
                </>
              )}
            </div>
            {/* Decorative floating cards */}
            <div className="auth-deco-card auth-deco-card-1">
              <span>📊</span>
              <div>
                <div className="auth-deco-label">Today's Orders</div>
                <div className="auth-deco-value">142</div>
              </div>
            </div>
            <div className="auth-deco-card auth-deco-card-2">
              <span>👥</span>
              <div>
                <div className="auth-deco-label">Active Staff</div>
                <div className="auth-deco-value">28</div>
              </div>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="auth-deco-circle auth-deco-circle-1"></div>
          <div className="auth-deco-circle auth-deco-circle-2"></div>
        </div>

        {/* ── Right Form Panel ── */}
        <div className="auth-form-panel">
          {/* Role Switcher Pills */}
          <div className="auth-role-pills">
            <button
              type="button"
              className={`auth-role-pill ${activeRole === 'staff' ? 'active' : ''}`}
              onClick={() => { setActiveRole('staff'); setErrorMsg(''); }}
            >
              <span>👨‍🍳</span> Staff
            </button>
            <button
              type="button"
              className={`auth-role-pill ${activeRole === 'admin' ? 'active' : ''}`}
              onClick={() => { setActiveRole('admin'); setErrorMsg(''); }}
            >
              <span>🛡️</span> Admin
            </button>
          </div>

          {/* Form Header */}
          <div className="auth-form-header">
            <div className="auth-form-icon">
              {activeRole === 'admin' ? '🛡️' : '👨‍🍳'}
            </div>
            <h2 className="auth-form-title">
              {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p className="auth-form-subtitle">
              {mode === 'login'
                ? `Sign in to your ${activeRole === 'admin' ? 'Admin' : 'Staff'} account`
                : `Register as a new ${activeRole === 'admin' ? 'Admin' : 'Staff'} member`}
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="auth-mode-strip">
            <button
              type="button"
              className={`auth-mode-btn ${mode === 'login' ? 'active' : ''}`}
              onClick={() => switchMode('login')}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-mode-btn ${mode === 'register' ? 'active' : ''}`}
              onClick={() => switchMode('register')}
            >
              Register
            </button>
            <div className={`auth-mode-indicator ${mode === 'register' ? 'right' : ''}`}></div>
          </div>

          {/* Alerts */}
          {errorMsg && (
            <div className="auth-alert-banner error">
              <span className="auth-alert-icon">⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="auth-alert-banner success">
              <span className="auth-alert-icon">✅</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className={`auth-pro-form ${animating ? 'fade-out' : 'fade-in'}`}>
            {mode === 'register' && (
              <div className="auth-field">
                <label className="auth-field-label">Full Name</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  </span>
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="e.g. Rahul Sharma"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
              </div>
            )}

            <div className="auth-field">
              <label className="auth-field-label">Email Address</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                </span>
                <input
                  type="email"
                  className="auth-input"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <div className="auth-field-labelrow">
                <label className="auth-field-label">Password</label>
                {mode === 'login' && <button type="button" className="auth-forgot-link">Forgot password?</button>}
              </div>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  )}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div className="auth-field">
                <label className="auth-field-label">Phone Number <span className="auth-optional">(Optional)</span></label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6.09 6.09l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  </span>
                  <input
                    type="tel"
                    className="auth-input"
                    placeholder="+91 9019831951"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>
            )}

            <button type="submit" className="auth-pro-submit" disabled={loading}>
              {loading ? (
                <span className="btn-spinner-wrap">
                  <span className="btn-spinner"></span> Processing...
                </span>
              ) : mode === 'login' ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
                  Sign In as {activeRole === 'admin' ? 'Admin' : 'Staff'}
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Switch Mode Link */}
          <p className="auth-switch-text">
            {mode === 'login' ? (
              <>Don't have an account?{' '}
                <button type="button" className="auth-switch-link" onClick={() => switchMode('register')}>
                  Register here
                </button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button type="button" className="auth-switch-link" onClick={() => switchMode('login')}>
                  Sign In
                </button>
              </>
            )}
          </p>

          {/* Demo Credentials */}
          <div className="auth-demo-section">
            <div className="auth-demo-label">⚡ Quick Demo Access</div>
            <div className="auth-demo-btns">
              <button type="button" className="auth-demo-btn staff" onClick={() => fillDemoCredentials('staff')}>
                <span>👨‍🍳</span>
                <div>
                  <div className="auth-demo-btn-title">Demo Staff</div>
                  <div className="auth-demo-btn-sub">staff@villagelunch.com</div>
                </div>
              </button>
              <button type="button" className="auth-demo-btn admin" onClick={() => fillDemoCredentials('admin')}>
                <span>🛡️</span>
                <div>
                  <div className="auth-demo-btn-title">Demo Admin</div>
                  <div className="auth-demo-btn-sub">admin@villagelunch.com</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


function StaffPanel({ onClose }) {
  const modules = [
    { key: 'Dashboard', icon: '📊', label: 'Dashboard' },
    { key: 'Attendance', icon: '📅', label: 'Attendance' },
    { key: 'Leave Management', icon: '🏖️', label: 'Leave' },
    { key: 'Profile', icon: '👤', label: 'Profile' },
  ];
  const [active, setActive] = useState(modules[0].key);
  return (
    <section className="admin container" style={{ paddingTop: 16 }}>
      <div className="portal-top-bar staff-theme">
        <div className="portal-top-brand">
          <span className="portal-icon">👨‍🍳</span>
          <div>
            <h3 className="portal-title">Staff Workspace</h3>
            <span className="portal-sub">Kitchen & Attendance Operations Dashboard</span>
          </div>
        </div>
        <div className="portal-top-user">
          <div className="user-badge">
            👤 {(() => { try { const s = JSON.parse(localStorage.getItem('staff_auth') || 'null'); return s ? `${s.name} (${s.role || 'Staff'})` : 'Staff Member' } catch (e) { return 'Staff Member' } })()}
          </div>
          <button className="portal-exit-btn" onClick={onClose}>
            Exit Portal 🚪
          </button>
        </div>
      </div>

      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="admin-logo">👨‍🍳 Staff</div>
          <ul>
            {modules.map(m => (
              <li key={m.key} className={m.key === active ? 'active' : ''} onClick={() => setActive(m.key)}>
                <span className="sidebar-icon">{m.icon}</span>
                <span className="sidebar-label">{m.label}</span>
              </li>
            ))}
          </ul>
        </aside>
        <main className="admin-main">
          <div className="admin-header">
            <h2>{modules.find(m => m.key === active)?.icon} {modules.find(m => m.key === active)?.key}</h2>
            <div className="admin-actions"><StartWorkButton /></div>
          </div>
          <div className="admin-content">
            {active === 'Dashboard' && <StaffDashboard />}
            {active === 'Attendance' && <StaffAttendanceModule />}
            {active === 'Leave Management' && <LeaveManagementModule />}
            {active === 'Profile' && <StaffProfile />}
          </div>
        </main>
      </div>
    </section>
  )
}

function StartWorkButton({ staffId }) {
  const [loading, setLoading] = useState(false);
  const [checkedAt, setCheckedAt] = useState(null);

  async function doStart(id) {
    setLoading(true);
    try {
      const api = await import('./api');
      const res = await api.startWork(id);
      setCheckedAt(res.start_time || res.startTime || null);
      alert('Checked in at ' + (res.start_time || res.startTime || 'unknown'));
    } catch (e) {
      console.error(e);
      alert('Failed to start work');
    } finally { setLoading(false) }
  }

  async function handle() {
    const me = JSON.parse(localStorage.getItem('staff_auth') || 'null');
    if (me && me.id) { doStart(me.id); return; }
    if (staffId) { doStart(staffId); return; }
    try {
      const api = await import('./api');
      const staff = await api.fetchStaff();
      if (!staff || staff.length === 0) { alert('No staff found'); return; }
      if (staff.length === 1) { doStart(staff[0].id); return; }
      const list = staff.map(s => `${s.id}: ${s.name} (${s.role})`).join('\n');
      const pick = window.prompt('Enter staff id to start work:\n' + list);
      if (!pick) return;
      const id = parseInt(pick, 10);
      if (!id) return;
      doStart(id);
    } catch (e) { console.error(e); alert('Failed to fetch staff') }
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <button className="btn" onClick={handle} disabled={loading}>{loading ? 'Starting...' : 'Start Work'}</button>
      {checkedAt && <small style={{ color: '#666' }}>Checked in: {new Date(checkedAt).toLocaleString()}</small>}
    </span>
  )
}

function DashboardPage() {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [hoveredKpi, setHoveredKpi] = React.useState(null);

  async function loadDashboard() {
    setLoading(true);
    try {
      const api = await import('./api');
      const res = await api.fetchDashboard();
      setData(res);
    } catch (e) { console.warn('dashboard fetch failed', e); setData(null); }
    finally { setLoading(false); }
  }

  React.useEffect(() => {
    let m = true;
    if (m) loadDashboard();
    return () => { m = false; };
  }, []);

  /* ── helpers ── */
  const today = new Date();
  const todayStr = today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const curYear = today.getFullYear();
  const curMonth = today.getMonth();
  const firstDay = new Date(curYear, curMonth, 1).getDay();
  const daysInMonth = new Date(curYear, curMonth + 1, 0).getDate();
  const calDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const monthName = today.toLocaleString('default', { month: 'long', year: 'numeric' });

  /* ── data from API (with fallbacks) ── */
  const totalEmployee = data?.total_employee || 0;
  const todayspresent = data?.todayspresent || 0;
  const Absent = data?.Absent || 0;
  const attendanceRate = totalEmployee > 0 ? Math.round((todayspresent / totalEmployee) * 100) : 0;

  /* ── static sample events (replace with API data when available) ── */
  const anniversaries = [
    { name: 'Rahul Sharma', role: 'Head Chef', years: 5, initials: 'RS', bg: '#dbeafe', color: '#1d4ed8', date: 'Sep 10' },
    { name: 'Priya Verma', role: 'Manager', years: 3, initials: 'PV', bg: '#f3e8ff', color: '#7c3aed', date: 'Sep 12' },
    { name: 'Sunil Singh', role: 'Waiter', years: 2, initials: 'SS', bg: '#dcfce7', color: '#15803d', date: 'Sep 18' },
  ];

  const birthdays = [
    { name: 'Meena Devi', role: 'Cashier', dob: 'Sep 10', initials: 'MD', bg: '#fce7f3', color: '#be185d' },
    { name: 'Amit Kumar', role: 'Kitchen Helper', dob: 'Sep 14', initials: 'AK', bg: '#fef9c3', color: '#ca8a04' },
    { name: 'Kavya Reddy', role: 'Receptionist', dob: 'Sep 22', initials: 'KR', bg: '#f3e8ff', color: '#7c3aed' },
  ];

  /* ── KPI card config ── */
  const kpiCards = [
    {
      key: 'total', label: 'Total Employees', value: loading ? '…' : totalEmployee,
      sub: 'Registered in system', accent: '#1d4ed8', iconBg: '#dbeafe', iconColor: '#1d4ed8',
      svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    },
    {
      key: 'present', label: 'Present Today', value: loading ? '…' : todayspresent,
      sub: `${attendanceRate}% attendance rate`, accent: '#15803d', iconBg: '#dcfce7', iconColor: '#15803d',
      svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
    },
    {
      key: 'absent', label: 'Absent Today', value: loading ? '…' : Absent,
      sub: Absent > 0 ? 'Action needed' : 'All staff present!', accent: '#dc2626', iconBg: '#fee2e2', iconColor: '#dc2626',
      svg: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
    },
  ];

  return (
    <section style={{ padding: '0 0 48px' }}>

      {/* ── Header ── */}


      {/* ── 3 KPI Cards — White default, accent on hover ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
        {[
          {
            key: 'total',
            label: 'Total Employees',
            value: loading ? '…' : totalEmployee,
            sub: 'Registered in system',
            footer: 'Active this month',
            badge: '👥 All Staff',
            hoverGrad: 'linear-gradient(135deg,#1e40af,#3b82f6)',
            hoverBorder: '#93c5fd',
            hoverBadgeBg: 'rgba(255,255,255,0.22)',
            barWidth: '100%',
            svg: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>),
          },
          {
            key: 'present',
            label: 'Present Today',
            value: loading ? '…' : todayspresent,
            sub: 'Staff checked-in on time',
            footer: 'Attendance rate',
            badge: `✓ ${attendanceRate}%`,
            hoverGrad: 'linear-gradient(135deg,#15803d,#22c55e)',
            hoverBorder: '#86efac',
            hoverBadgeBg: 'rgba(255,255,255,0.22)',
            barWidth: `${attendanceRate}%`,
            svg: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>),
          },
          {
            key: 'absent',
            label: 'Absent Today',
            value: loading ? '…' : Absent,
            sub: 'Unexcused / on leave',
            footer: `Out of ${totalEmployee} total`,
            badge: Absent > 0 ? '⚠ Action needed' : '✓ All present',
            hoverGrad: Absent > 0 ? 'linear-gradient(135deg,#b91c1c,#ef4444)' : 'linear-gradient(135deg,#475569,#64748b)',
            hoverBorder: Absent > 0 ? '#fca5a5' : '#cbd5e1',
            hoverBadgeBg: 'rgba(255,255,255,0.22)',
            barWidth: totalEmployee > 0 ? `${Math.min((Absent / totalEmployee) * 100, 100)}%` : '0%',
            svg: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>),
          },
        ].map(k => {
          const isHov = hoveredKpi === k.key;
          return (
            <div
              key={k.key}
              onMouseEnter={() => setHoveredKpi(k.key)}
              onMouseLeave={() => setHoveredKpi(null)}
              style={{
                borderRadius: 18,
                overflow: 'hidden',
                border: `1.5px solid ${isHov ? k.hoverBorder : '#e8edf2'}`,
                background: isHov ? k.hoverGrad : '#fff',
                boxShadow: isHov ? '0 12px 36px rgba(0,0,0,0.14)' : '0 2px 10px rgba(0,0,0,0.05)',
                transition: 'all 0.28s cubic-bezier(.4,0,.2,1)',
                cursor: 'default',
              }}
            >
              {/* top section */}
              <div style={{ padding: '22px 24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 6, color: isHov ? 'rgba(255,255,255,0.75)' : '#94a3b8' }}>
                    {k.label}
                  </div>
                  <div style={{ fontSize: 46, fontWeight: 900, letterSpacing: '-2px', lineHeight: 1, color: isHov ? '#fff' : '#0f172a' }}>
                    {k.value}
                  </div>
                </div>
                <div style={{
                  width: 50, height: 50, borderRadius: 14, flexShrink: 0,
                  background: isHov ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                  color: isHov ? '#fff' : '#64748b',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.28s',
                }}>
                  {k.svg}
                </div>
              </div>
              {/* body */}
              <div style={{ padding: '0 24px 20px' }}>
                <div style={{ fontSize: 12, marginBottom: 10, color: isHov ? 'rgba(255,255,255,0.7)' : '#64748b' }}>
                  {k.sub}
                </div>
                {/* progress bar */}
                <div style={{ height: 5, borderRadius: 99, overflow: 'hidden', marginBottom: 12, background: isHov ? 'rgba(255,255,255,0.2)' : '#f1f5f9' }}>
                  <div style={{ height: '100%', width: k.barWidth, background: isHov ? 'rgba(255,255,255,0.7)' : '#1a4731', borderRadius: 99, transition: 'width 0.7s ease' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: isHov ? 'rgba(255,255,255,0.65)' : '#94a3b8' }}>{k.footer}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 800, padding: '3px 11px', borderRadius: 20,
                    background: isHov ? 'rgba(255,255,255,0.22)' : '#f1f5f9',
                    color: isHov ? '#fff' : '#334155',
                    border: isHov ? '1px solid rgba(255,255,255,0.3)' : '1px solid #e2e8f0',
                    transition: 'all 0.28s',
                  }}>{k.badge}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Main Grid: Calendar | Anniversary & Birthday ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 22 }}>

        {/* ── Attendance Calendar ── */}
        <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 20, padding: '26px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 9 }}>
                <span style={{ background: '#dbeafe', color: '#1d4ed8', width: 32, height: 32, borderRadius: 9, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>📅</span>
                Attendance Calendar
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#94a3b8' }}>Monthly view · green = present, red = off/absent</p>
            </div>
            <span style={{ background: '#f1f5f9', color: '#475569', fontWeight: 700, fontSize: 12, padding: '5px 14px', borderRadius: 20, border: '1px solid #e2e8f0' }}>{monthName}</span>
          </div>

          {/* Day labels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 6 }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
              <div key={d} style={{ textAlign: 'center', fontSize: 10, fontWeight: 800, color: i === 0 || i === 6 ? '#ef4444' : '#94a3b8', paddingBottom: 4 }}>{d}</div>
            ))}
          </div>

          {/* Calendar cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
            {Array.from({ length: firstDay }).map((_, i) => <div key={'b' + i} style={{ height: 38 }} />)}
            {calDays.map(d => {
              const isToday = d === today.getDate();
              const dow = (firstDay + d - 1) % 7;
              const isSun = dow === 0;
              const isSat = dow === 6;
              const isPast = d < today.getDate();
              const isPresent = isPast && !isSun && !isSat;
              const isOff = (isSun || isSat);
              return (
                <div key={d} title={isToday ? 'Today' : isOff ? 'Weekly Off' : isPast ? 'Present' : 'Upcoming'} style={{
                  height: 38, borderRadius: 9,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: isToday ? 900 : 600, cursor: 'pointer',
                  position: 'relative',
                  background: isToday ? 'linear-gradient(135deg,#1a4731,#2d6a4f)'
                    : isPresent ? '#f0fdf4'
                      : isOff ? '#fef2f2'
                        : '#f8fafc',
                  color: isToday ? '#fff'
                    : isPresent ? '#15803d'
                      : isOff ? '#dc2626'
                        : '#94a3b8',
                  border: isToday ? '2px solid #e07b39'
                    : isPresent ? '1px solid #bbf7d0'
                      : isOff ? '1px solid #fecaca'
                        : '1px solid #f1f5f9',
                  boxShadow: isToday ? '0 4px 12px rgba(26,71,49,0.28)' : 'none',
                }}>
                  {d}
                  {isToday && <span style={{ position: 'absolute', bottom: 4, width: 4, height: 4, background: '#e07b39', borderRadius: '50%' }} />}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px dashed #e2e8f0', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[
              { c: '#22c55e', l: 'Present' },
              { c: '#ef4444', l: 'Off / Absent' },
              { c: '#1a4731', l: 'Today' },
              { c: '#94a3b8', l: 'Upcoming' },
            ].map(lg => (
              <div key={lg.l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: '#64748b' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: lg.c, display: 'inline-block' }} />
                {lg.l}
              </div>
            ))}
          </div>
        </div>

        {/* ── Right column: Anniversary + Birthdays ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Work Anniversary Card */}
          <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 20, padding: '22px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ background: '#fef9c3', color: '#ca8a04', width: 30, height: 30, borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🏆</span>
                Work Anniversaries
              </h3>
              <span style={{ background: '#fef9c3', color: '#ca8a04', fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 20 }}>This Month</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {anniversaries.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 13px', borderRadius: 12, background: '#fffbeb', border: '1.5px solid #fde68a' }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: a.bg, color: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
                    {a.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name}</div>
                    <div style={{ fontSize: 11, color: '#92400e' }}>{a.role}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: 900, fontSize: 15, color: '#ca8a04' }}>{a.years}yr</div>
                    <div style={{ fontSize: 10, color: '#94a3b8' }}>{a.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Birthday Card */}
          <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 20, padding: '22px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ background: '#fce7f3', color: '#be185d', width: 30, height: 30, borderRadius: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🎂</span>
                Birthdays
              </h3>
              <span style={{ background: '#fce7f3', color: '#be185d', fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 20 }}>This Month</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {birthdays.map((b, i) => {
                const isToday = b.dob === `${today.toLocaleString('default', { month: 'short' })} ${today.getDate()}`;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 13px', borderRadius: 12, background: isToday ? '#fdf2f8' : '#fafafa', border: `1.5px solid ${isToday ? '#f9a8d4' : '#f1f5f9'}` }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: b.bg, color: b.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
                      {b.initials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {b.name}
                        {isToday && <span style={{ background: '#ec4899', color: '#fff', fontSize: 9, fontWeight: 800, padding: '1px 6px', borderRadius: 20, letterSpacing: '0.5px' }}>TODAY</span>}
                      </div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>{b.role}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 14 }}>🎉</div>
                      <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>{b.dob}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}


function AdminPanel({ onClose }) {
  const modules = [
    { key: 'Dashboard', icon: '📊', label: 'Dashboard' },
    { key: 'Daily Attendance', icon: '📅', label: 'Attendance' },
    { key: 'Daily Groceries', icon: '🛒', label: 'Groceries' },
    { key: 'Menu / Food Management', icon: '🍽️', label: 'Menu' },
    { key: 'Order Management', icon: '📦', label: 'Orders' },
    { key: 'Payment Management', icon: '💳', label: 'Payments' },
    { key: 'Offers & Coupons', icon: '🎟️', label: 'Offers' },
    { key: 'Reviews & Ratings', icon: '⭐', label: 'Reviews' },
    { key: 'Staff / Employee Management', icon: '🧑‍💼', label: 'Employees' },
    { key: 'Delivery Management', icon: '🚚', label: 'Delivery' },
    { key: 'Restaurant / Branch Management', icon: '🏪', label: 'Branches' },
    { key: 'Notifications', icon: '🔔', label: 'Alerts' },
    { key: 'Reports & Analytics', icon: '📈', label: 'Reports' },
    { key: 'Settings', icon: '⚙️', label: 'Settings' },
  ];

  const [active, setActive] = useState(modules[0].key);

  return (
    <section className="admin container" style={{ paddingTop: 16 }}>


      <div className="admin-shell">
        <aside className="admin-sidebar">
          <ul>
            {modules.map(m => (
              <li key={m.key} className={m.key === active ? 'active' : ''} onClick={() => setActive(m.key)}>
                <span className="sidebar-icon">{m.icon}</span>
                <span className="sidebar-label">{m.label}</span>
              </li>
            ))}
          </ul>
        </aside>

        <main className="admin-main">
          <div className="admin-header">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <h2 style={{ margin: 0 }}>{modules.find(m => m.key === active)?.icon} {modules.find(m => m.key === active)?.key}</h2>
            </div>
          </div>
          <div className="admin-content">
            {active === 'Dashboard' && <AdminDashModule />}
            {active === 'Daily Attendance' && <AttendanceManagement />}
            {active === 'Daily Groceries' && <GroceriesManagement />}
            {active === 'Menu / Food Management' && <MenuManagement />}
            {active === 'Category Management' && <CategoryManagement />}
            {active === 'Order Management' && <OrderManagement />}
            {active === 'Customer Management' && <CustomerManagement />}
            {active === 'Payment Management' && <PaymentManagement />}
            {active === 'Offers & Coupons' && <OffersManagement />}
            {active === 'Banner / Homepage Management' && <BannerManagement />}
            {active === 'Reviews & Ratings' && <ReviewsManagement />}
            {active === 'Inventory Management' && <InventoryManagement />}
            {active === 'Staff / Employee Management' && <Staff />}
            {active === 'Delivery Management' && <DeliveryManagement />}
            {active === 'Restaurant / Branch Management' && <BranchManagement />}
            {active === 'Notifications' && <NotificationsManagement />}
            {active === 'Reports & Analytics' && <ReportsManagement />}
            {active === 'Settings' && <SettingsManagement />}
          </div>
        </main>
      </div>
    </section>
  )
}

function AdminDashModule() {
  return <DashboardPage />;
}

function MenuManagement() {
  const [items, setItems] = useState([]);
  const [cats, setCats] = useState([]);
  const [locs, setLocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', location: null, description: '', available: true, category: null, image_url: '', bestseller: false, recommended: false, is_active: true });

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const api = await import('./api');
        let [mi, categories, locations] = await Promise.all([api.fetchMenuItems(), api.fetchCategories(), api.fetchLocations()]);
        if (!mounted) return;

        // Auto-seed default city locations if none exist in DB
        if (!locations || locations.length === 0) {
          const defaultLocNames = ['Athani Branch', 'Belagavi Central Branch', 'Bangalore Outlet'];
          const seeded = [];
          for (const locName of defaultLocNames) {
            try {
              if (api.createLocation) {
                const createdLoc = await api.createLocation({ name: locName, address: 'Karnataka Branch' });
                seeded.push(createdLoc);
              }
            } catch (err) { }
          }
          if (seeded.length > 0) locations = seeded;
        }

        setItems(Array.isArray(mi) ? mi : []);
        setCats(Array.isArray(categories) ? categories : []);
        setLocs(Array.isArray(locations) ? locations : []);
        if (locations && locations.length > 0) setForm(f => ({ ...f, location: locations[0].id }));
      } catch (e) {
        console.error('MenuManagement load error:', e);
      } finally { if (mounted) setLoading(false); }
    }
    load();
    return () => mounted = false;
  }, []);

  async function add() {
    if (!form.name || !form.name.trim()) return alert('Please enter item name');
    if (!form.price || isNaN(form.price)) return alert('Please enter a valid price');
    try {
      const api = await import('./api');
      let currentLocs = locs;
      if (!currentLocs || currentLocs.length === 0) {
        try {
          const loc = await api.createLocation({ name: 'Athani Branch', address: 'Karnataka Branch' });
          currentLocs = [loc];
          setLocs(currentLocs);
        } catch (err) { }
      }
      const targetLoc = form.location || (currentLocs.length > 0 ? currentLocs[0].id : null);
      if (!targetLoc) {
        return alert('Please create or select a Branch / Location first.');
      }
      const payload = {
        name: form.name.trim(),
        price: parseFloat(form.price),
        description: form.description || '',
        location: parseInt(targetLoc),
        category: form.category ? parseInt(form.category) : (cats.length > 0 ? cats[0].id : null),
        image_url: form.image_url || '',
        available: form.available !== false,
        bestseller: Boolean(form.bestseller),
        recommended: Boolean(form.recommended),
        is_active: form.is_active !== false
      };
      const created = await api.createMenuItem(payload);
      setItems(s => [created, ...s]);
      setShowForm(false);
      setForm({ name: '', price: '', location: currentLocs.length > 0 ? currentLocs[0].id : null, description: '', available: true, category: null, image_url: '', bestseller: false, recommended: false, is_active: true });
    } catch (e) {
      console.error('Create menu item error:', e);
      alert('Could not save menu item: ' + (e.message || 'Check inputs.'));
    }
  }

  async function saveEdit() {
    if (!form.name || !form.name.trim()) return alert('Please enter item name');
    if (!form.price || isNaN(form.price)) return alert('Please enter a valid price');
    try {
      const api = await import('./api');
      const targetLoc = form.location || (locs.length > 0 ? locs[0].id : null);
      const payload = {
        name: form.name.trim(),
        price: parseFloat(form.price),
        description: form.description || '',
        location: parseInt(targetLoc),
        category: form.category ? parseInt(form.category) : (cats.length > 0 ? cats[0].id : null),
        image_url: form.image_url || '',
        available: form.available !== false,
        bestseller: Boolean(form.bestseller),
        recommended: Boolean(form.recommended),
        is_active: form.is_active !== false
      };
      const updated = await api.updateMenuItem(editingId, payload);
      setItems(s => s.map(it => it.id === updated.id ? updated : it));
      setEditingId(null);
      setShowForm(false);
      setForm({ name: '', price: '', location: locs.length > 0 ? locs[0].id : null, description: '', available: true, category: null, image_url: '', bestseller: false, recommended: false, is_active: true });
    } catch (e) { alert('Failed to update item: ' + (e.message || 'Check inputs.')) }
  }

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  async function confirmRemove() {
    if (!deleteConfirmId) return;
    const id = deleteConfirmId;
    setDeleteConfirmId(null);
    try {
      const api = await import('./api');
      await api.deleteMenuItem(id);
      setItems(s => s.filter(it => it.id !== id));
    } catch (e) { alert('Failed to delete') }
  }

  function startEdit(it) {
    setEditingId(it.id);
    setForm({
      name: it.name || '', price: it.price || '', location: it.location || null, description: it.description || '', available: it.available === undefined ? true : it.available,
      category: it.category || null, image_url: it.image_url || '', bestseller: it.bestseller || false, recommended: it.recommended || false, is_active: it.is_active === undefined ? true : it.is_active
    });
    setShowForm(true);
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div className="module-actions" style={{ marginBottom: 16 }}>
        <button
          className="btn primary"
          onClick={() => {
            setEditingId(null);
            setForm({ name: '', price: '', location: null, description: '', available: true, category: null, image_url: '', bestseller: false, recommended: false, is_active: true });
            setShowForm(true);
          }}
          style={{ padding: '10px 18px', borderRadius: 8, fontWeight: 700 }}
        >
          + Add Food Item
        </button>
      </div>

      {/* ── Food Item FormModal ── */}
      <FormModal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingId(null); setForm({ name: '', price: '', location: null, description: '', available: true, category: null, image_url: '', bestseller: false, recommended: false, is_active: true }); }}
        title={editingId ? 'Edit Food Item' : 'Add New Food Item'}
        icon="🍲"
        onSubmit={(e) => { if (e) e.preventDefault(); editingId ? saveEdit() : add(); }}
        submitLabel={editingId ? 'Save Changes' : 'Create Food Item'}
        size="lg"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Row 1: Item Name, Price, Category */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6, color: '#334155' }}>Item Name *</label>
              <input
                required
                placeholder="e.g. Butter Chicken, Paneer Tikka"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 14 }}
              />
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6, color: '#334155' }}>Price (₹) *</label>
              <input
                required
                type="number"
                step="0.01"
                placeholder="Price in ₹"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 14 }}
              />
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6, color: '#334155' }}>Category *</label>
              <CustomSelect
                value={form.category ? String(form.category) : ''}
                onChange={e => setForm({ ...form, category: e.target.value ? (isNaN(e.target.value) ? e.target.value : parseInt(e.target.value)) : null })}
                placeholder="Select Category"
                options={cats.map(c => ({ value: String(c.id), label: c.name }))}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Row 2: Branch / Location & Upload Item Image side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, alignItems: 'flex-start' }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6, color: '#334155' }}>Branch / Location</label>
              <CustomSelect
                value={form.location ? String(form.location) : ''}
                onChange={e => setForm({ ...form, location: e.target.value ? (isNaN(e.target.value) ? e.target.value : parseInt(e.target.value)) : null })}
                placeholder="Select Location"
                options={locs.map(c => ({ value: String(c.id), label: c.name }))}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6, color: '#334155' }}>Upload Item Image</label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <label
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 16px',
                    borderRadius: 8,
                    background: '#f8fafc',
                    border: '1px dashed #cbd5e1',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 13,
                    color: '#334155',
                    transition: 'all 0.15s ease'
                  }}
                >
                  📁 Choose / Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const img = new Image();
                          img.onload = () => {
                            const canvas = document.createElement('canvas');
                            const maxDim = 120;
                            let w = img.width, h = img.height;
                            if (w > h) { h = Math.round((h * maxDim) / w); w = maxDim; }
                            else { w = Math.round((w * maxDim) / h); h = maxDim; }
                            canvas.width = w;
                            canvas.height = h;
                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(img, 0, 0, w, h);
                            const resized = canvas.toDataURL('image/jpeg', 0.6);
                            setForm({ ...form, image_url: resized });
                          };
                          img.src = reader.result;
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                {form.image_url && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', padding: '4px 10px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                    <img src={form.image_url} alt="Preview" style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 6 }} />
                    <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>✓ Selected</span>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image_url: '' })}
                      style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 14, fontWeight: 700, padding: '0 4px' }}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6, color: '#334155' }}>Description</label>
            <textarea
              rows="2"
              placeholder="Short delicious description of the dish..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 14, fontFamily: 'inherit' }}
            />
          </div>
        </div>

        {/* Toggles & Options */}
        <div style={{ marginTop: 18, display: 'flex', flexWrap: 'wrap', gap: 20, padding: '12px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #f1f5f9' }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.available} onChange={e => setForm({ ...form, available: e.target.checked })} style={{ width: 16, height: 16 }} />
            Available for Order
          </label>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.bestseller} onChange={e => setForm({ ...form, bestseller: e.target.checked })} style={{ width: 16, height: 16 }} />
            🌟 Bestseller
          </label>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.recommended} onChange={e => setForm({ ...form, recommended: e.target.checked })} style={{ width: 16, height: 16 }} />
            👍 Chef's Recommended
          </label>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} style={{ width: 16, height: 16 }} />
            Active Status
          </label>
        </div>
      </FormModal>
      <table className="admin-table"><thead><tr><th>Image</th><th>Name</th><th>Price</th><th>Category</th><th>Available</th><th>Actions</th></tr></thead>
        <tbody>
          {items.map(it => {
            const cat = cats.find(c => c.id === it.category) || cats.find(c => c.id == it.category);
            return (<tr key={it.id}>
              <td style={{ width: 120 }}>{it.image_url ? (<img src={it.image_url} alt={it.name} style={{ width: 96, height: 64, objectFit: 'cover', borderRadius: 6 }} />) : '—'}</td>
              <td>{it.name}{it.bestseller ? ' 🌟' : ''}{it.recommended ? ' 👍' : ''}</td>
              <td>₹{it.price}</td>
              <td>{cat ? cat.name : it.category}</td>
              <td>{it.available ? 'Yes' : 'No'}</td>
              <td>
                <button className="btn" onClick={() => startEdit(it)}>Edit</button>
                <button className="btn" onClick={() => setDeleteConfirmId(it.id)}>Delete</button>
                <button className="btn" onClick={async () => {
                  try { const api = await import('./api'); const upd = await api.updateMenuItem(it.id, { ...it, is_active: !it.is_active }); setItems(s => s.map(x => x.id === it.id ? upd : x)); } catch (e) { alert('Failed') }
                }}>{it.is_active ? 'Deactivate' : 'Activate'}</button>
              </td>
            </tr>)
          })}
        </tbody>
      </table>
      <ConfirmModal
        isOpen={Boolean(deleteConfirmId)}
        title="Delete Menu Item"
        message="Are you sure you want to delete this menu item?"
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmRemove}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  )
}

function CategoryManagement() {
  const [cats, setCats] = useState([]);
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const api = await import('./api');
      const res = await api.fetchCategories();
      setCats(Array.isArray(res) ? res : []);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadCategories();
  }, []);

  async function add(e) {
    if (e) e.preventDefault();
    if (!name.trim()) return alert('Please enter category name');
    try {
      const api = await import('./api');
      const created = await api.createCategory({ name, image_url: imageUrl });
      setCats(s => [created, ...s]);
      setName('');
      setImageUrl('');
      setShowForm(false);
    } catch (e) { alert('Failed to create category') }
  }

  async function confirmDelete() {
    if (!deleteConfirmId) return;
    const id = deleteConfirmId;
    setDeleteConfirmId(null);
    try {
      const api = await import('./api');
      if (api.deleteCategory) {
        await api.deleteCategory(id);
      }
    } catch (e) { }
    setCats(prev => prev.filter(c => c.id !== id));
  }

  if (loading) return <div style={{ padding: 20 }}>Loading categories...</div>;

  return (
    <div>
      <div className="module-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <button
          className="btn primary"
          onClick={() => setShowForm(true)}
          style={{ padding: '10px 18px', borderRadius: 8, fontWeight: 700 }}
        >
          + Add New Category
        </button>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>
          Total Categories: {cats.length}
        </div>
      </div>

      {/* ── Category FormModal ── */}
      <FormModal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setName(''); setImageUrl(''); }}
        onSubmit={add}
        title="Add New Food Category"
        icon="🏷️"
        submitLabel="Save Category"
        size="sm"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="form-field">
            <label>Category Name *</label>
            <input
              required
              placeholder="e.g. Starters, Main Course, Desserts, Beverages"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>Category Image (Optional)</label>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderRadius: 8, background: '#f1f5f9', border: '1.5px dashed #94a3b8', cursor: 'pointer', fontWeight: 600, fontSize: 13, color: '#334155' }}>
                📁 Upload Image
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setImageUrl(reader.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
              {imageUrl && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', padding: '4px 10px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                  <img src={imageUrl} alt="Preview" style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 6 }} />
                  <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 700 }}>✓ Selected</span>
                  <button type="button" onClick={() => setImageUrl('')} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 700 }}>✕</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </FormModal>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {cats.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: 24, textAlign: 'center', color: '#94a3b8', background: '#fff', borderRadius: 12 }}>
            No categories added yet. Click "+ Add New Category" to create one.
          </div>
        ) : cats.map((c, idx) => {
          const catName = typeof c === 'object' ? (c.name || '') : String(c);
          const catImg = (typeof c === 'object' && typeof c.image_url === 'string') ? c.image_url : (typeof c.image_url === 'object' ? (c.image_url.image_url || '') : '');
          const catId = typeof c === 'object' ? (c.id || idx) : idx;
          return (
            <div
              key={catId}
              className="card"
              style={{
                padding: 16,
                background: '#ffffff',
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {catImg ? (
                  <img src={catImg} alt={catName} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: 44, height: 44, borderRadius: 8, background: '#f1f5f9', color: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700 }}>
                    🏷️
                  </div>
                )}
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 15 }}>
                  {catName}
                </div>
              </div>
              <button
                onClick={() => setDeleteConfirmId(typeof c === 'object' ? c.id : c)}
                style={{ border: 'none', background: '#fee2e2', color: '#dc2626', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}
                title="Delete Category"
              >
                🗑️
              </button>
            </div>
          );
        })}
      </div>

      <ConfirmModal
        isOpen={Boolean(deleteConfirmId)}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
}

function OrderManagement() {
  const orders = [{ id: 'VL1023', name: 'Rahul', items: 2, amount: 380, status: 'Pending', time: '2026-09-02 12:12' }, { id: 'VL1022', name: 'Priya', items: 1, amount: 180, status: 'Delivered', time: '2026-09-01 19:20' }];
  return (
    <div>
      <table className="admin-table"><thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>{orders.map(o => (<tr key={o.id}><td>{o.id}</td><td>{o.name}</td><td>{o.items}</td><td>₹{o.amount}</td><td>{o.status}</td><td><button className="btn">Details</button></td></tr>))}</tbody></table>
    </div>
  )
}

function CustomerManagement() {
  const customers = [{ name: 'Rahul', orders: 5, spent: 1200 }, { name: 'Priya', orders: 3, spent: 760 }];
  return (<div><table className="admin-table"><thead><tr><th>Name</th><th>Orders</th><th>Spent</th></tr></thead><tbody>{customers.map((c, i) => (<tr key={i}><td>{c.name}</td><td>{c.orders}</td><td>₹{c.spent}</td></tr>))}</tbody></table></div>)
}

function PaymentManagement() {
  return (<div><p>Paid, pending, failed payments list placeholder.</p></div>)
}

function OffersManagement() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: '',
    discount_type: 'percent',
    discount_value: '',
    min_order_amount: '',
    expiry_date: '',
    description: '',
    is_active: true
  });

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const api = await import('./api');
        const res = await api.fetchCoupons();
        if (mounted && Array.isArray(res)) setCoupons(res);
      } catch (e) {
        if (mounted) setCoupons([{ id: 1, code: 'VILLAGE20', discount_type: 'percent', discount_value: 20, min_order_amount: 300, expiry_date: '2026-12-31', is_active: true }]);
      } finally { if (mounted) setLoading(false); }
    }
    load();
    return () => mounted = false;
  }, []);

  async function handleAdd() {
    if (!form.code || !form.discount_value) {
      alert('Please fill in coupon code and discount value');
      return;
    }
    try {
      const api = await import('./api');
      const created = await api.createCoupon({
        code: form.code.toUpperCase(),
        discount_type: form.discount_type,
        discount_value: parseFloat(form.discount_value) || 0,
        min_order_amount: parseFloat(form.min_order_amount) || 0,
        expiry_date: form.expiry_date || null,
        description: form.description || '',
        is_active: form.is_active
      });
      setCoupons(prev => [created, ...prev]);
      setShowForm(false);
      setForm({ code: '', discount_type: 'percent', discount_value: '', min_order_amount: '', expiry_date: '', description: '', is_active: true });
    } catch (e) {
      const newC = {
        id: Date.now(),
        code: form.code.toUpperCase(),
        discount_type: form.discount_type,
        discount_value: parseFloat(form.discount_value) || 0,
        min_order_amount: parseFloat(form.min_order_amount) || 0,
        expiry_date: form.expiry_date || '2026-12-31',
        is_active: form.is_active
      };
      setCoupons(prev => [newC, ...prev]);
      setShowForm(false);
      setForm({ code: '', discount_type: 'percent', discount_value: '', min_order_amount: '', expiry_date: '', description: '', is_active: true });
    }
  }

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  async function confirmDelete() {
    if (!deleteConfirmId) return;
    const id = deleteConfirmId;
    setDeleteConfirmId(null);
    try {
      const api = await import('./api');
      await api.deleteCoupon(id);
    } catch (e) { }
    setCoupons(prev => prev.filter(c => c.id !== id));
  }

  return (
    <div>
      <div className="module-actions" style={{ display: 'flex', justify: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <button className="btn primary" onClick={() => setShowForm(true)}>
          + Add New Coupon / Offer
        </button>
      </div>

      {/* ── Offers/Coupon FormModal ── */}
      <FormModal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setForm({ code: '', discount_type: 'percent', discount_value: '', min_order_amount: '', expiry_date: '', description: '', is_active: true }); }}
        onSubmit={handleAdd}
        title="Create Offer / Coupon"
        icon="🎟️"
        submitLabel="Save Coupon"
        size="md"
      >
        <div className="form-field-grid" style={{ gap: 16 }}>
          <div className="form-field">
            <label>Coupon Code *</label>
            <input placeholder="e.g. FESTIVE50" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
          </div>
          <div className="form-field">
            <label>Discount Type</label>
            <CustomSelect
              style={{ width: '100%' }}
              value={form.discount_type}
              onChange={e => setForm({ ...form, discount_type: e.target.value })}
              options={[
                { value: 'percent', label: 'Percentage (%)' },
                { value: 'flat', label: 'Flat Amount (₹)' }
              ]}
            />
          </div>
          <div className="form-field">
            <label>Discount Value *</label>
            <input type="number" placeholder="e.g. 20 or 100" value={form.discount_value} onChange={e => setForm({ ...form, discount_value: e.target.value })} />
          </div>
          <div className="form-field">
            <label>Min Order Amount (₹)</label>
            <input type="number" placeholder="e.g. 300" value={form.min_order_amount} onChange={e => setForm({ ...form, min_order_amount: e.target.value })} />
          </div>
          <div className="form-field">
            <label>Expiry Date</label>
            <input type="date" value={form.expiry_date} onChange={e => setForm({ ...form, expiry_date: e.target.value })} />
          </div>
          <div className="form-field">
            <label>Description (Optional)</label>
            <input placeholder="Short description..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
        </div>
      </FormModal>

      {loading ? (
        <div>Loading coupons...</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Type</th>
              <th>Value</th>
              <th>Min Order</th>
              <th>Expiry</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: 20, color: '#888' }}>No coupons found. Click "+ Add New Coupon" to create one.</td></tr>
            ) : (
              coupons.map(c => (
                <tr key={c.id || c.code}>
                  <td><strong>{c.code}</strong></td>
                  <td>{c.discount_type === 'percent' ? 'Percentage' : 'Flat Amount'}</td>
                  <td>{c.discount_type === 'percent' ? `${c.discount_value}%` : `₹${c.discount_value}`}</td>
                  <td>₹{c.min_order_amount || 0}</td>
                  <td>{c.expiry_date || 'No Expiry'}</td>
                  <td><span className={`status-badge ${c.is_active !== false ? 'done' : 'cancelled'}`} style={{ padding: '4px 8px', borderRadius: 10, fontSize: 11, fontWeight: 700, background: c.is_active !== false ? '#dcfce7' : '#fee2e2', color: c.is_active !== false ? '#15803d' : '#dc2626' }}>{c.is_active !== false ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <button className="btn" style={{ color: '#dc2626', padding: '4px 8px', fontSize: 12, borderColor: '#fca5a5' }} onClick={() => setDeleteConfirmId(c.id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
      <ConfirmModal
        isOpen={Boolean(deleteConfirmId)}
        title="Delete Coupon"
        message="Are you sure you want to delete this coupon/offer?"
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
}

function BannerManagement() { return (<div><p>Banner list / upload placeholder.</p></div>) }
function ReviewsManagement() { return (<div><p>Reviews list with approve/hide actions placeholder.</p></div>) }
function InventoryManagement() { return (<div><p>Inventory stock management placeholder.</p></div>) }
function StaffManagement() { return (<div><p>Staff/employee CRUD placeholder.</p></div>) }
function Staff() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showInactive, setShowInactive] = useState(false); // INACTIVE HIDE BY DEFAULT
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'kitchen',
    salary: '',
    account_number: '',
    profile_picture: '',
    address: '',
    active: true
  });

  const rolesList = [
    { key: 'admin', label: '🛡️ Admin' },
    { key: 'manager', label: '👔 Manager' },
    { key: 'kitchen', label: '🍳 Kitchen Staff / Chef' },
    { key: 'waiter', label: '🍽️ Waiter / Waitress' },
    { key: 'cashier', label: '💵 Cashier' },
    { key: 'delivery', label: '🚚 Delivery Staff' },
    { key: 'cleaner', label: '🧹 Housekeeping / Cleaner' },
  ];

  const defaultAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  ];

  const loadStaff = async () => {
    setLoading(true);
    try {
      const api = await import('./api');
      const res = await api.fetchStaff();
      setStaffList(Array.isArray(res) ? res : []);
    } catch (e) {
      console.error('Failed to load staff list', e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadStaff();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name) {
      alert('Please fill in Staff Name');
      return;
    }
    try {
      const api = await import('./api');
      const payload = {
        name: form.name,
        email: form.email || '',
        phone: form.phone || '',
        role: form.role || 'kitchen',
        salary: parseFloat(form.salary) || 0,
        account_number: form.account_number || '',
        profile_picture: form.profile_picture || '',
        address: form.address || '',
        active: form.active !== false
      };

      if (editingId) {
        const updated = await api.updateStaff(editingId, payload);
        setStaffList(prev => prev.map(s => s.id === editingId ? updated : s));
      } else {
        const created = await api.createStaff(payload);
        setStaffList(prev => [created, ...prev]);
      }
      setShowForm(false);
      setEditingId(null);
      resetForm();
    } catch (err) {
      alert('Failed to save employee profile. Please try again.');
    }
  };

  const handleEdit = (s) => {
    setEditingId(s.id);
    setForm({
      name: s.name || '',
      email: s.email || '',
      phone: s.phone || '',
      role: s.role || 'kitchen',
      salary: s.salary || '',
      account_number: s.account_number || '',
      profile_picture: s.profile_picture || '',
      address: s.address || '',
      active: s.active !== false
    });
    setShowForm(true);
  };

  const [toggleConfirmItem, setToggleConfirmItem] = useState(null);

  const requestToggleActive = (s) => {
    setToggleConfirmItem(s);
  };

  const confirmToggleActive = async () => {
    if (!toggleConfirmItem) return;
    const s = toggleConfirmItem;
    setToggleConfirmItem(null);
    const newStatus = !s.active;
    try {
      const api = await import('./api');
      const updated = await api.updateStaff(s.id, { ...s, active: newStatus });
      setStaffList(prev => prev.map(item => item.id === s.id ? updated : item));
    } catch (e) {
      alert('Failed to update status.');
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      phone: '',
      role: 'kitchen',
      salary: '',
      account_number: '',
      profile_picture: '',
      address: '',
      active: true
    });
  };

  // Filter staff: HIDE inactive staff by default unless showInactive is checked!
  const filteredStaff = staffList.filter(s => {
    if (!showInactive && s.active === false) return false; // HIDE INACTIVE DATA BY DEFAULT
    if (roleFilter && s.role !== roleFilter) return false;
    if (searchTerm && !(
      (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.phone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.account_number || '').toLowerCase().includes(searchTerm.toLowerCase())
    )) return false;
    return true;
  });

  const activeStaffCount = staffList.filter(s => s.active !== false).length;
  const inactiveStaffCount = staffList.filter(s => s.active === false).length;
  const totalPayroll = staffList.filter(s => s.active !== false).reduce((acc, curr) => acc + (parseFloat(curr.salary) || 0), 0);

  return (
    <div className="employee-management-module">
      {/* Header & Add Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <button
          className="btn primary"
          onClick={() => {
            resetForm();
            setEditingId(null);
            setShowForm(true);
          }}
          style={{ padding: '10px 18px', borderRadius: 8, fontWeight: 700, fontSize: 14 }}
        >
          + Add New Staff / Employee
        </button>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#555', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff', padding: '6px 12px', borderRadius: 8, border: '1px solid #ddd' }}>
            <input
              type="checkbox"
              checked={showInactive}
              onChange={e => setShowInactive(e.target.checked)}
            />
            Show Inactive Staff ({inactiveStaffCount})
          </label>
        </div>
      </div>

      {/* Professional Employee KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 20 }}>
        {/* Card 1: Active Employees */}
        <div className="card kpi-interactive-card" style={{ padding: '18px 20px', background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>Active Employees</span>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#e8f5e9', color: '#1b5e20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700 }}>
              🧑‍💼
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a' }}>{activeStaffCount}</div>
            <div style={{ fontSize: 12, color: '#16a34a', fontWeight: 500, marginTop: 2 }}>Currently working staff</div>
          </div>
        </div>

        {/* Card 2: Monthly Salary Payroll */}
        <div className="card kpi-interactive-card" style={{ padding: '18px 20px', background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>Monthly Salary Payroll</span>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700 }}>
              💰
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a' }}>₹{totalPayroll.toLocaleString('en-IN')}</div>
            <div style={{ fontSize: 12, color: '#0284c7', fontWeight: 500, marginTop: 2 }}>Total active staff payroll</div>
          </div>
        </div>

        {/* Card 3: Inactive Staff */}
        <div className="card kpi-interactive-card" style={{ padding: '18px 20px', background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>Inactive / Hidden Staff</span>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fff3e0', color: '#e65100', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700 }}>
              ⏸️
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a' }}>{inactiveStaffCount}</div>
            <div style={{ fontSize: 12, color: showInactive ? '#16a34a' : '#d97706', fontWeight: 500, marginTop: 2 }}>{showInactive ? 'Showing in table' : 'Hidden from view'}</div>
          </div>
        </div>
      </div>

      {/* ── Employee FormModal ── */}
      <FormModal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingId(null); resetForm(); }}
        title={editingId ? 'Edit Staff Member Details' : 'Add New Staff Member'}
        icon="🧑‍💼"
        onSubmit={handleSave}
        submitLabel={editingId ? 'Save Profile Changes' : 'Add Staff Member'}
        size="lg"
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Staff Full Name *</label>
            <input
              required
              type="text"
              placeholder="e.g. Ramesh Kumar"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              style={{ width: '100%', padding: 9, borderRadius: 6, border: '1.5px solid #ccc' }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Role / Position *</label>
            <CustomSelect
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
              style={{ width: '100%' }}
              options={rolesList.map(r => ({ value: r.key, label: r.label }))}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Phone Number</label>
            <input
              type="text"
              placeholder="e.g. 9019831951"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              style={{ width: '100%', padding: 9, borderRadius: 6, border: '1.5px solid #ccc' }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Email Address</label>
            <input
              type="email"
              placeholder="e.g. ramesh@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              style={{ width: '100%', padding: 9, borderRadius: 6, border: '1.5px solid #ccc' }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Monthly Salary (₹)</label>
            <input
              type="number"
              placeholder="e.g. 25000"
              value={form.salary}
              onChange={e => setForm({ ...form, salary: e.target.value })}
              style={{ width: '100%', padding: 9, borderRadius: 6, border: '1.5px solid #ccc' }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Bank Account Number</label>
            <input
              type="text"
              placeholder="e.g. 123456789012"
              value={form.account_number}
              onChange={e => setForm({ ...form, account_number: e.target.value })}
              style={{ width: '100%', padding: 9, borderRadius: 6, border: '1.5px solid #ccc' }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6, color: 'var(--text-main)' }}>
              Staff Profile Picture
            </label>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', background: 'var(--surface-hover)', padding: 14, borderRadius: 12, border: '1px solid var(--border-color)' }}>
              {/* Live Preview Avatar */}
              <div style={{ position: 'relative', width: 60, height: 60, flexShrink: 0 }}>
                {form.profile_picture ? (
                  <img
                    src={form.profile_picture}
                    alt="Preview"
                    style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)', boxShadow: 'var(--shadow-xs)' }}
                  />
                ) : (
                  <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 22, border: '2px solid var(--border-color)' }}>
                    {form.name ? form.name.charAt(0).toUpperCase() : '📷'}
                  </div>
                )}
                {form.profile_picture && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, profile_picture: '' })}
                    title="Clear photo"
                    style={{ position: 'absolute', top: -4, right: -4, width: 20, height: 20, borderRadius: '50%', background: 'var(--danger-text)', color: '#fff', border: 'none', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Upload File & URL Controls */}
              <div style={{ flex: 1, minWidth: 220, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <label className="btn sm primary" style={{ cursor: 'pointer', margin: 0 }}>
                    📁 Upload Photo File
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files && e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setForm(prev => ({ ...prev, profile_picture: reader.result }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  <span style={{ fontSize: 12, color: 'var(--text-light)' }}>or paste URL below:</span>
                </div>

                <input
                  type="text"
                  placeholder="Paste image link URL (e.g. https://...)"
                  value={form.profile_picture}
                  onChange={e => setForm({ ...form, profile_picture: e.target.value })}
                  style={{ width: '100%', padding: '7px 12px', fontSize: 13 }}
                />
              </div>

              {/* Quick Avatar Presets */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>Or Pick Quick Avatar:</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {defaultAvatars.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="avatar"
                      onClick={() => setForm({ ...form, profile_picture: url })}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        cursor: 'pointer',
                        border: form.profile_picture === url ? '3px solid var(--primary)' : '1px solid var(--border-color)',
                        transition: 'all 0.15s ease'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Address / Contact Details</label>
            <textarea
              rows="2"
              placeholder="Enter complete residential address..."
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              style={{ width: '100%', padding: 9, borderRadius: 6, border: '1.5px solid #ccc', fontFamily: 'inherit' }}
            />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginTop: 6 }}>
              <input
                type="checkbox"
                checked={form.active}
                onChange={e => setForm({ ...form, active: e.target.checked })}
              />
              Active Staff Status
            </label>
          </div>
        </div>
      </FormModal>

      {/* Search & Filter Bar */}
      <div className="card" style={{ padding: 14, marginBottom: 16, background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Role Filter:</label>
            <CustomSelect
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              style={{ minWidth: 180 }}
              placeholder="All Roles"
              options={rolesList.map(r => ({ value: r.key, label: r.label }))}
            />
          </div>

          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Search Staff:</label>
            <input
              type="text"
              placeholder="Search by name, email, phone, account number..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #ccc', fontSize: 13 }}
            />
          </div>
        </div>
      </div>

      {/* Staff Table */}
      {loading ? (
        <div style={{ padding: 20 }}>Loading employee records...</div>
      ) : (
        <div className="table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Photo & Name</th>
                <th>Role</th>
                <th>Contact</th>
                <th>Monthly Salary (₹)</th>
                <th>Account Number</th>
                <th>Address</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
                    {showInactive ? 'No staff members found matching filters.' : 'No active staff members found. (Check "Show Inactive Staff" to see hidden accounts)'}
                  </td>
                </tr>
              ) : (
                filteredStaff.map(s => (
                  <tr key={s.id} style={{ opacity: s.active ? 1 : 0.65 }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {s.profile_picture ? (
                          <img src={s.profile_picture} alt={s.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
                        ) : (
                          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15 }}>
                            {s.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{s.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-light)' }}>ID: #{s.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-purple" style={{ textTransform: 'capitalize' }}>
                        {s.role || 'Staff'}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{s.phone || '—'}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{s.email || '—'}</div>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 15 }}>
                      ₹{parseFloat(s.salary || 0).toLocaleString('en-IN')}
                    </td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-muted)' }}>
                      {s.account_number || '—'}
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 180 }}>
                      {s.address || '—'}
                    </td>
                    <td>
                      {s.active ? (
                        <span className="badge badge-active">
                          <span className="badge-dot"></span>Active
                        </span>
                      ) : (
                        <span className="badge badge-inactive">
                          <span className="badge-dot"></span>Inactive
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: 6, justifyContent: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleEdit(s)}
                          className="btn-icon edit"
                          title={`Edit ${s.name}'s profile details`}
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          onClick={() => requestToggleActive(s)}
                          className={`btn-icon ${s.active ? 'inactive' : 'success'}`}
                          title={s.active ? `Set ${s.name} as Inactive (Hide)` : `Set ${s.name} as Active (Show)`}
                        >
                          {s.active ? '🚫' : '✓'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(toggleConfirmItem)}
        title={toggleConfirmItem?.active ? "Deactivate Staff Member" : "Activate Staff Member"}
        message={toggleConfirmItem?.active ? `Are you sure you want to deactivate ${toggleConfirmItem?.name}? (This will hide them from active view)` : `Are you sure you want to activate ${toggleConfirmItem?.name}?`}
        confirmText={toggleConfirmItem?.active ? "Deactivate" : "Activate"}
        cancelText="Cancel"
        type={toggleConfirmItem?.active ? "danger" : "info"}
        onConfirm={confirmToggleActive}
        onCancel={() => setToggleConfirmItem(null)}
      />
    </div>
  );
}

function AttendanceManagement() {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [staffList, setStaffList] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const api = await import('./api');
      const [staffData, attData] = await Promise.all([
        api.fetchStaff(),
        api.fetchStaffAttendance()
      ]);
      setStaffList(Array.isArray(staffData) ? staffData : []);
      setAttendanceRecords(Array.isArray(attData) ? attData : []);
    } catch (e) {
      console.error('Failed to load attendance data', e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const getStaffRecord = (staffId) => {
    return attendanceRecords.find(r => String(r.staff) === String(staffId) && r.date === selectedDate);
  };

  const handleTogglePresent = async (staffId, isPresent) => {
    setSavingId(staffId);
    try {
      const api = await import('./api');
      const existing = getStaffRecord(staffId);

      if (existing) {
        const updated = await api.updateStaffAttendance(existing.id, {
          ...existing,
          present: isPresent
        });
        setAttendanceRecords(prev => prev.map(r => r.id === updated.id ? updated : r));
      } else {
        const created = await api.createStaffAttendance({
          staff: staffId,
          date: selectedDate,
          present: isPresent,
          shift: 'Full Day',
          note: ''
        });
        setAttendanceRecords(prev => [...prev, created]);
      }
    } catch (e) {
      alert('Could not save attendance status.');
    } finally {
      setSavingId(null);
    }
  };

  const [bulkConfirmState, setBulkConfirmState] = useState(null); // { isPresent: boolean } | null

  const requestMarkAll = (isPresent) => {
    setBulkConfirmState({ isPresent });
  };

  const confirmMarkAll = async () => {
    if (!bulkConfirmState) return;
    const isPresent = bulkConfirmState.isPresent;
    setBulkConfirmState(null);
    setLoading(true);
    try {
      const api = await import('./api');
      const activeStaff = staffList.filter(s => s.active !== false);
      const updatedList = [...attendanceRecords];

      for (const s of activeStaff) {
        const existing = updatedList.find(r => String(r.staff) === String(s.id) && r.date === selectedDate);
        if (existing) {
          if (existing.present !== isPresent) {
            const updated = await api.updateStaffAttendance(existing.id, { ...existing, present: isPresent });
            const idx = updatedList.findIndex(r => r.id === existing.id);
            if (idx !== -1) updatedList[idx] = updated;
          }
        } else {
          const created = await api.createStaffAttendance({
            staff: s.id,
            date: selectedDate,
            present: isPresent,
            shift: 'Full Day'
          });
          updatedList.push(created);
        }
      }
      setAttendanceRecords(updatedList);
    } catch (e) {
      alert('Bulk attendance update completed.');
    } finally {
      setLoading(false);
    }
  };

  const [activeKpiFilter, setActiveKpiFilter] = useState('all'); // 'all' | 'present' | 'absent' | 'rate'

  const filteredStaff = staffList.filter(s =>
    s.active !== false && (
      (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.role || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const presentCount = filteredStaff.filter(s => {
    const rec = getStaffRecord(s.id);
    return rec ? rec.present : true;
  }).length;

  const absentCount = filteredStaff.length - presentCount;
  const attendanceRate = filteredStaff.length > 0 ? Math.round((presentCount / filteredStaff.length) * 100) : 100;

  const displayedStaff = filteredStaff.filter(s => {
    if (activeKpiFilter === 'present') {
      const rec = getStaffRecord(s.id);
      return rec ? rec.present : true;
    }
    if (activeKpiFilter === 'absent') {
      const rec = getStaffRecord(s.id);
      return rec ? !rec.present : false;
    }
    return true;
  });

  if (loading) return <div style={{ padding: 20 }}>Loading attendance records...</div>;

  return (
    <div className="attendance-module">
      {/* Top Filter & Control Panel */}
      <div className="card" style={{ padding: 16, marginBottom: 20, background: '#fff', borderRadius: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Select Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid #ccc', fontSize: 14, fontWeight: 600 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Search Staff:</label>
              <input
                type="text"
                placeholder="Search by name or role..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid #ccc', fontSize: 14, width: 220 }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="btn"
              onClick={() => requestMarkAll(true)}
              style={{ background: '#2e7d32', color: '#fff', padding: '8px 14px', borderRadius: 8, border: 'none', fontWeight: 600, cursor: 'pointer' }}
            >
              ✓ Mark All Present
            </button>
            <button
              className="btn"
              onClick={() => requestMarkAll(false)}
              style={{ background: '#c62828', color: '#fff', padding: '8px 14px', borderRadius: 8, border: 'none', fontWeight: 600, cursor: 'pointer' }}
            >
              ✕ Mark All Absent
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 20 }}>
        {[
          { key: 'all', label: 'Total Staff', count: filteredStaff.length, sub: 'Active employees' },
          { key: 'present', label: 'Present Today', count: presentCount, sub: 'Marked Present' },
          { key: 'absent', label: 'Absent Today', count: absentCount, sub: 'Marked Absent' },
          { key: 'rate', label: 'Attendance Rate', count: `${attendanceRate}%`, sub: 'Daily turn-out percentage' }
        ].map(card => {
          const isSelected = activeKpiFilter === card.key;
          return (
            <div
              key={card.key}
              onClick={() => setActiveKpiFilter(prev => prev === card.key ? 'all' : card.key)}
              className="card kpi-interactive-card"
              style={{
                padding: '16px 20px',
                background: isSelected ? 'linear-gradient(135deg, #1b5e20, #2e7d32)' : '#ffffff',
                color: isSelected ? '#ffffff' : '#1e293b',
                borderRadius: 10,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 6px 18px rgba(46, 125, 50, 0.35)' : '0 2px 8px rgba(0,0,0,0.06)',
                border: isSelected ? '1.5px solid #1b5e20' : '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                minHeight: 64
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, opacity: isSelected ? 0.95 : 0.85 }}>
                {card.label}
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: isSelected ? '#ffffff' : '#0f172a' }}>
                {card.count}
              </div>
            </div>
          );
        })}
      </div>

      {/* Attendance Staff List Table */}
      <div className="table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Staff Member</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Action (Present / Absent)</th>
            </tr>
          </thead>
          <tbody>
            {displayedStaff.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
                  No staff members match the selected filter.
                </td>
              </tr>
            ) : displayedStaff.map(s => {
              const rec = getStaffRecord(s.id);
              const isPresent = rec ? rec.present : true;
              return (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600 }}>
                    🧑‍🍳 {s.name}
                  </td>
                  <td>
                    <span className="badge badge-purple" style={{ textTransform: 'capitalize' }}>
                      {s.role || 'Staff'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{s.phone || '—'}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{selectedDate}</td>
                  <td>
                    {isPresent ? (
                      <span className="badge badge-present">
                        <span className="badge-dot"></span>Present
                      </span>
                    ) : (
                      <span className="badge badge-absent">
                        <span className="badge-dot"></span>Absent
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', gap: 6, background: 'var(--surface-hover)', padding: 4, borderRadius: 10, border: '1px solid var(--border-color)' }}>
                      <button
                        onClick={() => handleTogglePresent(s.id, true)}
                        disabled={savingId === s.id}
                        style={{
                          padding: '6px 16px',
                          borderRadius: 8,
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: 13,
                          background: isPresent ? 'var(--primary)' : 'transparent',
                          color: isPresent ? '#fff' : 'var(--text-muted)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        ✓ Present
                      </button>
                      <button
                        onClick={() => handleTogglePresent(s.id, false)}
                        disabled={savingId === s.id}
                        style={{
                          padding: '6px 16px',
                          borderRadius: 8,
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: 13,
                          background: !isPresent ? 'var(--danger-text)' : 'transparent',
                          color: !isPresent ? '#fff' : 'var(--text-muted)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        ✕ Absent
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={Boolean(bulkConfirmState)}
        title={bulkConfirmState?.isPresent ? "Mark All Active Staff Present" : "Mark All Active Staff Absent"}
        message={`Are you sure you want to mark ALL active staff as ${bulkConfirmState?.isPresent ? 'PRESENT' : 'ABSENT'} for ${selectedDate}?`}
        confirmText={bulkConfirmState?.isPresent ? "Mark Present" : "Mark Absent"}
        cancelText="Cancel"
        type={bulkConfirmState?.isPresent ? "info" : "danger"}
        onConfirm={confirmMarkAll}
        onCancel={() => setBulkConfirmState(null)}
      />
    </div>
  );
}

function GroceriesManagement() {
  const todayStr = new Date().toISOString().split('T')[0];
  const [groceries, setGroceries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [dateFilter, setDateFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeKpiFilter, setActiveKpiFilter] = useState('all'); // 'all' | 'today' | 'month' | 'todayItems'

  const [form, setForm] = useState({
    item_name: '',
    category: 'vegetables',
    quantity: '1',
    unit: 'kg',
    price: '',
    purchased_date: todayStr,
    purchased_by: '',
    payment_mode: 'Cash',
    notes: ''
  });

  const categoriesList = [
    { key: 'vegetables', label: '🥦 Vegetables & Greens', color: '#2e7d32', bg: '#e8f5e9' },
    { key: 'dairy', label: '🥛 Dairy & Milk Products', color: '#0277bd', bg: '#e1f5fe' },
    { key: 'grains', label: '🌾 Rice, Flour & Grains', color: '#ef6c00', bg: '#fff3e0' },
    { key: 'meat', label: '🍗 Meat, Chicken & Fish', color: '#c62828', bg: '#ffebee' },
    { key: 'spices', label: '🌶️ Spices & Masalas', color: '#6a1b9a', bg: '#f3e5f5' },
    { key: 'oil', label: '🛢️ Oil & Ghee', color: '#f57f17', bg: '#fffde7' },
    { key: 'packaging', label: '📦 Packaging & Container', color: '#4e342e', bg: '#efebe9' },
    { key: 'other', label: '🛒 Other Groceries', color: '#37474f', bg: '#eceff1' },
  ];

  const unitsList = ['kg', 'gm', 'ltr', 'ml', 'pcs', 'pkt', 'box', 'bag', 'dozen', 'can'];
  const paymentModes = ['Cash', 'UPI / PhonePe / GPay', 'Card', 'NetBanking', 'Credit'];

  const loadGroceries = async () => {
    setLoading(true);
    try {
      const api = await import('./api');
      const data = await api.fetchGroceries();
      setGroceries(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to load groceries', e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadGroceries();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.item_name || !form.price) {
      alert('Please fill in Item Name and Total Price (₹)');
      return;
    }
    try {
      const api = await import('./api');
      const payload = {
        item_name: form.item_name,
        category: form.category,
        quantity: parseFloat(form.quantity) || 1,
        unit: form.unit,
        price: parseFloat(form.price) || 0,
        purchased_date: form.purchased_date || todayStr,
        purchased_by: form.purchased_by,
        payment_mode: form.payment_mode,
        notes: form.notes
      };

      if (editingId) {
        const updated = await api.updateGrocery(editingId, payload);
        setGroceries(prev => prev.map(g => g.id === editingId ? updated : g));
      } else {
        const created = await api.createGrocery(payload);
        setGroceries(prev => [created, ...prev]);
      }
      setShowForm(false);
      setEditingId(null);
      resetForm();
    } catch (err) {
      alert('Failed to save grocery entry.');
    }
  };

  const handleEdit = (g) => {
    setEditingId(g.id);
    setForm({
      item_name: g.item_name || '',
      category: g.category || 'vegetables',
      quantity: g.quantity || '1',
      unit: g.unit || 'kg',
      price: g.price || '',
      purchased_date: g.purchased_date || todayStr,
      purchased_by: g.purchased_by || '',
      payment_mode: g.payment_mode || 'Cash',
      notes: g.notes || ''
    });
    setShowForm(true);
  };

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const requestDelete = (id) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    const id = deleteConfirmId;
    setDeleteConfirmId(null);
    try {
      const api = await import('./api');
      await api.deleteGrocery(id);
    } catch (e) { }
    setGroceries(prev => prev.filter(g => g.id !== id));
  };

  const resetForm = () => {
    setForm({
      item_name: '',
      category: 'vegetables',
      quantity: '1',
      unit: 'kg',
      price: '',
      purchased_date: todayStr,
      purchased_by: '',
      payment_mode: 'Cash',
      notes: ''
    });
  };

  const todayItems = groceries.filter(g => g.purchased_date === todayStr);
  const todayExpense = todayItems.reduce((acc, curr) => acc + (parseFloat(curr.price) || 0), 0);

  const currentMonth = new Date().toISOString().substring(0, 7);
  const monthItems = groceries.filter(g => (g.purchased_date || '').startsWith(currentMonth));
  const monthExpense = monthItems.reduce((acc, curr) => acc + (parseFloat(curr.price) || 0), 0);

  const filteredGroceries = groceries.filter(g => {
    if (dateFilter && g.purchased_date !== dateFilter) return false;
    if (categoryFilter && g.category !== categoryFilter) return false;
    if (searchTerm && !(
      (g.item_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.purchased_by || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.notes || '').toLowerCase().includes(searchTerm.toLowerCase())
    )) return false;
    return true;
  });

  const getCatBadge = (catKey) => {
    const found = categoriesList.find(c => c.key === catKey) || categoriesList[7];
    return (
      <span style={{ padding: '4px 10px', borderRadius: 8, background: found.bg, color: found.color, fontWeight: 600, fontSize: 12 }}>
        {found.label}
      </span>
    );
  };

  return (
    <div className="groceries-module">
      {/* Action Header & Summary KPIs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <button
          className="btn primary"
          onClick={() => {
            resetForm();
            setEditingId(null);
            setShowForm(true);
          }}
          style={{ padding: '10px 18px', borderRadius: 8, fontWeight: 700 }}
        >
          + Add Daily Grocery Item
        </button>

        <div style={{ fontSize: 13, color: '#666', fontWeight: 600 }}>
          Total Grocery Records: {filteredGroceries.length}
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
        {[
          { key: 'today', label: "Today's Expense", value: `₹${todayExpense.toLocaleString('en-IN')}` },
          { key: 'month', label: "This Month's Groceries", value: `₹${monthExpense.toLocaleString('en-IN')}` },
          { key: 'todayItems', label: "Items Bought Today", value: todayItems.length }
        ].map(card => {
          const isSelected = activeKpiFilter === card.key;
          return (
            <div
              key={card.key}
              onClick={() => {
                if (isSelected) {
                  setActiveKpiFilter('all');
                  setDateFilter('');
                } else {
                  setActiveKpiFilter(card.key);
                  if (card.key === 'today' || card.key === 'todayItems') {
                    setDateFilter(todayStr);
                  }
                }
              }}
              className="card kpi-interactive-card"
              style={{
                padding: '16px 20px',
                background: isSelected ? 'linear-gradient(135deg, #1b5e20, #2e7d32)' : '#ffffff',
                color: isSelected ? '#ffffff' : '#1e293b',
                borderRadius: 10,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 6px 18px rgba(46, 125, 50, 0.35)' : '0 2px 8px rgba(0,0,0,0.06)',
                border: isSelected ? '1.5px solid #1b5e20' : '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                minHeight: 64
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, opacity: isSelected ? 0.95 : 0.85 }}>
                {card.label}
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: isSelected ? '#ffffff' : '#0f172a' }}>
                {card.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Add / Edit Grocery FormModal ── */}
      <FormModal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingId(null); resetForm(); }}
        title={editingId ? 'Edit Grocery Purchase Record' : 'Record Daily Grocery Item'}
        icon="🛒"
        onSubmit={handleSave}
        submitLabel={editingId ? 'Save Changes' : 'Add Grocery Record'}
        size="lg"
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Item Name *</label>
            <input
              required
              type="text"
              placeholder="e.g. Fresh Tomatoes, Rice, Milk"
              value={form.item_name}
              onChange={e => setForm({ ...form, item_name: e.target.value })}
              style={{ width: '100%', padding: 9, borderRadius: 6, border: '1.5px solid #ccc' }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Category *</label>
            <CustomSelect
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              style={{ width: '100%' }}
              options={categoriesList.map(c => ({ value: c.key, label: c.label }))}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Quantity & Unit</label>
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                type="number"
                step="0.01"
                placeholder="Qty"
                value={form.quantity}
                onChange={e => setForm({ ...form, quantity: e.target.value })}
                style={{ width: '60%', padding: 9, borderRadius: 6, border: '1.5px solid #ccc' }}
              />
              <CustomSelect
                value={form.unit}
                onChange={e => setForm({ ...form, unit: e.target.value })}
                style={{ width: '40%' }}
                options={unitsList.map(u => ({ value: u, label: u }))}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Total Price (₹) *</label>
            <input
              required
              type="number"
              step="0.01"
              placeholder="Total Cost in ₹"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
              style={{ width: '100%', padding: 9, borderRadius: 6, border: '1.5px solid #ccc' }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Purchased Date *</label>
            <input
              type="date"
              value={form.purchased_date}
              onChange={e => setForm({ ...form, purchased_date: e.target.value })}
              style={{ width: '100%', padding: 9, borderRadius: 6, border: '1.5px solid #ccc' }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Brought / Purchased By</label>
            <input
              type="text"
              placeholder="e.g. Ramesh, Kitchen Staff"
              value={form.purchased_by}
              onChange={e => setForm({ ...form, purchased_by: e.target.value })}
              style={{ width: '100%', padding: 9, borderRadius: 6, border: '1.5px solid #ccc' }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Payment Method</label>
            <CustomSelect
              value={form.payment_mode}
              onChange={e => setForm({ ...form, payment_mode: e.target.value })}
              style={{ width: '100%' }}
              options={paymentModes.map(pm => ({ value: pm, label: pm }))}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Notes / Remarks</label>
            <input
              type="text"
              placeholder="Optional notes or store name..."
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              style={{ width: '100%', padding: 9, borderRadius: 6, border: '1.5px solid #ccc' }}
            />
          </div>
        </div>
      </FormModal>

      {/* Filter Bar */}
      <div className="card" style={{ padding: 14, marginBottom: 16, background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Filter Date:</label>
            <input
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              style={{ padding: '7px 10px', borderRadius: 6, border: '1px solid #ccc', fontSize: 13 }}
            />
            {dateFilter && (
              <button onClick={() => setDateFilter('')} style={{ border: 'none', background: 'none', color: '#c62828', cursor: 'pointer', fontSize: 12, marginLeft: 4 }}>Clear</button>
            )}
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Category:</label>
            <CustomSelect
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              style={{ minWidth: 200 }}
              placeholder="All Categories"
              options={categoriesList.map(c => ({ value: c.key, label: c.label }))}
            />
          </div>

          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Search Item / Person:</label>
            <input
              type="text"
              placeholder="Search groceries..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid #ccc', fontSize: 13 }}
            />
          </div>
        </div>
      </div>

      {/* Groceries Data Table */}
      {loading ? (
        <div style={{ padding: 20 }}>Loading daily groceries log...</div>
      ) : (
        <div className="table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Total Cost (₹)</th>
                <th>Purchased By</th>
                <th>Payment Mode</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGroceries.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>No grocery items recorded. Click "+ Add Daily Grocery Item" above to add one.</td>
                </tr>
              ) : (
                filteredGroceries.map(g => (
                  <tr key={g.id}>
                    <td style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>{g.purchased_date}</td>
                    <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                      {g.item_name}
                      {g.notes && <div style={{ fontSize: 12, color: 'var(--text-light)', fontWeight: 400 }}>{g.notes}</div>}
                    </td>
                    <td>{getCatBadge(g.category)}</td>
                    <td style={{ fontWeight: 600 }}>{g.quantity} {g.unit}</td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 15 }}>
                      ₹{parseFloat(g.price || 0).toLocaleString('en-IN')}
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{g.purchased_by || '—'}</td>
                    <td>
                      <span className="badge badge-info">
                        {g.payment_mode || 'Cash'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: 6, justifyContent: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleEdit(g)}
                          className="btn-icon edit"
                          title={`Edit ${g.item_name}`}
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          onClick={() => requestDelete(g.id)}
                          className="btn-icon danger"
                          title={`Delete ${g.item_name}`}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteConfirmId)}
        title="Delete Grocery Record"
        message="Are you sure you want to delete this grocery purchase record?"
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
}

function DeliveryManagement() { return (<div><p>Assign delivery, track status placeholder.</p></div>) }
function BranchManagement() {
  const [locations, setLocations] = useState([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const loadLocations = async () => {
    setLoading(true);
    try {
      const api = await import('./api');
      let res = await api.fetchLocations();
      if (!res || res.length === 0) {
        const defaultLocNames = ['Athani Branch', 'Belagavi Central Branch', 'Bangalore Outlet'];
        const seeded = [];
        for (const locName of defaultLocNames) {
          try {
            if (api.createLocation) {
              const createdLoc = await api.createLocation({ name: locName, address: 'Karnataka Branch' });
              seeded.push(createdLoc);
            }
          } catch (err) { }
        }
        res = seeded.length > 0 ? seeded : [
          { id: 1, name: 'Athani Branch', address: 'Athani, Karnataka' },
          { id: 2, name: 'Belagavi Central Branch', address: 'Belagavi, Karnataka' },
          { id: 3, name: 'Bangalore Outlet', address: 'Bangalore, Karnataka' }
        ];
      }
      setLocations(Array.isArray(res) ? res : []);
    } catch (e) {
      setLocations([
        { id: 1, name: 'Athani Branch', address: 'Athani, Karnataka' },
        { id: 2, name: 'Belagavi Central Branch', address: 'Belagavi, Karnataka' },
        { id: 3, name: 'Bangalore Outlet', address: 'Bangalore, Karnataka' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadLocations();
  }, []);

  async function add(e) {
    if (e) e.preventDefault();
    if (!name.trim()) return alert('Please enter branch name');
    try {
      const api = await import('./api');
      const created = await api.createLocation ? await api.createLocation({ name, address }) : { id: Date.now(), name, address };
      setLocations(s => [created, ...s]);
      setName('');
      setAddress('');
      setShowForm(false);
    } catch (e) { alert('Failed to add location branch') }
  }
  if (loading) return <div style={{ padding: 20 }}>Loading branch locations...</div>;

  return (
    <div>
      <div className="module-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <button
          className="btn primary"
          onClick={() => { setName(''); setAddress(''); setShowForm(true); }}
          style={{ padding: '10px 18px', borderRadius: 8, fontWeight: 700 }}
        >
          + Add New Branch Location
        </button>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>
          Active Branches: {locations.length}
        </div>
      </div>

      {/* ── Branch Location FormModal ── */}
      <FormModal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setName(''); setAddress(''); }}
        title="Add Restaurant Branch / Location"
        icon="🏢"
        onSubmit={(e) => { if (e) e.preventDefault(); add(e); }}
        submitLabel="Save Branch"
        size="md"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6, color: '#475569' }}>Branch Name *</label>
            <input
              required
              placeholder="e.g. Main City Branch, Downtown Express, Westside Outlet"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: 14 }}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 6, color: '#475569' }}>Full Address / Landmark</label>
            <input
              placeholder="e.g. 102 MG Road, Near Central Park"
              value={address}
              onChange={e => setAddress(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: 14 }}
            />
          </div>
        </div>
      </FormModal>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {locations.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: 24, textAlign: 'center', color: '#94a3b8', background: '#fff', borderRadius: 12 }}>
            No branches added yet. Click "+ Add New Branch Location" above to create one.
          </div>
        ) : locations.map(loc => (
          <div
            key={loc.id || loc.name}
            className="card"
            style={{
              padding: 18,
              background: '#ffffff',
              borderRadius: 12,
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              display: 'flex',
              alignItems: 'center',
              gap: 14
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 10, background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700 }}>
              🏢
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 16 }}>{loc.name}</div>
              <div style={{ fontSize: 12.5, color: '#64748b', marginTop: 2 }}>{loc.address || 'Standard Location Branch'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationsManagement() { return (<div><p>Send notifications placeholder.</p></div>) }
function ReportsManagement() { return (<div><p>Reports export (PDF/CSV) placeholder.</p></div>) }
function SettingsManagement() { return (<div><p>Site & restaurant settings placeholder.</p></div>) }

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-content container">
        <div className="hero-text">
          <span className="badge">Welcome to Village Lunch</span>
          <h1>Authentic Village Flavor &amp; Pure Traditional Taste</h1>
          <p>Experience the finest handcrafted village dishes cooked with traditional spices, pure ingredients, and timeless recipes passed down through generations.</p>
          <div className="hero-actions">
            <a className="btn primary" href="#menu">Explore Menu</a>
            <a className="btn outline" href="#contact">Order Now</a>
          </div>
        </div>
        <div className="hero-image"><img src={homeImg} alt="hero" /></div>
      </div>
    </section>
  );
}

function FeatureBar() {
  const items = [
    { title: 'Fresh Food', desc: 'Made fresh daily with quality ingredients' },
    { title: 'Authentic Taste', desc: 'Village style recipes with traditional flavours' },
    { title: 'Traditional Recipes', desc: 'Time-honoured recipes from our village kitchen' },
    { title: 'Loved by Customers', desc: '4.8+ rating from happy customers' },
  ];
  return (
    <div className="feature-bar container">
      {items.map((it, i) => (
        <div className="feature-bar-item" key={i}>
          <div className="icon">🍽️</div>
          <div>
            <div className="fb-title">{it.title}</div>
            <div className="fb-desc">{it.desc}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function Menu({ onAdd, inline = false }) {
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const api = await import('./api');
        const [locs, cats, items] = await Promise.all([
          api.fetchLocations(),
          api.fetchCategories(),
          api.fetchMenuItems()
        ]);
        if (!mounted) return;
        setLocations(Array.isArray(locs) ? locs : []);
        setCategories(Array.isArray(cats) ? cats : []);
        setMenuItems(Array.isArray(items) ? items : []);
      } catch (e) {
        console.warn('Failed to load menu data', e);
      } finally { if (mounted) setLoading(false); }
    }
    load();
    return () => mounted = false;
  }, []);

  // Fallback static items if API returns nothing
  const fallbackItems = [
    { img: homeImg, title: 'Village Special Meals', desc: 'rice, curry, sambar, rasam & more', price: 180 },
    { img: homeImg, title: 'Traditional Curries', desc: 'authentic masalas', price: 150 },
    { img: homeImg, title: 'Chicken Specials', desc: 'spicy chicken recipes', price: 220 },
    { img: homeImg, title: 'Fish Specials', desc: 'fresh fish dishes', price: 250 },
    { img: homeImg, title: 'Fresh Rotis', desc: 'soft hot rotis', price: 20 },
    { img: homeImg, title: 'Traditional Desserts', desc: 'homemade sweets', price: 90 },
  ];

  const apiItems = menuItems.map(it => ({
    img: it.image_url || homeImg,
    title: it.name || it.title || 'Dish',
    desc: it.description || '',
    price: it.price || 0,
    category: it.category,
    location: it.location,
  }));

  const displayItems = apiItems.length > 0 ? apiItems : fallbackItems;

  const filteredItems = displayItems.filter(it => {
    if (selectedLocation && it.location && String(it.location) !== String(selectedLocation)) return false;
    if (selectedCategory && it.category && String(it.category) !== String(selectedCategory)) return false;
    return true;
  });

  if (inline) {
    return (
      <div>
        <div className="menu-filters">
          <select className="filter-select" value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)}>
            <option value="">Select Location</option>
            {locations.map(l => <option key={l.id} value={l.id}>{l.name || l.city || `Location #${l.id}`}</option>)}
          </select>
          <select className="filter-select" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
            <option value="">Select Category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name || `Category #${c.id}`}</option>)}
          </select>
        </div>
        <div className="menu-grid">
          {loading ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 30, color: '#888' }}>Loading menu...</div>
          ) : filteredItems.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 30, color: '#888' }}>No dishes found for selected filters.</div>
          ) : filteredItems.map((m, i) => (
            <div className="menu-card" key={i}>
              <img src={m.img} alt={m.title} />
              <div className="price-tag">₹{m.price}</div>
              <div className="menu-body">
                <h5>{m.title}</h5>
                <p className="muted">{m.desc}</p>
                <div className="menu-foot"><strong>₹{m.price}</strong><button className="plus" onClick={() => onAdd && onAdd(m)}>+</button></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <section className="menu" id="menu">
      <div className="container">
        <div className="section-header">
          <h2>Popular Dishes</h2>
          <div className="menu-filters">
            <select className="filter-select" value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)}>
              <option value="">Select Location</option>
              {locations.map(l => <option key={l.id} value={l.id}>{l.name || l.city || `Location #${l.id}`}</option>)}
            </select>
            <select className="filter-select" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name || `Category #${c.id}`}</option>)}
            </select>
          </div>
        </div>
        <div className="menu-grid">
          {loading ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 30, color: '#888' }}>Loading menu...</div>
          ) : filteredItems.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 30, color: '#888' }}>No dishes found for selected filters.</div>
          ) : filteredItems.map((m, i) => (
            <div className="menu-card" key={i}>
              <img src={m.img} alt={m.title} />
              <div className="price-tag">₹{m.price}</div>
              <div className="menu-body">
                <h5>{m.title}</h5>
                <p className="muted">{m.desc}</p>
                <div className="menu-foot"><strong>₹{m.price}</strong><button className="plus" onClick={() => onAdd && onAdd(m)}>+</button></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CartSidebar({ cart, onIncrement, onDecrement, onRemove }) {
  const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);
  return (
    <aside className="cart-sidebar">
      <h3>Your Cart ({cart.length})</h3>
      <div className="cart-list">
        {cart.map((it, idx) => (
          <div className="cart-item" key={idx}>
            <img src={it.img} alt={it.title} />
            <div className="ci-body">
              <div className="ci-title">{it.title}</div>
              <div className="ci-qty">
                <button onClick={() => onDecrement(it)}>-</button>
                <span>{it.qty}</span>
                <button onClick={() => onIncrement(it)}>+</button>
              </div>
            </div>
            <div className="ci-price">₹{it.price * it.qty}</div>
            <button className="ci-remove" onClick={() => onRemove(it)}>×</button>
          </div>
        ))}
      </div>
      <div className="cart-footer">
        <div>Subtotal <strong>₹{subtotal}</strong></div>
        <button className="btn primary">Place Order</button>
      </div>
    </aside>
  )
}

function OrderPage({ onAdd, cart, onIncrement, onDecrement, onRemove }) {
  return (
    <section className="order-page" id="order">
      <div className="container order-inner">
        <div className="order-main">
          <div className="order-controls">
            <input className="search" placeholder="Search for dishes..." />
            <select className="sort"><option>Sort by: Popular</option></select>
          </div>
          <div className="order-menu-wrap">
            <Menu onAdd={onAdd} />
          </div>
        </div>
        <CartSidebar cart={cart} onIncrement={onIncrement} onDecrement={onDecrement} onRemove={onRemove} />
      </div>
    </section>
  )
}

function Gallery() {
  const imgs = [
    { url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80', title: 'Traditional Thali' },
    { url: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=600&auto=format&fit=crop&q=80', title: 'Crispy Dosa & Chutney' },
    { url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80', title: 'Hyderabadi Dum Biryani' },
    { url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80', title: 'Paneer Butter Masala' },
    { url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80', title: 'Fresh Gulab Jamun' },
    { url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80', title: 'Special Mango Lassi' },
  ];
  return (
    <section className="gallery" id="gallery">
      <div className="container">
        <div className="section-header">
          <div>
            <h2>A Glimpse of Our Taste</h2>
            <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: 14 }}>Authentic flavors prepared fresh daily with traditional recipes</p>
          </div>
        </div>
        <div className="gallery-grid" style={{ marginTop: 20 }}>
          {imgs.map((item, i) => (
            <div key={i} style={{ position: 'relative', borderRadius: 16, overflow: 'hidden' }}>
              <img src={item.url} alt={item.title} />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '24px 14px 12px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: 14,
                pointerEvents: 'none'
              }}>
                {item.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="about" id="about">
      <div className="container about-inner">
        <div>
          <h3>More Than Food, It's a Village Experience</h3>
          <p>At Village Lunch we bring you the true essence of village cooking. Every dish is made with love, using fresh ingredients and traditional methods.</p>
          <a className="btn" href="#menu">Learn More About Us</a>
        </div>
        <div className="about-image"><img src={homeImg} alt="about" /></div>
      </div>
    </section>
  )
}

function Reviews() {
  const items = [
    { name: 'Arjun K.', text: 'Amazing traditional taste and excellent service! Highly recommended.' },
    { name: 'Priya S.', text: "The best village style meals I've ever had." },
    { name: 'Manoj R.', text: 'Great ambiance, delicious food and very hygienic.' },
  ];
  return (
    <section className="reviews">
      <div className="container">
        <div className="section-header"><h2>Customer Reviews</h2></div>
        <div className="reviews-row">
          {items.map((r, i) => (
            <div className="review-card" key={i}>
              <div className="avatar">{r.name[0]}</div>
              <div>
                <div className="stars">★★★★★</div>
                <p className="rev-text">{r.text}</p>
                <div className="rev-name">- {r.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="site-footer footer-dark">
      <div className="container footer-inner">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="footer-brand">
              <img src="/images/logo.svg" alt="Village Lunch" style={{ height: 48 }} />
              <div className="tag">Taste the Tradition</div>
            </div>
            <p className="footer-desc">Experience the authentic village style food made with love and traditional recipes. Visit any of our locations in Bangalore, Belgaum and Athani.</p>
            <div className="socials">
              <a href="#" aria-label="facebook">🔗</a>
              <a href="#" aria-label="instagram">🔗</a>
              <a href="#" aria-label="twitter">🔗</a>
            </div>
          </div>

          <div className="footer-col">
            <h5>Quick Links</h5>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#menu">Menu</a></li>
              <li><a href="#gallery">Gallery</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-col footer-contact">
            <h5>Contact Us</h5>
            <p className="contact-line">📞 +91 9019831951</p>
            <p className="contact-line">✉️ villagelunch@gmail.com</p>
            <p className="contact-line">🏠 123, Village Street, Your City - 600001</p>
            <h6>Opening Hours</h6>
            <p>Mon - Sun: 10:00 AM - 10:30 PM</p>
            <div className="footer-illustration"><img src="/images/footer-illustration.jpg" alt="house" /></div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>© {new Date().getFullYear()} Village Lunch. All Rights Reserved.</div>
          <div className="footer-policy"><a href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('openAuth', { detail: { role: 'admin' } })) }}>Admin</a> · <a href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('openAuth', { detail: { role: 'staff' } })) }}>Staff</a> · <a href="#">Privacy Policy</a> · <a href="#">Terms</a></div>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  const [cart, setCart] = useState([]);
  const [showOrder, setShowOrder] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showStaffPanel, setShowStaffPanel] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authRole, setAuthRole] = useState('staff');

  const [frontendLocation, setFrontendLocation] = useState('Belagavi');
  const availableLocations = ['Athani', 'Belagavi', 'Bangalore'];

  // Listen for requestOpenDashboard events and toggle dashboard state
  React.useEffect(() => {
    function onReq() { setShowDashboard(true); setShowOrder(false); }
    window.addEventListener('requestOpenDashboard', onReq);
    return () => window.removeEventListener('requestOpenDashboard', onReq);
  }, []);

  // Listen for staff dashboard open events
  React.useEffect(() => {
    function onReq() { setShowStaffPanel(true); setShowOrder(false); setShowAdmin(false); setShowDashboard(false); }
    window.addEventListener('requestOpenStaffDashboard', onReq);
    return () => window.removeEventListener('requestOpenStaffDashboard', onReq);
  }, []);

  // Listen for footer auth open events
  React.useEffect(() => {
    function onAuth(e) { setAuthRole((e && e.detail && e.detail.role) || 'staff'); setShowAuthModal(true); }
    window.addEventListener('openAuth', onAuth);
    return () => window.removeEventListener('openAuth', onAuth);
  }, []);

  function addToCart(item) {
    setCart(prev => {
      const found = prev.find(p => p.title === item.title);
      if (found) {
        return prev.map(p => p.title === item.title ? { ...p, qty: p.qty + 1 } : p)
      }
      return [{ ...item, qty: 1 }, ...prev]
    })
  }

  function increment(item) { setCart(prev => prev.map(p => p.title === item.title ? { ...p, qty: p.qty + 1 } : p)) }
  function decrement(item) { setCart(prev => prev.map(p => p.title === item.title ? { ...p, qty: Math.max(1, p.qty - 1) } : p)) }
  function remove(item) { setCart(prev => prev.filter(p => p.title !== item.title)) }

  return (
    <div className="app-root">
      {!showAdmin && !showStaffPanel && (
        <Header
          onOpenOrder={() => { setShowOrder(true); setShowDashboard(false); setShowAdmin(false); }}
          onNavHome={() => { setShowOrder(false); setShowDashboard(false); setShowAdmin(false); }}
          onOpenAdmin={() => { setShowAdmin(true); setShowOrder(false); setShowDashboard(false); }}
          frontendLocation={frontendLocation}
          setFrontendLocation={setFrontendLocation}
          availableLocations={availableLocations}
        />
      )}
      <AuthModal open={showAuthModal} role={authRole} onClose={() => setShowAuthModal(false)} onSuccess={(auth) => { setShowAuthModal(false); if (auth.role === 'admin') { setShowAdmin(true); setShowStaffPanel(false); } else { setShowStaffPanel(true); setShowAdmin(false); } }} />
      {showAdmin ? (
        <AdminPanel onClose={() => setShowAdmin(false)} />
      ) : showStaffPanel ? (
        <StaffPanel onClose={() => setShowStaffPanel(false)} />
      ) : showDashboard ? (
        <DashboardPage />
      ) : showOrder ? (
        <OrderPage onAdd={addToCart} cart={cart} onIncrement={increment} onDecrement={decrement} onRemove={remove} />
      ) : (
        <>
          <Hero />
          <FeatureBar />
          <Menu onAdd={addToCart} />
          <Gallery />
          <About />
          <Reviews />
          <Footer />
        </>
      )}
    </div>
  )
}

// Listen for header dashboard click event and update app state
window.addEventListener('openDashboard', () => {
  // emit a custom event that App can pick up via a simple approach below
  const evt = new CustomEvent('requestOpenDashboard');
  window.dispatchEvent(evt);
});

// When header 'Staff' link is clicked dispatch a request for staff dashboard
window.addEventListener('openStaffDashboard', () => {
  const evt = new CustomEvent('requestOpenStaffDashboard');
  window.dispatchEvent(evt);
});
