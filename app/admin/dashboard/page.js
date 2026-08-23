'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const REJECTION_PRESETS = [
  'Blurry / unreadable Aadhaar card front photo',
  'Aadhaar back side (address page) is missing or illegible',
  'Invalid / blurry PAN card front photo',
  'Police Verification certificate is missing, blurry, or expired',
  'Profile photo is unclear (face not visible or extreme angle)',
  'Voter ID / Driving License scan is cut off or unreadable',
  'Address details do not match the uploaded proof',
];

export default function AdminDashboardClient() {
  const [adminToken, setAdminToken] = useState(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('overview'); // overview, pending, directory, leads
  const [leads, setLeads] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal / Review state
  const [selectedPro, setSelectedPro] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [actionStatus, setActionStatus] = useState({ type: '', message: '' });
  const [processingId, setProcessingId] = useState(null);

  // Rejection Dialog State
  const [rejectModalPro, setRejectModalPro] = useState(null);
  const [rejectReasons, setRejectReasons] = useState([]);
  const [rejectCustomMessage, setRejectCustomMessage] = useState('');
  const [rejectTargetStep, setRejectTargetStep] = useState(2);

  useEffect(() => {
    const token = sessionStorage.getItem('admin_token');
    if (token) {
      setAdminToken(token);
      fetchData(token);
    } else {
      setLoading(false); // Show login screen immediately
    }
  }, []);

  const fetchData = async (token = adminToken) => {
    if (!token) return;
    setLoading(true);
    try {
      // 1. Fetch leads from secure API
      const leadsRes = await fetch('/api/admin/leads', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (leadsRes.status === 401) {
        handleLogout();
        return;
      }
      const leadsResult = await leadsRes.json();
      if (!leadsRes.ok) throw new Error(leadsResult.error || 'Failed to sync leads');
      setLeads(leadsResult.leads || []);

      // 2. Fetch profiles from secure API
      const profilesRes = await fetch('/api/admin/profiles', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (profilesRes.status === 401) {
        handleLogout();
        return;
      }
      const profilesResult = await profilesRes.json();
      if (!profilesRes.ok) throw new Error(profilesResult.error || 'Failed to sync profiles');
      setProfiles(profilesResult.profiles || []);
    } catch (err) {
      console.error('Secure data sync failed:', err);
      setActionStatus({ type: 'error', message: err.message || 'Authentication or network sync failed.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });
      const result = await response.json();
      if (response.ok && result.success) {
        sessionStorage.setItem('admin_token', result.token);
        setAdminToken(result.token);
        await fetchData(result.token);
      } else {
        setAuthError(result.error || 'Invalid credential passcode');
      }
    } catch (err) {
      setAuthError('Connection to auth server failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    setAdminToken(null);
    setLeads([]);
    setProfiles([]);
    setPasswordInput('');
    setActiveTab('overview');
    setSelectedPro(null);
    setZoomedImage(null);
  };

  // Handle verification action (verify/reject)
  const handleVerifyAction = async (proId, action, extraParams = {}) => {
    setProcessingId(proId);
    setActionStatus({ type: '', message: '' });
    try {
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ proId, action, ...extraParams }),
      });

      if (response.status === 401) {
        handleLogout();
        throw new Error('Admin session expired. Please log in again.');
      }

      const result = await response.json();
      if (response.ok && result.success) {
        let msg = '';
        if (action === 'verify') msg = 'Professional successfully verified & approved ✓';
        else if (action === 'reject') msg = 'Onboarding rejected & email notice dispatched with re-upload link ✉️';
        else if (action === 'approve_avatar') msg = 'Profile image approved successfully ✓';
        else if (action === 'reject_avatar') msg = 'Profile image update request rejected';

        setActionStatus({
          type: 'success',
          message: msg
        });
        
        // Refresh local data using our secure token
        await fetchData(adminToken);

        // If the review modal is open, update the selected profile state locally
        if (selectedPro && selectedPro.id === proId) {
          if (action === 'verify') {
            setSelectedPro(prev => ({ ...prev, verified: true, onboarding_completed: true, rejection_reason: null }));
          } else if (action === 'reject') {
            setSelectedPro(prev => ({ ...prev, verified: false, onboarding_completed: false, onboarding_step: extraParams.targetStep || 2, rejection_reason: extraParams.reasons?.join(', ') }));
          } else if (action === 'approve_avatar') {
            setSelectedPro(prev => ({ ...prev, avatar: prev.pending_avatar, pending_avatar: null }));
          } else if (action === 'reject_avatar') {
            setSelectedPro(prev => ({ ...prev, pending_avatar: null }));
          }
        }

        setRejectModalPro(null);
        setRejectReasons([]);
        setRejectCustomMessage('');
        
        // Clear message after 5 seconds
        setTimeout(() => setActionStatus({ type: '', message: '' }), 5000);
      } else {
        throw new Error(result.error || 'Failed to update status');
      }
    } catch (err) {
      setActionStatus({ type: 'error', message: err.message || 'Verification update failed.' });
    } finally {
      setProcessingId(null);
    }
  };

  // Analytics calculations
  const totalLeads = leads.length;
  const totalProfiles = profiles.length;
  const verifiedProfilesCount = profiles.filter(p => p.verified).length;
  const pendingProfiles = profiles.filter(p => (p.onboarding_completed && !p.verified) || !!p.pending_avatar);
  const pendingProfilesCount = pendingProfiles.length;

  // Calculate top demand trade dynamically
  const getTopDemandTrade = () => {
    if (leads.length === 0) return 'Carpentry';
    const counts = {};
    leads.forEach(l => {
      const trade = l.profiles?.trade;
      if (trade) counts[trade] = (counts[trade] || 0) + 1;
    });
    let topTrade = 'Carpentry';
    let maxCount = 0;
    Object.entries(counts).forEach(([trade, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topTrade = trade;
      }
    });
    return topTrade;
  };

  const topDemand = getTopDemandTrade();

  // Loading indicator for background syncs
  if (loading && adminToken) {
    return (
      <div className="container flex items-center justify-center" style={{ minHeight: 'calc(100vh - var(--navbar-height))' }}>
        <div style={{ textAlign: 'center', opacity: 0.7 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem', animation: 'spin 2s linear infinite' }}>⚙️</div>
          <p style={{ fontWeight: 600, letterSpacing: '0.05em' }}>Loading Admin Panel data…</p>
        </div>
      </div>
    );
  }

  // RENDER ADMIN LOGIN GATE (Secured Screen)
  if (!adminToken) {
    return (
      <div className="container flex items-center justify-center" style={{ minHeight: 'calc(100vh - var(--navbar-height))', padding: '2rem' }}>
        <div className="glass flex-col animate-fade-in" style={{
          maxWidth: '440px',
          width: '100%',
          padding: '2.5rem',
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
          border: '1px solid var(--glass-border)',
          background: 'var(--card-bg, #F5EFE6)',
          textAlign: 'center'
        }}>
          {/* Glowing Security Shield Icon */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--primary-light)',
            border: '2px solid var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '1.8rem',
            boxShadow: '0 0 20px var(--primary-glow)'
          }}>
            🛡️
          </div>

          <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Restricted Directory Access
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.25rem', marginBottom: '0.5rem', color: 'var(--foreground)' }}>Admin Gatekeeper</h2>
          <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '2rem', lineHeight: 1.4, color: 'var(--foreground-muted)' }}>
            Verify credentials to inspect handyman scans, Pan card uploads, and audit verification statuses.
          </p>

          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--foreground)' }}>Secure Administrative Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••••"
                required
                disabled={authLoading}
                style={{
                  width: '100%',
                  padding: '0.85rem 1.1rem',
                  borderRadius: '12px',
                  border: '1px solid var(--glass-border)',
                  background: 'var(--background, #FAF8F5)',
                  color: 'var(--foreground)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                  fontFamily: 'monospace'
                }}
                onFocus={(e) => e.target.style.border = '1px solid var(--primary)'}
                onBlur={(e) => e.target.style.border = '1px solid var(--glass-border)'}
              />
            </div>

            {authError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#b91c1c',
                padding: '0.75rem',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: 600,
                textAlign: 'center'
              }}>
                ⚠️ {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="btn btn-primary"
              style={{
                padding: '0.9rem',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: authLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
                border: 'none',
                boxShadow: '0 4px 15px var(--primary-glow)'
              }}
            >
              {authLoading ? 'Authorizing Session…' : '🔑 Unlock Secure Terminal'}
            </button>
          </form>

          <div style={{ marginTop: '2rem', fontSize: '0.75rem', opacity: 0.6, color: 'var(--foreground-muted)' }}>
            Carpenterwala Platform Administration • Clean audit trail guaranteed
          </div>
        </div>
      </div>
    );
  }

  // SECURE RENDER ONCE AUTHORIZED
  return (
    <div className="container flex-col gap-6 animate-fade-in" style={{ padding: '3rem 0', maxWidth: '1200px' }}>
      
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🔒 Authenticated Session Active
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.2rem' }}>Admin Control Center</h1>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={() => fetchData(adminToken)} 
            className="btn btn-secondary" 
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', gap: '0.4rem', alignItems: 'center' }}
          >
            🔄 Sync Data
          </button>
          
          <button 
            onClick={handleLogout} 
            className="btn btn-secondary" 
            style={{ 
              padding: '0.5rem 1rem', 
              fontSize: '0.85rem', 
              display: 'flex', 
              gap: '0.4rem', 
              alignItems: 'center', 
              border: '1px solid rgba(239,68,68,0.3)', 
              color: '#f87171',
              background: 'rgba(239,68,68,0.05)'
            }}
          >
            🔒 Lock Terminal
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="flex gap-4" style={{ marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div className="glass flex-col" style={{ flex: 1, minWidth: '220px', padding: '1.5rem', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
          <h3 style={{ opacity: 0.6, fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Total Routing Leads</h3>
          <span style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.5rem' }}>{totalLeads}</span>
          <div style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '0.25rem' }}>Routed to professionals</div>
        </div>
        
        <div className="glass flex-col" style={{ flex: 1, minWidth: '220px', padding: '1.5rem', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
          <h3 style={{ opacity: 0.6, fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Pending Profile Audits</h3>
          <span style={{ fontSize: '2.8rem', fontWeight: 800, color: pendingProfilesCount > 0 ? 'var(--accent)' : '#34d399', marginTop: '0.5rem' }}>
            {pendingProfilesCount}
          </span>
          <div style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '0.25rem' }}>Awaiting verification checks</div>
        </div>

        <div className="glass flex-col" style={{ flex: 1, minWidth: '220px', padding: '1.5rem', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
          <h3 style={{ opacity: 0.6, fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Verified Service Pros</h3>
          <span style={{ fontSize: '2.8rem', fontWeight: 800, color: '#15803d', marginTop: '0.5rem' }}>
            {verifiedProfilesCount} <span style={{ fontSize: '1.2rem', fontWeight: 500, color: 'var(--foreground-muted)', opacity: 0.6 }}>/ {totalProfiles}</span>
          </span>
          <div style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '0.25rem' }}>Active listed professionals</div>
        </div>

        <div className="glass flex-col" style={{ flex: 1, minWidth: '220px', padding: '1.5rem', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
          <h3 style={{ opacity: 0.6, fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>Top Trade Demand</h3>
          <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--foreground)', marginTop: '1.2rem', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
            🔨 {topDemand}
          </span>
          <div style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '0.55rem' }}>Based on recent customer requests</div>
        </div>
      </div>

      {/* Global Notification Banner */}
      {actionStatus.message && (
        <div style={{
          background: actionStatus.type === 'success' ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)',
          border: `1px solid ${actionStatus.type === 'success' ? 'rgba(22,163,74,0.3)' : 'rgba(220,38,38,0.3)'}`,
          color: actionStatus.type === 'success' ? '#15803d' : '#b91c1c',
          padding: '1rem 1.25rem',
          borderRadius: '12px',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <span>{actionStatus.type === 'success' ? '✅' : '⚠️'}</span>
          <span style={{ fontWeight: 550 }}>{actionStatus.message}</span>
        </div>
      )}

      {/* Custom Tabs Navigation */}
      <div style={{
        display: 'flex',
        gap: '0.35rem',
        background: 'var(--card-bg)',
        borderRadius: '12px',
        padding: '0.35rem',
        border: '1px solid var(--glass-border)',
        flexWrap: 'wrap',
        marginBottom: '1.5rem'
      }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '0.65rem 1.25rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
            fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s',
            background: activeTab === 'overview' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'overview' ? '#ffffff' : 'var(--foreground)',
            opacity: activeTab === 'overview' ? 1 : 0.75,
            boxShadow: activeTab === 'overview' ? '0 4px 12px var(--primary-glow)' : 'none'
          }}
        >
          📊 Overview
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          style={{
            padding: '0.65rem 1.25rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
            fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s',
            background: activeTab === 'pending' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'pending' ? '#ffffff' : 'var(--foreground)',
            opacity: activeTab === 'pending' ? 1 : 0.75,
            boxShadow: activeTab === 'pending' ? '0 4px 12px var(--primary-glow)' : 'none',
            display: 'flex', alignItems: 'center', gap: '0.45rem'
          }}
        >
          ⏳ Pending Reviews
          {pendingProfilesCount > 0 && (
            <span style={{
              background: activeTab === 'pending' ? 'white' : 'var(--accent)',
              color: activeTab === 'pending' ? 'var(--primary)' : 'white',
              fontSize: '0.75rem', fontWeight: 800, padding: '0.1rem 0.45rem',
              borderRadius: '20px', lineHeight: 1.2
            }}>
              {pendingProfilesCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('directory')}
          style={{
            padding: '0.65rem 1.25rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
            fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s',
            background: activeTab === 'directory' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'directory' ? '#ffffff' : 'var(--foreground)',
            opacity: activeTab === 'directory' ? 1 : 0.75,
            boxShadow: activeTab === 'directory' ? '0 4px 12px var(--primary-glow)' : 'none'
          }}
        >
          👥 Service Professionals
        </button>
        <button
          onClick={() => setActiveTab('leads')}
          style={{
            padding: '0.65rem 1.25rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
            fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s',
            background: activeTab === 'leads' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'leads' ? '#ffffff' : 'var(--foreground)',
            opacity: activeTab === 'leads' ? 1 : 0.75,
            boxShadow: activeTab === 'leads' ? '0 4px 12px var(--primary-glow)' : 'none'
          }}
        >
          📋 Recent Leads
        </button>
      </div>

      {/* ── 1. TAB: OVERVIEW ── */}
      {activeTab === 'overview' && (
        <div className="flex flex-col gap-6">
          {/* Action Callouts */}
          {pendingProfilesCount > 0 && (
            <div className="glass animate-fade-in" style={{
              padding: '1.25rem 1.5rem', borderLeft: '4px solid var(--accent)', background: 'rgba(245,158,11,0.05)',
              borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                <span style={{ fontSize: '2rem' }}>🚨</span>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent)' }}>Verification Reviews Outstanding</h3>
                  <p style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: '0.1rem' }}>
                    There are {pendingProfilesCount} handyman profile submissions awaiting identity, background check, and credential verification audits.
                  </p>
                </div>
              </div>
              <button onClick={() => setActiveTab('pending')} className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', boxShadow: 'none', background: 'var(--accent)' }}>
                Audit Profiles Now →
              </button>
            </div>
          )}

          {/* Quick Lead table snippet */}
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Lead Routing Activity</h2>
              <button onClick={() => setActiveTab('leads')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                View Full Routing Logs →
              </button>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', opacity: 0.6, fontSize: '0.8rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Date</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Professional</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Customer</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Task Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.slice(0, 5).map(lead => (
                    <tr key={lead.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                      <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', opacity: 0.8 }}>{new Date(lead.created_at).toLocaleDateString()}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{lead.profiles?.name || 'Unknown Pro'}</span>
                        <span style={{ marginLeft: '0.5rem', background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '10px', fontWeight: 600 }}>
                          {lead.profiles?.trade || 'N/A'}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontSize: '0.88rem' }}>
                        <div>{lead.name}</div>
                        <div style={{ opacity: 0.6, fontSize: '0.75rem', fontFamily: 'monospace' }}>{lead.phone}</div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', opacity: 0.9 }}>{lead.task}</td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>No lead routing requests logged in database.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── 2. TAB: PENDING AUDITS ── */}
      {activeTab === 'pending' && (
        <div className="glass animate-fade-in" style={{ padding: '2rem', borderRadius: '16px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>⏳ Awaiting Document Audit</h2>
          <p style={{ opacity: 0.6, fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Review official documents (Aadhaar, PAN, Police checks) and private address details of recently onboarding professionals to approve or request re-uploads.
          </p>

          {pendingProfiles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', opacity: 0.6 }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>✅</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Inbox Fully Cleared!</h3>
              <p style={{ fontSize: '0.82rem', marginTop: '0.2rem' }}>All professionals who completed onboarding have been reviewed and verified.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', opacity: 0.6, fontSize: '0.8rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.85rem 1rem' }}>Professional</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Contact Details</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Registered On</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Onboarding Status</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingProfiles.map(pro => (
                    <tr key={pro.id} style={{ borderBottom: '1px solid var(--card-border)', verticalAlign: 'middle' }}>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            background: 'rgba(0,0,0,0.05)', border: '1.5px solid var(--accent)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            overflow: 'hidden', flexShrink: 0
                          }}>
                            {pro.avatar ? (
                              <img src={pro.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <span style={{ fontSize: '1.2rem' }}>👤</span>
                            )}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{pro.name}</div>
                            <span style={{ background: 'rgba(217, 119, 6, 0.12)', color: 'var(--accent)', fontSize: '0.72rem', padding: '0.1rem 0.45rem', borderRadius: '10px', fontWeight: 600 }}>
                              {pro.trade}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                        <div style={{ fontFamily: 'monospace', fontWeight: 600 }}>{pro.phone || 'No phone'}</div>
                        {pro.email && <div style={{ fontSize: '0.78rem', opacity: 0.7, wordBreak: 'break-all' }}>{pro.email}</div>}
                        <div style={{ opacity: 0.6, fontSize: '0.78rem', marginTop: '0.1rem' }}>{pro.location}</div>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.85rem', opacity: 0.8 }}>
                        {pro.created_at ? new Date(pro.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' }) : '—'}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {pro.pending_avatar && (
                          <span style={{ background: 'rgba(217, 119, 6, 0.15)', color: 'var(--accent)', fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '20px', fontWeight: 600, marginRight: '0.5rem', display: 'inline-block' }}>
                            📷 Photo Change
                          </span>
                        )}
                        {pro.onboarding_completed && !pro.verified && (
                          <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '20px', fontWeight: 600, display: 'inline-block' }}>
                            🏁 Document Audit
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <button
                          onClick={() => setSelectedPro(pro)}
                          className="btn btn-primary animate-pulse"
                          style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))', border: 'none', boxShadow: 'none' }}
                        >
                          🔍 Audit Documents
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── 3. TAB: ALL PROFESSIONALS ── */}
      {activeTab === 'directory' && (
        <div className="glass animate-fade-in" style={{ padding: '2rem', borderRadius: '16px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>👥 Service Professional Directory</h2>
          <p style={{ opacity: 0.6, fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Audit, verify, inspect documents, or revoke verification status for all registered carpenters, painters, and handymen on the platform.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '850px', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', opacity: 0.6, fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>Professional</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Trade</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Contact</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Experience</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Onboarding Step</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map(pro => (
                  <tr key={pro.id} style={{ borderBottom: '1px solid var(--card-border)', verticalAlign: 'middle' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          background: 'rgba(0,0,0,0.05)', border: `1.5px solid ${pro.verified ? 'var(--success)' : 'rgba(0,0,0,0.12)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          overflow: 'hidden', flexShrink: 0
                        }}>
                          {pro.avatar ? (
                            <img src={pro.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ fontSize: '1.1rem' }}>👤</span>
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{pro.name}</div>
                          <span style={{ opacity: 0.6, fontSize: '0.72rem' }}>slug: {pro.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ background: 'var(--secondary)', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '8px', fontWeight: 600 }}>
                        {pro.trade}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem' }}>
                      <div style={{ fontFamily: 'monospace', fontWeight: 600 }}>{pro.phone || '—'}</div>
                      {pro.email && <div style={{ fontSize: '0.75rem', opacity: 0.7, wordBreak: 'break-all' }}>{pro.email}</div>}
                      <div style={{ opacity: 0.6, fontSize: '0.75rem' }}>{pro.location}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', fontWeight: 600, opacity: 0.8 }}>
                      {pro.experience || 'Not specified'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem' }}>
                      {pro.onboarding_completed ? (
                        <span style={{ color: 'var(--success)', fontWeight: 600 }}>Completed 🏁</span>
                      ) : (
                        <span style={{ opacity: 0.6 }}>Step {pro.onboarding_step || 1} of 4</span>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {pro.verified ? (
                        <span style={{ background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.75rem', padding: '0.25rem 0.65rem', borderRadius: '20px', fontWeight: 700, display: 'inline-flex', gap: '0.2rem', alignItems: 'center' }}>
                          ✓ Verified
                        </span>
                      ) : (
                        <span style={{ background: 'rgba(217, 119, 6, 0.12)', color: 'var(--accent)', fontSize: '0.75rem', padding: '0.25rem 0.65rem', borderRadius: '20px', fontWeight: 700 }}>
                          Pending
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedPro(pro)}
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
                {profiles.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>No registered professionals found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 4. TAB: RECENT LEADS ── */}
      {activeTab === 'leads' && (
        <div className="glass animate-fade-in" style={{ padding: '2rem', borderRadius: '16px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>📋 Customer Lead Routing Logs</h2>
          <p style={{ opacity: 0.6, fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Full history of customer service booking inquiries routed to professional handymen.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '850px', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', opacity: 0.6, fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>Date & Time</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Assigned Professional</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Customer Name</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Customer Contact</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Task Requested</th>
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => (
                  <tr key={lead.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', opacity: 0.8 }}>
                      {new Date(lead.created_at).toLocaleString()}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ fontWeight: 700 }}>{lead.profiles?.name || 'Unknown Pro'}</span>
                      <br />
                      <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{lead.profiles?.trade || 'N/A'}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.9rem', fontWeight: 600 }}>
                      {lead.name}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                      {lead.phone}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', opacity: 0.9 }}>
                      {lead.task}
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>No leads found in the database.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── DOCUMENT AUDIT OVERLAY/MODAL ── */}
      {selectedPro && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '2rem'
        }}>
          <div style={{
            width: '100%', maxWidth: '1050px', maxHeight: '90vh',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            boxShadow: '0 25px 60px -15px rgba(0,0,0,0.5)', border: '1px solid var(--glass-border)',
            borderRadius: '24px', background: 'var(--background, #FAF8F5)',
            color: 'var(--foreground)'
          }}>
            
            {/* Modal Header */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '1.25rem 2rem', borderBottom: '1px solid var(--glass-border)',
              background: 'var(--card-bg, #F5EFE6)'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Document Audit
                </span>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>Audit Profile: {selectedPro.name}</h2>
              </div>
              <button
                onClick={() => { setSelectedPro(null); setActionStatus({ type: '', message: '' }); }}
                style={{
                  background: 'rgba(0,0,0,0.06)', border: 'none', color: 'var(--foreground)',
                  width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer',
                  fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 'bold'
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{
              display: 'flex', flex: 1, overflowY: 'auto', flexWrap: 'wrap',
              background: 'var(--background, #FAF8F5)'
            }}>
              
              {/* Left Column: Pro Profile Details */}
              <div style={{
                flex: '1', minWidth: '320px', padding: '1.75rem',
                borderRight: '1px solid var(--glass-border)',
                display: 'flex', flexDirection: 'column', gap: '1.25rem'
              }}>
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                  <div style={{
                    width: '72px', height: '72px', borderRadius: '50%',
                    border: '2.5px solid var(--primary)', overflow: 'hidden', flexShrink: 0,
                    background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {selectedPro.avatar ? (
                      <img src={selectedPro.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '2rem' }}>👤</span>
                    )}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>{selectedPro.name}</h3>
                    <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.35rem', alignItems: 'center' }}>
                      <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: '8px', fontWeight: 600 }}>
                        {selectedPro.trade}
                      </span>
                      {selectedPro.verified ? (
                        <span style={{ background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '8px', fontWeight: 700 }}>
                          Verified ✓
                        </span>
                      ) : (
                        <span style={{ background: 'rgba(217, 119, 6, 0.12)', color: 'var(--accent)', fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '8px', fontWeight: 700 }}>
                          Awaiting Review
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pending Profile Image Change Section */}
                {selectedPro.pending_avatar && (
                  <div style={{
                    padding: '1.25rem',
                    border: '1.5px dashed var(--accent)',
                    borderRadius: '14px',
                    background: 'rgba(217, 119, 6, 0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    marginTop: '0.25rem'
                  }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <div style={{ 
                        width: '60px', 
                        height: '60px', 
                        borderRadius: '50%', 
                        border: '2px solid var(--accent)', 
                        overflow: 'hidden', 
                        flexShrink: 0, 
                        cursor: 'zoom-in',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0,0,0,0.05)'
                      }} onClick={() => setZoomedImage({ title: 'Pending Profile Image Update', url: selectedPro.pending_avatar })}>
                        <img src={selectedPro.pending_avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Pending Avatar" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '0.85rem', fontWeight: 800, margin: 0, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <span>📷</span> Photo Update Requested
                        </h4>
                        <p style={{ opacity: 0.7, fontSize: '0.75rem', margin: '0.15rem 0 0 0', lineHeight: 1.3 }}>
                          Review and approve/reject the professional's request to change their public profile photo.
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <button
                        disabled={processingId !== null}
                        onClick={() => handleVerifyAction(selectedPro.id, 'approve_avatar')}
                        className="btn btn-primary"
                        style={{
                          flex: 1,
                          padding: '0.45rem',
                          fontSize: '0.78rem',
                          background: 'linear-gradient(135deg, #15803d, #16a34a)',
                          border: 'none',
                          boxShadow: 'none'
                        }}
                      >
                        ✓ Approve Photo
                      </button>
                      <button
                        disabled={processingId !== null}
                        onClick={() => handleVerifyAction(selectedPro.id, 'reject_avatar')}
                        className="btn btn-secondary"
                        style={{
                          flex: 1,
                          padding: '0.45rem',
                          fontSize: '0.78rem',
                          borderColor: 'rgba(220,38,38,0.4)',
                          color: '#b91c1c',
                          background: 'rgba(220,38,38,0.05)'
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', background: 'var(--card-bg, #F5EFE6)', border: '1px solid var(--glass-border)', padding: '1.25rem', borderRadius: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                    <span style={{ opacity: 0.6, fontSize: '0.85rem' }}>Registered Slug</span>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', fontFamily: 'monospace' }}>{selectedPro.slug}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                    <span style={{ opacity: 0.6, fontSize: '0.85rem' }}>Public Experience</span>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>💪 {selectedPro.experience || 'Not specified'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                    <span style={{ opacity: 0.6, fontSize: '0.85rem' }}>Mobile Contact</span>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary)', fontFamily: 'monospace' }}>{selectedPro.phone || 'None'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', alignItems: 'center' }}>
                    <span style={{ opacity: 0.6, fontSize: '0.85rem' }}>Email Address</span>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: selectedPro.email ? 'var(--foreground)' : 'var(--foreground-muted)', wordBreak: 'break-all', textAlign: 'right' }}>
                      {selectedPro.email || 'None'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                    <span style={{ opacity: 0.6, fontSize: '0.85rem' }}>Service Range</span>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>📍 {selectedPro.location || 'Bangalore'}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <span style={{ opacity: 0.6, fontSize: '0.85rem' }}>Private Home Address</span>
                    <span style={{ fontSize: '0.82rem', lineHeight: 1.4 }}>🏠 {selectedPro.full_address || 'Address missing'}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.6 }}>About / Description</h4>
                  <p style={{ fontSize: '0.85rem', opacity: 0.8, lineHeight: 1.5, background: 'var(--card-bg, #F5EFE6)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '10px' }}>
                    {selectedPro.about || 'No about biography supplied by professional.'}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.6 }}>Specialty Skills</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {selectedPro.skills && selectedPro.skills.map((s, idx) => (
                      <span key={idx} style={{ background: 'var(--card-bg)', border: '1px solid var(--glass-border)', fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '6px' }}>
                        ✨ {s}
                      </span>
                    ))}
                    {(!selectedPro.skills || selectedPro.skills.length === 0) && (
                      <span style={{ opacity: 0.5, fontSize: '0.8rem' }}>None specified</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Uploaded Documents Panel */}
              <div style={{
                flex: '1.4', minWidth: '360px', padding: '1.75rem',
                display: 'flex', flexDirection: 'column', gap: '1.75rem'
              }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', margin: 0 }}>
                  💳 Verification Documents
                </h3>

                {/* 1. Aadhaar Card Card */}
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>📇 Aadhaar Card (Identity & Private Address Proof)</span>
                  </h4>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '160px' }}>
                      <div style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: '0.35rem', fontWeight: 600 }}>Front Side Scan</div>
                      {selectedPro.aadhaar_front ? (
                        <div style={{ border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.25rem', background: 'var(--card-bg)', cursor: 'zoom-in', overflow: 'hidden', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                             onClick={() => setZoomedImage({ title: 'Aadhaar Card - Front Side', url: selectedPro.aadhaar_front })}>
                          <img src={selectedPro.aadhaar_front} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '4px', transition: 'transform 0.2s' }} />
                        </div>
                      ) : (
                        <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,0.06)', border: '1px dashed rgba(239,68,68,0.25)', borderRadius: '8px', color: '#b91c1c', fontSize: '0.78rem' }}>
                          ⚠️ File Missing
                        </div>
                      )}
                    </div>
                    
                    <div style={{ flex: 1, minWidth: '160px' }}>
                      <div style={{ fontSize: '0.75rem', opacity: 0.6, marginBottom: '0.35rem', fontWeight: 600 }}>Back Side (Address) Scan</div>
                      {selectedPro.aadhaar_back ? (
                        <div style={{ border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.25rem', background: 'var(--card-bg)', cursor: 'zoom-in', overflow: 'hidden', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                             onClick={() => setZoomedImage({ title: 'Aadhaar Card - Back Side', url: selectedPro.aadhaar_back })}>
                          <img src={selectedPro.aadhaar_back} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '4px' }} />
                        </div>
                      ) : (
                        <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,0.06)', border: '1px dashed rgba(239,68,68,0.25)', borderRadius: '8px', color: '#b91c1c', fontSize: '0.78rem' }}>
                          ⚠️ File Missing
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. PAN Card & Voter ID */}
                <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                  
                  {/* PAN Front */}
                  <div style={{ flex: 1, minWidth: '180px' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>💳 PAN Card (Tax Identity)</h4>
                    {selectedPro.pan_front ? (
                      <div style={{ border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.25rem', background: 'var(--card-bg)', cursor: 'zoom-in', overflow: 'hidden', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                           onClick={() => setZoomedImage({ title: 'PAN Card - Front', url: selectedPro.pan_front })}>
                        <img src={selectedPro.pan_front} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '4px' }} />
                      </div>
                    ) : (
                      <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,0.06)', border: '1px dashed rgba(239,68,68,0.25)', borderRadius: '8px', color: '#b91c1c', fontSize: '0.78rem' }}>
                        ⚠️ File Missing
                      </div>
                    )}
                  </div>

                  {/* Voter ID / DL Front */}
                  <div style={{ flex: 1, minWidth: '180px' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>🪪 Voter ID / License</h4>
                    {selectedPro.voter_driving_front ? (
                      <div style={{ border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.25rem', background: 'var(--card-bg)', cursor: 'zoom-in', overflow: 'hidden', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                           onClick={() => setZoomedImage({ title: 'Voter ID / License Scan', url: selectedPro.voter_driving_front })}>
                        <img src={selectedPro.voter_driving_front} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '4px' }} />
                      </div>
                    ) : (
                      <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,0.06)', border: '1px dashed rgba(239,68,68,0.25)', borderRadius: '8px', color: '#b91c1c', fontSize: '0.78rem' }}>
                        ⚠️ File Missing
                      </div>
                    )}
                  </div>

                </div>

                {/* 3. Police Verification Certificate */}
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>👮 Police Verification Certificate (Safety Standard)</h4>
                  {selectedPro.police_verification ? (
                    <div style={{
                      border: '1px dashed var(--glass-border)', borderRadius: '12px', padding: '1rem',
                      background: 'var(--card-bg)', position: 'relative'
                    }}>
                      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                        <div style={{ fontSize: '2.2rem' }}>📄</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Official Certificate Scanned Image</div>
                          <div style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '0.15rem' }}>Audit and confirm clean records check.</div>
                          <button
                            onClick={() => setZoomedImage({ title: 'Police Verification Certificate', url: selectedPro.police_verification })}
                            className="btn btn-secondary"
                            style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', marginTop: '0.5rem', display: 'inline-flex', gap: '0.3rem' }}
                          >
                            🔎 View Full size Scan
                          </button>
                        </div>
                        <div style={{ width: '80px', height: '60px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                          <img src={selectedPro.police_verification} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,0.06)', border: '1px dashed rgba(239,68,68,0.25)', borderRadius: '12px', color: '#b91c1c' }}>
                      <span style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>⚠️</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>No Police Certificate Uploaded!</span>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Modal Actions Footer */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '1.25rem 2rem', borderTop: '1px solid var(--glass-border)',
              background: 'var(--card-bg, #F5EFE6)', flexWrap: 'wrap', gap: '1rem'
            }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Current Listing:</span>
                {selectedPro.verified ? (
                  <span style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '0.85rem' }}>✓ Active & Verified</span>
                ) : (
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.85rem' }}>⏳ Hidden / Inactive</span>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  disabled={processingId !== null}
                  onClick={() => setRejectModalPro(selectedPro)}
                  className="btn btn-secondary"
                  style={{
                    padding: '0.6rem 1.25rem', fontSize: '0.88rem', border: '1px solid rgba(220,38,38,0.3)',
                    color: '#b91c1c', background: 'rgba(220,38,38,0.05)'
                  }}
                >
                  ❌ Decline & Request Re-upload
                </button>
                
                <button
                  disabled={processingId !== null || selectedPro.verified}
                  onClick={() => handleVerifyAction(selectedPro.id, 'verify')}
                  className="btn btn-primary"
                  style={{
                    padding: '0.6rem 1.6rem', fontSize: '0.88rem',
                    background: selectedPro.verified ? 'rgba(0,0,0,0.08)' : 'linear-gradient(135deg, #15803d, #16a34a)',
                    border: 'none', color: selectedPro.verified ? 'rgba(0,0,0,0.3)' : 'white',
                    boxShadow: selectedPro.verified ? 'none' : '0 4px 15px rgba(22,163,74,0.35)',
                    cursor: selectedPro.verified ? 'not-allowed' : 'pointer'
                  }}
                >
                  {processingId === selectedPro.id ? 'Processing…' : (selectedPro.verified ? '✓ Already Verified' : '✅ Approve & Verify Profile')}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── IMAGE ZOOM SUB-MODAL ── */}
      {zoomedImage && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.95)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          zIndex: 2000, padding: '1rem'
        }} onClick={() => setZoomedImage(null)}>
          <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', color: 'white' }}>
            <span style={{ fontWeight: 600, fontSize: '0.95rem', opacity: 0.8 }}>{zoomedImage.title}</span>
            <button
              style={{
                background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white',
                width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer',
                fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
              }}
              onClick={() => setZoomedImage(null)}
            >
              ✕
            </button>
          </div>
          
          <div style={{ maxWidth: '90%', maxHeight: '85%', overflow: 'hidden', borderRadius: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', background: '#1e293b', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
               onClick={e => e.stopPropagation()}>
            <img src={zoomedImage.url} style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '4px' }} />
          </div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginTop: '1.5rem' }}>
            Click anywhere outside the image to return to audit panel
          </div>
        </div>
      )}

      {/* Custom keyframes injection */}
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.02); }
        }
        .animate-pulse {
          animation: pulse 2s infinite ease-in-out;
        }
      `}</style>
      {/* ── REJECTION REASON DIALOG MODAL ── */}
      {rejectModalPro && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.75)', zIndex: 2500,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(8px)'
        }}>
          <div style={{
            width: '100%', maxWidth: '620px', borderRadius: '18px', overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)',
            background: 'var(--background, #FAF8F5)', color: 'var(--foreground)',
            maxHeight: '90vh', display: 'flex', flexDirection: 'column'
          }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--glass-border)', background: 'var(--card-bg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                  ⚠️ Decline Onboarding & Request Re-upload
                </h3>
                <p style={{ fontSize: '0.8rem', opacity: 0.7, margin: '0.2rem 0 0 0' }}>
                  Professional: <strong>{rejectModalPro.name}</strong> ({rejectModalPro.email || rejectModalPro.phone})
                </p>
              </div>
              <button onClick={() => setRejectModalPro(null)} style={{ background: 'none', border: 'none', color: 'var(--foreground)', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>

            <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* 1. Quick reason checkboxes */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.6rem' }}>
                  Select Issue(s) with Uploaded Documents:
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {REJECTION_PRESETS.map((preset, idx) => {
                    const isChecked = rejectReasons.includes(preset);
                    return (
                      <label
                        key={idx}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.55rem 0.85rem',
                          background: isChecked ? 'rgba(220,38,38,0.08)' : 'var(--card-bg)',
                          border: `1px solid ${isChecked ? 'rgba(220,38,38,0.3)' : 'var(--glass-border)'}`,
                          borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem', transition: 'all 0.15s'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) setRejectReasons(prev => [...prev, preset]);
                            else setRejectReasons(prev => prev.filter(r => r !== preset));
                          }}
                          style={{ accentColor: '#dc2626' }}
                        />
                        <span style={{ color: isChecked ? '#b91c1c' : 'inherit', fontWeight: isChecked ? 600 : 400 }}>{preset}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 2. Custom explanation note */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
                  Additional Explanation / Notes for Professional:
                </label>
                <textarea
                  rows={3}
                  value={rejectCustomMessage}
                  onChange={e => setRejectCustomMessage(e.target.value)}
                  placeholder="e.g. Please capture a flat photo of Aadhaar with all 4 corners visible in bright lighting..."
                  style={{
                    width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)',
                    background: 'var(--card-bg)', color: 'var(--foreground)', fontSize: '0.85rem', resize: 'vertical'
                  }}
                />
              </div>

              {/* 3. Re-open Step Selector */}
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
                  Reopen Onboarding Wizard At:
                </label>
                <select
                  value={rejectTargetStep}
                  onChange={e => setRejectTargetStep(Number(e.target.value))}
                  style={{
                    width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--glass-border)',
                    background: 'var(--card-bg)', color: 'var(--foreground)', fontSize: '0.85rem'
                  }}
                >
                  <option value={2}>Step 2: Identity Documents (Aadhaar & PAN Scans)</option>
                  <option value={3}>Step 3: Background Verification & Profile Photo</option>
                  <option value={1}>Step 1: Address & Basic Experience</option>
                </select>
              </div>
            </div>

            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--glass-border)', background: 'var(--card-bg)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setRejectModalPro(null)}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={processingId !== null || (rejectReasons.length === 0 && !rejectCustomMessage.trim())}
                onClick={() => handleVerifyAction(rejectModalPro.id, 'reject', {
                  reasons: rejectReasons,
                  customMessage: rejectCustomMessage,
                  targetStep: rejectTargetStep,
                })}
                className="btn btn-primary"
                style={{
                  padding: '0.5rem 1.5rem', fontSize: '0.85rem', background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  border: 'none', opacity: (rejectReasons.length === 0 && !rejectCustomMessage.trim()) ? 0.5 : 1
                }}
              >
                {processingId === rejectModalPro.id ? 'Sending Notice…' : '✉️ Send Rejection & Re-open Uploads'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
